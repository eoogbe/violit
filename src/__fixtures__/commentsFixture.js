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

import * as THREADS from './threadsFixture';
import * as USER from './userFixture';

export const comment1 = {
  id: 'comment1',
  dateCreated: '2019-10-09T10:11:12.123Z',
  dateDeleted: '2019-10-09T12:11:12.123Z',
  text: 'Sed do eiusmod tempor incididunt ut labore et dolore.',
  threadSlug: THREADS.thread1.slug,
  author: USER.username,
};

export const comment2 = {
  id: 'comment2',
  dateCreated: '2019-10-08T07:08:09.101Z',
  dateDeleted: '2019-10-08T07:09:09.101Z',
  text: 'Ut enim ad minim veniam.',
  threadSlug: THREADS.thread1.slug,
  author: USER.username,
};

export const comment3 = {
  id: 'comment3',
  dateCreated: '2019-09-30T01:02:03.456Z',
  dateDeleted: '2019-10-03T01:02:03.456Z',
  text: 'Quis nostrud exercitation ullamco laboris nisi ut.',
  threadSlug: THREADS.thread1.slug,
  author: USER.username,
};

export const createInput = {
  id: 'comment1',
  text: comment1.text,
  threadSlug: THREADS.thread1.slug,
};

export const normalized = {
  comment1: {
    id: 'comment1',
    dateCreated: comment1.dateCreated,
    dateDeleted: null,
    text: comment1.text,
    threadSlug: comment1.threadSlug,
    author: comment1.author,
  },
  comment2: {
    id: 'comment2',
    dateCreated: comment2.dateCreated,
    dateDeleted: comment2.dateDeleted,
    text: comment2.text,
    threadSlug: comment2.threadSlug,
    author: comment2.author,
  },
  comment3: {
    id: 'comment3',
    dateCreated: comment3.dateCreated,
    dateDeleted: null,
    text: comment3.text,
    threadSlug: comment3.threadSlug,
    author: comment3.author,
  },
};

export const unnormalized = [
  normalized.comment1,
  normalized.comment2,
  normalized.comment3,
];

export const api = [
  {
    href: 'http://localhost:4000/api/comments/comment1',
    data: [
      { name: 'id', value: 'comment1' },
      { name: 'dateCreated', value: comment1.dateCreated },
      { name: 'dateDeleted', value: '' },
      { name: 'text', value: comment1.text },
      { name: 'author', value: comment1.author },
      { name: 'threadSlug', value: THREADS.thread1.slug },
    ],
    links: [
      {
        rel: 'deleteAction',
        href: 'http://localhost:4000/api/comments/comment1/delete',
      },
      { rel: 'about', href: THREADS.thread1.url },
    ],
  },
  {
    href: 'http://localhost:4000/api/comments/comment2',
    data: [
      { name: 'id', value: 'comment2' },
      { name: 'dateCreated', value: comment2.dateCreated },
      { name: 'dateDeleted', value: comment2.dateDeleted },
      { name: 'text', value: comment2.text },
      { name: 'author', value: comment2.author },
      { name: 'threadSlug', value: THREADS.thread1.slug },
    ],
    links: [
      { rel: 'about', href: THREADS.thread1.url },
    ],
  },
  {
    href: 'http://localhost:4000/api/comments/comment3',
    data: [
      { name: 'id', value: 'comment3' },
      { name: 'dateCreated', value: comment3.dateCreated },
      { name: 'dateDeleted', value: '' },
      { name: 'text', value: comment3.text },
      { name: 'author', value: comment3.author },
      { name: 'threadSlug', value: THREADS.thread1.slug },
    ],
    links: [
      {
        rel: 'deleteAction',
        href: 'http://localhost:4000/api/comments/comment3/delete',
      },
      { rel: 'about', href: THREADS.thread1.url },
    ],
  },
];

export const deleteCommentApi = [
  {
    href: 'http://localhost:4000/api/comments/comment1/delete',
    data: [
      { name: 'actionStatus', value: 'completedActionStatus' },
      { name: 'endTime', value: comment1.dateDeleted },
    ],
    links: [
      {
        rel: 'object',
        href: 'http://localhost:4000/api/comments/comment1',
      },
      { rel: 'targetCollection', href: THREADS.thread1.commentsUrl },
    ],
  },
];

export const commentsFetch = {
  url: THREADS.thread1.commentsUrl,
  method: 'GET',
  status: 200,
  body: {
    items: api,
  },
};

export const createCommentFetch = {
  url: THREADS.thread1.commentsUrl,
  method: 'POST',
  status: 201,
  body: {
    items: [api[0]],
  },
};

export const canCreateCommentFetch = {
  url: THREADS.thread1.commentsUrl,
  method: 'OPTIONS',
  status: 204,
  headers: {
    Allow: 'GET,HEAD,OPTIONS,POST',
  },
};

export const cannotCreateCommentFetch = {
  url: THREADS.thread1.commentsUrl,
  method: 'OPTIONS',
  status: 204,
  headers: {
    Allow: 'GET,HEAD,OPTIONS',
  },
};

export const deleteCommentFetch = {
  url: 'http://localhost:4000/api/comments/comment1/delete',
  method: 'POST',
  status: 200,
  body: {
    items: deleteCommentApi,
  },
};

export const db = [
  {
    id: 'comment1',
    dateCreated: comment1.dateCreated,
    dateDeleted: null,
    content: comment1.text,
    userId: 'user1',
    threadId: 'thread1',
  },
  {
    id: 'comment2',
    dateCreated: comment2.dateCreated,
    dateDeleted: comment2.dateDeleted,
    content: comment2.text,
    userId: 'user1',
    threadId: 'thread1',
  },
  {
    id: 'comment3',
    dateCreated: comment3.dateCreated,
    dateDeleted: null,
    content: comment3.text,
    userId: 'user1',
    threadId: 'thread1',
  },
];
