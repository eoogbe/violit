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
const addCommentItems = require('./addCommentItems');
const createCommentCollection = require('./createCommentCollection');

/** Creates the Collection+JSON representation of the comments resource. */
const createCommentsCollection = ({ req, res, comments }) => {
  const { credentials, routes } = res.locals;
  const path = routes.comments(req.params.threadSlug);
  let collection = coll.base(path)(credentials);

  if (comments.length) {
    collection = R.compose(
      addCommentItems(res.locals)(comments)
    )(collection);
  }

  if (!policies.comments.post(req, res)) {
    return collection;
  }

  return R.compose(
    coll.withTemplate(['id', 'text'])({})
  )(collection);
};

/** The controller for the comments resource. */
module.exports = {
  get: (req, res) => {
    const { model } = res.locals;
    const { getCommentsByThreadSlug } = model.comments;
    const comments = getCommentsByThreadSlug(req.params.threadSlug);
    return createCommentsCollection({ req, res, comments });
  },
  post: (req, res) => {
    const { credentials, model, routes } = res.locals;
    const { createComment } = model.comments;
    const input = parseRequestBody(req);
    const comment = createComment({
      ...input,
      threadSlug: req.params.threadSlug,
    }, credentials);
    const location = href(routes.comment(comment.id));

    res.status(201)
      .set('Location', location)
      .set('Content-Location', location);

    return createCommentCollection(res.locals)(comment);
  },
};
