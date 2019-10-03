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

/** Creates a thread delete action item without any links. */
const createBaseThreadDeleteItem = (path) => (thread) => {
  if (!thread.dateDeleted) {
    return coll.item(path)(['actionStatus'])({
      actionStatus: 'potentialActionStatus',
    });
  }

  return coll.item(path)(['actionStatus', 'endTime'])({
    actionStatus: 'completedActionStatus',
    endTime: thread.dateDeleted,
  });
};

/**
 * Creates the Collection+JSON representation of the thread delete action
 * resource.
 */
const createThreadDeleteCollection = ({ credentials, routes }) => (thread) => {
  const path = routes.threadDelete(thread.slug);
  const item = R.compose(
    coll.addLink(routes.thread(thread.slug))('object'),
    coll.addLink(routes.board())('targetCollection')
  )(createBaseThreadDeleteItem(path)(thread));
  return R.compose(
    coll.addItem(item)
  )(coll.base(path)(credentials));
};

/** The controller for the thread delete action resource. */
module.exports = {
  get: (req, res) => {
    const { model } = res.locals;
    const { getThreadBySlug } = model.threads;
    const thread = getThreadBySlug(req.params.threadSlug);
    return createThreadDeleteCollection(res.locals)(thread);
  },
  post: (req, res) => {
    const { model } = res.locals;
    const { softDeleteThread } = model.threads;
    const thread = softDeleteThread(req.params.threadSlug);
    return createThreadDeleteCollection(res.locals)(thread);
  },
};
