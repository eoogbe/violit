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

/** Creates a comment delete action item without any links. */
const createBaseCommentDeleteItem = (path) => (comment) => {
  if (!comment.dateDeleted) {
    return coll.item(path)(['actionStatus'])({
      actionStatus: 'potentialActionStatus',
    });
  }

  return coll.item(path)(['actionStatus', 'endTime'])({
    actionStatus: 'completedActionStatus',
    endTime: comment.dateDeleted,
  });
};

/**
 * Creates the Collection+JSON representation of the comment delete action
 * resource.
 */
const createCommentDeleteCollection = ({ credentials, routes }) =>
  (comment) => {
    const path = routes.commentDelete(comment.id);
    const item = R.compose(
      coll.addLink(routes.comment(comment.id))('object'),
      coll.addLink(routes.comments(comment.threadSlug))('targetCollection')
    )(createBaseCommentDeleteItem(path)(comment));
    return R.compose(
      coll.addItem(item)
    )(coll.base(path)(credentials));
  };

/** The controller for the comment delete action resource. */
module.exports = {
  get: (req, res) => {
    const { model } = res.locals;
    const { getCommentById } = model.comments;
    const comment = getCommentById(req.params.commentId);
    return createCommentDeleteCollection(res.locals)(comment);
  },
  post: (req, res) => {
    const { model } = res.locals;
    const { softDeleteComment } = model.comments;
    const comment = softDeleteComment(req.params.commentId);
    return createCommentDeleteCollection(res.locals)(comment);
  },
};
