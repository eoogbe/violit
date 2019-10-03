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

const bcrypt = require('bcrypt');
const createError = require('http-errors');
const uuid = require('uuid/v4');
const { validateRequired } = require('../utils');

const SALT_ROUNDS = 10;

const SELECT_USER_BY_ID_SQL =
`SELECT username
FROM user
WHERE id = :id`;

const SELECT_USER_BY_USERNAME_SQL =
`SELECT username
FROM user
WHERE username = :username`;

const INSERT_USER_SQL =
`INSERT INTO user (id, username, password)
VALUES (:id, :username, :password)`;

const getUserById = (id, { db }) =>
  db.prepare(SELECT_USER_BY_ID_SQL).get({ id });

const getUserByUsername = (username, { db }) =>
  db.prepare(SELECT_USER_BY_USERNAME_SQL).get({ username });

/**
 * Validates that the specified `username` is correct, formatting the result.
 */
const validateUsername = (username, { db }) => {
  validateRequired('Username', username);

  if (!/^[\w-]+$/.test(username)) {
    throw createError(
      422,
      'Username can only have letters, numbers, \'-\', or \'_\'.',
      { expose: true },
    );
  }

  if (!/^[A-Z]/i.test(username)) {
    throw createError(422, 'Username must start with a letter.', {
      expose: true,
    });
  }

  if (getUserByUsername(username, { db })) {
    throw createError(422, 'Username is already taken.', {
      expose: true,
    });
  }

  return username;
};

/**
 * Validates that the specified `password` is correct, formatting the result.
 */
const validatePassword = (password) => {
  validateRequired('Password', password);

  if (password.length < 8) {
    throw createError(422, 'Password must be at least 8 characters.');
  }

  return password;
};

/** Creates the users model. */
module.exports = ({ db }) => ({
  /** Finds a user by the specified `id`. */
  getUserById: (id) => {
    const user = getUserById(id, { db });
    if (!user) {
      throw new createError.NotFound();
    }

    return user;
  },

  /** Finds a user by the specified `username`. */
  getUserByUsername: (username) => {
    const user = getUserByUsername(username, { db });
    if (!user) {
      throw new createError.NotFound();
    }

    return user;
  },

  /** Creates a user. */
  createUser: async (input) => {
    const username = validateUsername(input.username, { db });
    const password = validatePassword(input.password);

    const id = uuid();
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    db.prepare(INSERT_USER_SQL).run({
      id,
      username,
      password: hashedPassword,
    });

    return getUserById(id, { db });
  },
});
