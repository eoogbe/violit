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

const { NotFound } = require('http-errors');
const slugify = require('slugify');
const uuid = require('uuid/v4');
const { validateRequired } = require('../utils');

const SELECT_THREADS_SQL =
`SELECT
  thread.id,
  thread.slug,
  thread.dateCreated,
  thread.headline,
  thread.articleBody,
  user.username AS author
FROM thread
  JOIN user
    ON thread.userId = user.id
WHERE thread.dateDeleted ISNULL
ORDER BY thread.dateCreated DESC`;

const SELECT_THREAD_BY_ID_SQL =
`SELECT
  thread.id,
  thread.slug,
  thread.dateCreated,
  thread.dateDeleted,
  thread.headline,
  thread.articleBody,
  user.username AS author
FROM thread
  JOIN user
    ON thread.userId = user.id
WHERE thread.id = :id`;

const SELECT_THREAD_BY_SLUG_SQL =
`SELECT
  thread.id,
  thread.slug,
  thread.dateCreated,
  thread.dateDeleted,
  thread.headline,
  thread.articleBody,
  user.username AS author
FROM thread
  JOIN user
    ON thread.userId = user.id
WHERE thread.slug = :slug`;

const INSERT_THREAD_SQL =
`INSERT INTO thread (id, slug, headline, articleBody, userId, boardId)
SELECT :id, :slug, :headline, :articleBody, user.id, board.id
FROM user
  CROSS JOIN board
WHERE user.username = :username`;

const SET_DATE_DELETED_SQL =
`UPDATE thread
SET dateDeleted = :dateDeleted
WHERE slug = :slug`;

const getThreadById = (id, { db }) =>
  db.prepare(SELECT_THREAD_BY_ID_SQL).get({ id });

const getThreadBySlug = (slug, { db }) =>
  db.prepare(SELECT_THREAD_BY_SLUG_SQL).get({ slug });

/**
 * Validates that the specified `headline` is correct, formatting the result.
 */
const validateHeadline = (headline) =>
  validateRequired('Headline', headline && headline.trimEnd());

/**
 * Validates that the specified `articleBody` is correct, formatting the result.
 */
const validateArticleBody = (articleBody) => {
  if (!articleBody) {
    return null;
  }

  return articleBody.trimEnd() || null;
};

/** Creates a unique slug for the thread. */
const createSlug = (headline, { id, db }) => {
  const slug = slugify(headline.slice(0, 256));
  if (!getThreadBySlug(slug, { db })) {
    return slug;
  }

  const slug2 = `${slug.slice(0, -9) || slug}-${id.slice(0, 8)}`;
  if (!getThreadBySlug(slug2, { db })) {
    return slug2;
  }

  return `${slug.slice(0, -17) || slug}-${id}`;
};

/** Creates the threads model. */
module.exports = ({ db }) => ({
  /** Finds all the threads. */
  getThreads: () => db.prepare(SELECT_THREADS_SQL).all(),

  /** Finds a thread by the specified `id`. */
  getThreadById: (id) => {
    const thread = getThreadById(id, { db });
    if (!thread) {
      throw new NotFound();
    }

    return thread;
  },

  /** Finds a thread by the specified `slug`. */
  getThreadBySlug: (slug) => {
    const thread = getThreadBySlug(slug, { db });
    if (!thread) {
      throw new NotFound();
    }

    return thread;
  },

  /** Creates a thread. */
  createThread: (input, user) => {
    const headline = validateHeadline(input.headline);
    const articleBody = validateArticleBody(input.articleBody);
    const id = uuid();
    const slug = createSlug(headline, { id, db });

    db.prepare(INSERT_THREAD_SQL).run({
      id,
      slug,
      headline,
      articleBody,
      username: user.username,
    });

    return getThreadById(id, { db });
  },

  /** Updates a thread to indicate an intent to delete it. */
  softDeleteThread: (slug) => {
    db.prepare(SET_DATE_DELETED_SQL).run({
      slug,
      dateDeleted: new Date().toISOString(),
    });
    return getThreadBySlug(slug, { db });
  },

  /** Returns `true` if the current user can delete the specified `thread`. */
  canDeleteThread: (thread, credentials) => {
    if (!credentials) {
      return false;
    }

    if (thread.dateDeleted) {
      return false;
    }

    return thread.author === credentials.username;
  },
});
