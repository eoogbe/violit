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
const { coll } = require('../../routing');

const THREAD_KEYS = [
  'id',
  'slug',
  'dateCreated',
  'dateDeleted',
  'headline',
  'articleBody',
  'author',
];

/** Converts the specified `thread` into a Collection+JSON item. */
const createItem = ({ credentials, model, routes }) => (thread) => {
  const { canDeleteThread } = model.threads;
  const path = routes.thread(thread.slug);
  const item = R.compose(
    coll.addLink(routes.board())('isPartOf'),
    coll.addLink(routes.comments(thread.slug))('comment')
  )(coll.item(path)(THREAD_KEYS)(thread));
  if (!canDeleteThread(thread, credentials)) {
    return item;
  }

  return R.compose(
    coll.addLink(routes.threadDelete(thread.slug))('deleteAction')
  )(item);
};

/** Adds the specified `threads` as the collection's items. */
module.exports = (args) => (threads) => {
  const addItems = threads.map(createItem(args)).map(coll.addItem);
  return R.compose(...addItems);
};
