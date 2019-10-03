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

const { href, parseRequestBody } = require('../../routing');
const createUserCollection = require('./createUserCollection');

/** The users controller. */
module.exports = {
  post: async (req, res) => {
    const { credentials, model, routes } = res.locals;
    const { sign } = model.auth;
    const { createUser, getUserById } = model.users;
    const input = parseRequestBody(req);
    const user = await createUser(input);
    const token = await sign(user);
    const location = href(routes.user(user.username));

    res.cookie('token', token, { httpOnly: true })
      .status(201)
      .set('Location', location)
      .set('Content-Location', location);

    return createUserCollection({
      credentials: user,
      routes
    })(user);
  },
};
