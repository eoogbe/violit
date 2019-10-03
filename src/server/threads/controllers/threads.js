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
const { coll, href, parseRequestBody } = require('../../routing');
const policies = require('../policies');
const addThreadItems = require('./addThreadItems');
const createThreadCollection = require('./createThreadCollection');

const createThreadsCollection = ({ req, res, threads }) => {
  const { credentials, routes } = res.locals;
  const collection = R.compose(
    addThreadItems(res.locals)(threads)
  )(coll.base(routes.threads())(credentials));

  if (!policies.threads.post(req, res)) {
    return collection;
  }

  return R.compose(
    coll.withTemplate(['headline', 'articleBody'])({})
  )(collection);
};

/** The controller for the threads resource. */
module.exports = {
  get: (req, res) => {
    const { model } = res.locals;
    const { getThreads } = model.threads;
    const threads = getThreads();
    return createThreadsCollection({ req, res, threads });
  },
  post: (req, res) => {
    const { credentials, model, routes } = res.locals;
    const { createThread } = model.threads;
    const input = parseRequestBody(req);
    const thread = createThread(input, credentials);
    const location = href(routes.thread(thread.slug));

    res.status(201)
      .set('Location', location)
      .set('Content-Location', location);

    return createThreadCollection(res.locals)(thread);
  },
};
