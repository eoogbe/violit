/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('fs');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const SELECT_USER_BY_USERNAME_SQL =
`SELECT username, password
FROM user
WHERE username = :username`;

const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8');
const publicKey = fs.readFileSync(process.env.PUBLIC_KEY_PATH, 'utf8');

const sign = ({ username }) => {
  const payload = {
    iat: Math.floor(Date.now() / 1000),
  };
  const options = {
    algorithm: 'RS256',
    subject: username,
  };
  return new Promise((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        return reject(err);
      }

      resolve(token);
    });
  });
};

const verify = (token) => {
  const options = {
    algorithms: ['RS256'],
    maxAge: '1w',
  };
  return new Promise((resolve, reject) => {
    jwt.verify(token, publicKey, options, (err, decoded) => {
      if (err) {
        return reject(err);
      }

      resolve(decoded);
    });
  });
};

/** Creates the auth model. */
module.exports = ({ db }) => ({
  /** Signs a JWT claim. */
  sign,

  /** Verifies the specified JWT `token`. */
  verify,

  /** Finds the credentials of a user. */
  getCredentials: async (token) => {
    let credentials;
    try {
      credentials = await verify(token);
    } catch (err) {
      throw createError(403, err, {
        message: 'Not authenticated',
        expose: true,
      });
    }

    return { username: credentials.sub };
  },

  /** Creates user credentials. */
  createCredentials: async ({ username, password }) => {
    const user = db.prepare(SELECT_USER_BY_USERNAME_SQL).get({ username });
    if (!user) {
      throw new createError.NotFound('Username or password is incorrect');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new createError.NotFound('Username or password is incorrect');
    }

    return sign({ username });
  },
});
