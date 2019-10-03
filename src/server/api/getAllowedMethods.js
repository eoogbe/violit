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

/** Formats the allowed methods into their full uppercase form. */
const formatAllowedMethods = (methods) => R.compose(
  R.sort((a, b) => a.localeCompare(b)),
  R.uniq,
  R.map(R.toUpper),
  R.append('options'),
  R.concat(methods.includes('get') ? ['head'] : [])
)(methods);

/** Filters the specified `methods` by their corresponding `policies`. */
const filterMethodsByPolicy = async ({ methods, policies, req, res }) => {
  if (!policies) {
    return methods;
  }

  const maybeMethods = await Promise.all(methods.map(async (method) => {
    const policy = policies[method];
    if (!policy) {
      return method;
    }

    const isAllowed = await policy(req, res);
    return isAllowed && method;
  }));

  return maybeMethods.filter(Boolean);
};

/** Returns the list of allowed methods. */
module.exports = async (args) => {
  const methods = await filterMethodsByPolicy(args);
  return formatAllowedMethods(methods);
};
