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

const { STATUS_CODES } = require('http');
const debug = require('debug')('violit:server');
const R = require('ramda');
const { coll } = require('../routing');

/** Converts the error status to the response status. */
const getResponseStatus = (status) => {
  if (!status) {
    return 500;
  }

  if (status < 100) {
    return 500;
  }

  if (status > 599) {
    return 500;
  }

  return status;
};

/** Error-handling middleware. */
module.exports = (err, req, res, next) => {
  debug(`Server error ${err}`);
  const status = getResponseStatus(err.status);
  const apiError = {
    title: STATUS_CODES[err.status] || 'Unknown Error',
    code: err.status,
    message: err.expose ? err.message : null,
  };
  const collection = R.compose(
    coll.withError(apiError)
  )(coll.base(req.path)(res.locals.credentials));
  res.status(status).send({ collection });
};
