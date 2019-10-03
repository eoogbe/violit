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

import camelCase from 'camel-case';
import * as R from 'ramda';

/** Validates that the specified `value` is a string. */
const validateString = (name, value) => {
  if (!R.is(String, value)) {
    throw new Error(`${name} must be a string, but instead is ${value}`);
  }
};

/** Validates that the specified `value` is an array. */
const validateArray = (name, value) => {
  if (!R.is(Array, value)) {
    throw new Error(`${name} must an array, but instead is ${value}`);
  }
};

/** Factory for a group of action creators. */
export default (ns, defs) => {
  validateString('namespace', ns);
  validateArray('action definitions', defs);

  return defs.reduce((acc, def) => {
    const [baseType, ...keys] = [].concat(def);
    const type = `${ns}/${baseType}`;
    const name = camelCase(`${baseType}`);
    const creator = (...args) => ({
      type,
      payload: R.zipObj(keys, args),
    });
    creator.type = type;
    return {
      ...acc,
      [name]: creator,
    };
  }, {});
};
