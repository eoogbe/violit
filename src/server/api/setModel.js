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

const defaultDb = require('./db');
const defaultModel = require('./model');

/**
 * Middleware that adds the model to the local response variables if not already
 * present.
 */
module.exports = (req, res, next) => {
  if (res.locals.model) {
    return next();
  }

  res.locals.db = res.locals.db || defaultDb();
  res.locals.model = defaultModel({ db: res.locals.db });
  next();
};
