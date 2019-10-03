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

const R = require('ramda');
const { parseRequestBody, coll, href } = require('../routing');

/** Creates the Collection+JSON representation of the auth resource. */
const createCollection = ({ path, credentials }) =>
  R.compose(
    coll.addItem(coll.item(path)(['username'])(credentials))
  )(coll.base(path)(credentials));

/** The controller for the auth resource. */
module.exports = {
  get: (req, res) => {
    const { credentials, routes } = res.locals;
    return createCollection({
      path: routes.auth(),
      credentials,
    });
  },
  post: async (req, res) => {
    const { model, routes } = res.locals;
    const { createCredentials } = model.auth;
    const credentials = parseRequestBody(req);
    const token = await createCredentials(credentials);
    const path = routes.auth();
    const location = href(path);

    res.cookie('token', token, { httpOnly: true })
      .status(201)
      .set('Location', location)
      .set('Content-Location', location);

    return createCollection({
      path,
      credentials,
    });
  },
  delete: (_, res) => {
    const { routes }  = res.locals;
    res.clearCookie('token');
    return coll.base(routes.auth())(null);
  },
};
