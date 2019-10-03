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
const href = require('./href');

/**
 * Prepends the specified `value` to an array in an object at the specified
 * `key`.
 *
 * Creates a new array if one does not already exist.
 */
const createOrPrepend = (key) => (value) => (obj) => ({
  ...obj,
  [key]: R.prepend(value, obj[key] || []),
});

/** Converts an object into a Collection+JSON item. */
const objectToItem = (keys, obj) => ({
  data: keys.map((name) => ({ name, value: obj[name] || '' })),
});

const addLink = (path) => (rel) =>
  createOrPrepend('links')({ rel, href: href(path) });

module.exports = {
  /** Creates the base collection. */
  base: (path) => (auth) => {
    const authRels = auth ? ['authenticated-as', 'logout'] : ['authenticate'];
    const registerRels = auth ? [] : ['register-user'];
    const collection = {
      version: '1.0',
      href: href(path),
    };
    const addAuthLinks = authRels.map(addLink('/auth'));
    const addRegisterLinks = registerRels.map(addLink('/users'));
    return R.compose(
      addLink()('home'),
      ...addAuthLinks,
      ...addRegisterLinks
    )(collection);
  },

  /** Sets the error of the collection. */
  withError: R.assoc('error'),

  /** Sets the template of the collection. */
  withTemplate: (keys) => (obj) =>
    R.assoc('template', objectToItem(keys, obj)),

  /** Adds a link to the collection. */
  addLink,

  /** Adds an item to the collection. */
  addItem: createOrPrepend('items'),

  /** Creates an item from an object. */
  item: (path) => (keys) => (obj) =>
    R.assoc('href', href(path), objectToItem(keys, obj)),
};
