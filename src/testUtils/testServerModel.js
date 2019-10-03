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

import * as R from 'ramda';
import * as BOARD from '__fixtures__/boardFixture';
import * as COMMENTS from '__fixtures__/commentsFixture';
import * as THREADS from '__fixtures__/threadsFixture';
import * as USER from '__fixtures__/userFixture';

const CAN_DELETE_THREAD_RESULTS = {
  [THREADS.thread1.slug]: true,
  [THREADS.thread2.slug]: false,
  [THREADS.thread3.slug]: true,
};

const CAN_DELETE_COMMENT_RESULTS = {
  comment1: true,
  comment2: false,
  comment3: true,
};

/** Creates a test server model with default values. */
export const createModel = R.mergeDeepRight({
  auth: {
    sign: () => Promise.resolve('token123'),
    getCredentials: () => Promise.resolve(null),
    createCredentials: () => Promise.resolve('token123'),
  },
  board: {
    getBoard: () => BOARD.board,
  },
  threads: {
    getThreads: () => THREADS.unnormalized,
    getThreadById: (id) => ({
      id,
      slug: THREADS.thread1.slug,
      dateCreated: THREADS.thread1.dateCreated,
      headline: THREADS.thread1.headline,
      articleBody: THREADS.thread1.articleBody,
      author: THREADS.thread1.author,
    }),
    getThreadBySlug: (slug) => ({
      slug,
      id: 'thread1',
      dateCreated: THREADS.thread1.dateCreated,
      headline: THREADS.thread1.headline,
      articleBody: THREADS.thread1.articleBody,
      author: THREADS.thread1.author,
    }),
    createThread: () => THREADS.normalized.thread1,
    softDeleteThread: () => ({
      id: 'thread1',
      slug: THREADS.thread1.slug,
      dateCreated: THREADS.thread1.dateCreated,
      dateDeleted: THREADS.thread1.dateDeleted,
      headline: THREADS.thread1.headline,
      articleBody: THREADS.thread1.articleBody,
      author: THREADS.thread1.author,
    }),
    canDeleteThread: (thread) => CAN_DELETE_THREAD_RESULTS[thread.slug],
  },
  comments: {
    getCommentsByThreadSlug: () => COMMENTS.unnormalized,
    getCommentById: (id) => ({
      ...COMMENTS.normalized.comment1,
      id,
    }),
    createComment: () => COMMENTS.normalized.comment1,
    softDeleteComment: (id) => ({
      id,
      dateCreated: COMMENTS.comment1.dateCreated,
      dateDeleted: COMMENTS.comment1.dateDeleted,
      text: COMMENTS.comment1.text,
      threadSlug: COMMENTS.comment1.threadSlug,
      author: COMMENTS.comment1.author,
    }),
    canDeleteComment: (comment) => CAN_DELETE_COMMENT_RESULTS[comment.id],
  },
  users: {
    getUserById: () => USER.credentials,
    getUserByUsername: (username) => ({
      ...USER.credentials,
      username,
    }),
    createUser: () => Promise.resolve(USER.credentials),
  },
});

/** Creates a test server model for an authenticated user. */
export const createAuthenticatedModel =
  R.mergeDeepRight(createModel({
    auth: {
      getCredentials: () => Promise.resolve(USER.credentials),
    },
  }));
