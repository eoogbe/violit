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

const createError = require('http-errors');
const R = require('ramda');

/**
 * Returns the path to the invalid field in the request body, or `null` if no
 * field is missing.
 */
const getInvalidField = ({ template }) => {
  if (!R.is(Object, template)) {
    return 'template';
  }

  const { data } = template;
  if (!R.is(Array, data)) {
    return 'template.data';
  }

  return null;
};

/** Converts a Collection+JSON item into an object. */
const itemToObject = ({ data }) =>
  data.reduce((acc, { name, value }) => ({
    ...acc,
    [name]: value,
  }), {});

/** Validates the format of the request body. */
module.exports = ({ body }) => {
  const field = getInvalidField(body);
  if (field) {
    throw createError(400, `Request body has invalid field '${field}'`, {
      expose: true,
    });
  }

  return itemToObject(body.template);
};
