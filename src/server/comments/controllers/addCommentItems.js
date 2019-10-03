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

const COMMENT_KEYS = [
  'id',
  'dateCreated',
  'dateDeleted',
  'text',
  'author',
  'threadSlug',
];

/** Converts the specified `comment` into a Collection+JSON item. */
const createItem = ({ credentials, model, routes }) => (comment) => {
  const { canDeleteComment } = model.comments;
  const path = routes.comment(comment.id);
  const item = R.compose(
    coll.addLink(routes.thread(comment.threadSlug))('about')
  )(coll.item(path)(COMMENT_KEYS)(comment));
  if (!canDeleteComment(comment, credentials)) {
    return item;
  }

  return R.compose(
    coll.addLink(routes.commentDelete(comment.id))('deleteAction')
  )(item);
};

/** Adds the specified `comments` as the collection's items. */
module.exports = (args) => (comments) => {
  const addItems = comments.map(createItem(args)).map(coll.addItem);
  return R.compose(...addItems);
};
