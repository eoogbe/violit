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
const { validateRequired } = require('../utils');

const SELECT_COMMENTS_BY_THREAD_SLUG_SQL =
`SELECT
  comment.id,
  comment.dateCreated,
  comment.dateDeleted,
  comment.content,
  thread.slug AS threadSlug,
  user.username AS author
FROM comment
  JOIN user
    ON comment.userId = user.id
  JOIN thread
    ON comment.threadId = thread.id
WHERE thread.slug = :threadSlug
ORDER BY comment.dateCreated DESC`;

const SELECT_COMMENT_BY_ID_SQL =
`SELECT
  comment.id,
  comment.dateCreated,
  comment.dateDeleted,
  comment.content,
  thread.slug AS threadSlug,
  user.username AS author
FROM comment
  JOIN user
    ON comment.userId = user.id
  JOIN thread
    ON comment.threadId = thread.id
WHERE comment.id = :id`;

const INSERT_COMMENT_SQL =
`INSERT INTO comment (id, content, userId, threadId)
SELECT :id, :content, user.id, thread.id
FROM user
  CROSS JOIN thread
WHERE user.username = :username
  AND thread.slug = :threadSlug`;

const SET_DATE_DELETED_SQL =
`UPDATE comment
SET dateDeleted = :dateDeleted
WHERE id = :id`;

/** Converts the comment from its database form to its domain form. */
const convertComment = ({ content, ...comment }) =>
  R.pick(['id', 'dateCreated', 'dateDeleted', 'text', 'threadSlug', 'author'], {
    ...comment,
    text: content,
  });

const getCommentById = (id, { db }) => {
  const comment = db.prepare(SELECT_COMMENT_BY_ID_SQL).get({ id });
  return comment && convertComment(comment);
};

/** Validates that the specified `text` is correct, formatting the result. */
const validateText = (text) =>
  validateRequired('Text', text && text.trimEnd());

/** Creates the comments model. */
module.exports = ({ db }) => ({
  /** Finds comments by the specified parent `threadSlug`. */
  getCommentsByThreadSlug: (threadSlug) => {
    const comments = db.prepare(SELECT_COMMENTS_BY_THREAD_SLUG_SQL).all({
      threadSlug,
    });
    return comments.map(convertComment);
  },

  /** Finds a comment by the specified `id`. */
  getCommentById: (id) => {
    const comment = getCommentById(id, { db });
    if (!comment) {
      throw new createError.NotFound();
    }

    return comment;
  },

  /** Creates a comment. */
  createComment: (input, user) => {
    const id = validateRequired('Id', input.id);
    const content = validateText(input.text);
    const threadSlug = validateRequired('Thread slug', input.threadSlug);

    db.prepare(INSERT_COMMENT_SQL).run({
      id,
      content,
      threadSlug,
      username: user.username,
    });

    return getCommentById(id, { db });
  },

  /** Updates a comment to indicate an intent to delete it. */
  softDeleteComment: (id) => {
    db.prepare(SET_DATE_DELETED_SQL).run({
      id,
      dateDeleted: new Date().toISOString(),
    });
    return getCommentById(id, { db });
  },

  /** Returns `true` if the current user can delete the specified `comment`. */
  canDeleteComment: (comment, credentials) => {
    if (!credentials) {
      return false;
    }

    if (comment.dateDeleted) {
      return false;
    }

    return comment.author === credentials.username;
  },
});
