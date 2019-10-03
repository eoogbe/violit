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

import * as USER from './userFixture';

export const thread1 = {
  id: 'thread1',
  slug: 'lorem-ipsum',
  dateCreated: '2019-09-29T01:23:45.679Z',
  dateDeleted: '2019-09-29T02:00:45.679Z',
  headline: 'Lorem ipsum',
  articleBody: 'Dolor sit amet, consectetur adipiscing elit.',
  author: USER.username,
  title: 'Lorem ipsum | Violit',
  path: '/threads/lorem-ipsum',
  url: 'http://localhost:4000/api/threads/lorem-ipsum',
  deleteUrl: 'http://localhost:4000/api/threads/lorem-ipsum/delete',
  commentsUrl: 'http://localhost:4000/api/threads/lorem-ipsum/comments',
};

export const thread2 = {
  id: 'thread2',
  slug: 'aliquip-ex-ea',
  dateCreated: '2019-09-28T09:08:07.654Z',
  dateDeleted: '2019-09-28T09:08:08.654Z',
  headline: 'Aliquip ex ea',
  articleBody: null,
  author: USER.username,
  title: 'Aliquip ex ea | Violit',
  path: '/threads/aliquip-ex-ea',
  url: 'http://localhost:4000/api/threads/aliquip-ex-ea',
  deleteUrl: 'http://localhost:4000/api/threads/aliquip-ex-ea/delete',
  commentsUrl: 'http://localhost:4000/api/threads/aliquip-ex-ea/comments',
};

export const thread3 = {
  id: 'thread3',
  slug: 'commodo-consequat',
  dateCreated: '2019-09-27T03:21:09.876Z',
  dateDeleted: '2019-09-27T04:21:09.876Z',
  headline: 'Commodo consequat',
  articleBody: null,
  author: USER.username,
  title: 'Commodo consequat | Violit',
  path: '/threads/commodo-consequat',
  url: 'http://localhost:4000/api/threads/commodo-consequat',
  deleteUrl: 'http://localhost:4000/api/threads/commodo-consequat/delete',
  commentsUrl: 'http://localhost:4000/api/threads/commodo-consequat/comments',
};

export const createInput = {
  headline: thread1.headline,
  articleBody: thread1.articleBody,
};

export const normalized = {
  thread1: {
    id: 'thread1',
    slug: thread1.slug,
    dateCreated: thread1.dateCreated,
    dateDeleted: null,
    headline: thread1.headline,
    articleBody: thread1.articleBody,
    author: thread1.author,
  },
  thread2: {
    id: 'thread2',
    slug: thread2.slug,
    dateCreated: thread2.dateCreated,
    dateDeleted: thread2.dateDeleted,
    headline: thread2.headline,
    articleBody: thread2.articleBody,
    author: thread2.author,
  },
  thread3: {
    id: 'thread3',
    slug: thread3.slug,
    dateCreated: thread3.dateCreated,
    dateDeleted: null,
    headline: thread3.headline,
    articleBody: thread3.articleBody,
    author: thread3.author,
  },
};

export const unnormalized = [
  {
    id: 'thread1',
    slug: thread1.slug,
    dateCreated: thread1.dateCreated,
    headline: thread1.headline,
    articleBody: thread1.articleBody,
    author: thread1.author,
  },
  {
    id: 'thread3',
    slug: thread3.slug,
    dateCreated: thread3.dateCreated,
    headline: thread3.headline,
    articleBody: thread3.articleBody,
    author: thread3.author,
  },
];

export const api = [
  {
    href: thread1.url,
    data: [
      { name: 'id', value: 'thread1' },
      { name: 'slug', value: thread1.slug },
      { name: 'dateCreated', value: thread1.dateCreated },
      { name: 'dateDeleted', value: '' },
      { name: 'headline', value: thread1.headline },
      { name: 'articleBody', value: thread1.articleBody },
      { name: 'author', value: thread1.author },
    ],
    links: [
      { rel: 'deleteAction', href: thread1.deleteUrl },
      { rel: 'isPartOf', href: 'http://localhost:4000/api/board' },
      {
        rel: 'comment',
        href: thread1.commentsUrl,
      },
    ],
  },
  {
    href: thread3.url,
    data: [
      { name: 'id', value: 'thread3' },
      { name: 'slug', value: thread3.slug },
      { name: 'dateCreated', value: thread3.dateCreated },
      { name: 'dateDeleted', value: '' },
      { name: 'headline', value: thread3.headline },
      { name: 'articleBody', value: '' },
      { name: 'author', value: thread3.author },
    ],
    links: [
      { rel: 'deleteAction', href: thread3.deleteUrl },
      { rel: 'isPartOf', href: 'http://localhost:4000/api/board' },
      {
        rel: 'comment',
        href: thread3.commentsUrl,
      },
    ],
  },
];

export const deleteThreadApi = [
  {
    href: thread1.deleteUrl,
    data: [
      { name: 'actionStatus', value: 'completedActionStatus' },
      { name: 'endTime', value: thread1.dateDeleted },
    ],
    links: [
      { rel: 'object', href: thread1.url },
      { rel: 'targetCollection', href: 'http://localhost:4000/api/board' },
    ],
  },
];

export const threadsFetch = {
  url: 'http://localhost:4000/api/threads',
  method: 'GET',
  status: 200,
  body: {
    items: api,
  },
};

export const threadFetch1 = {
  url: thread1.url,
  method: 'GET',
  status: 200,
  body: {
    items: [api[0]],
  },
};

export const threadWithoutArticleBodyFetch = {
  url: thread1.url,
  method: 'GET',
  status: 200,
  body: {
    items: [
      {
        href: thread1.url,
        data: [
          { name: 'id', value: 'thread1' },
          { name: 'slug', value: thread1.slug },
          { name: 'dateCreated', value: thread1.dateCreated },
          { name: 'dateDeleted', value: '' },
          { name: 'headline', value: thread1.headline },
          { name: 'articleBody', value: '' },
          { name: 'author', value: thread1.author },
        ],
        links: [
          { rel: 'deleteAction', href: thread1.deleteUrl },
          { rel: 'isPartOf', href: 'http://localhost:4000/api/board' },
          {
            rel: 'comment',
            href: thread1.commentsUrl,
          },
        ],
      },
    ],
  },
};

export const threadWhereCannotCreateCommentFetch = {
  url: thread1.url,
  method: 'GET',
  status: 200,
  body: {
    items: [
      {
        href: thread1.url,
        data: [
          { name: 'id', value: 'thread1' },
          { name: 'slug', value: thread1.slug },
          { name: 'dateCreated', value: thread1.dateCreated },
          { name: 'dateDeleted', value: '' },
          { name: 'headline', value: thread1.headline },
          { name: 'articleBody', value: thread1.articleBody },
          { name: 'author', value: thread1.author },
        ],
        links: [
          { rel: 'isPartOf', href: 'http://localhost:4000/api/board' },
          {
            rel: 'comment',
            href: thread1.commentsUrl,
          },
        ],
      },
    ],
  },
};

export const deletedThreadFetch = {
  url: thread1.url,
  method: 'GET',
  status: 200,
  body: {
    items: [
      {
        href: thread1.url,
        data: [
          { name: 'id', value: 'thread1' },
          { name: 'slug', value: thread1.slug },
          { name: 'dateCreated', value: thread1.dateCreated },
          { name: 'dateDeleted', value: thread1.dateDeleted },
          { name: 'headline', value: thread1.headline },
          { name: 'articleBody', value: '' },
          { name: 'author', value: thread1.author },
        ],
        links: [
          { rel: 'isPartOf', href: 'http://localhost:4000/api/board' },
          {
            rel: 'comment',
            href: thread1.commentsUrl,
          },
        ],
      },
    ],
  },
};

export const createThreadFetch = {
  url: 'http://localhost:4000/api/threads',
  method: 'POST',
  status: 201,
  body: {
    items: [api[0]],
  },
};

export const canCreateThreadFetch = {
  url: 'http://localhost:4000/api/threads',
  method: 'OPTIONS',
  status: 204,
  headers: {
    Allow: 'GET,HEAD,OPTIONS,POST',
  },
};

export const cannotCreateThreadFetch = {
  url: 'http://localhost:4000/api/threads',
  method: 'OPTIONS',
  status: 204,
  headers: {
    Allow: 'GET,HEAD,OPTIONS',
  },
};

export const deleteThreadFetch = {
  url: thread1.deleteUrl,
  method: 'POST',
  status: 200,
  body: {
    items: deleteThreadApi,
  },
};

export const db = [
  {
    id: 'thread1',
    slug: thread1.slug,
    dateCreated: thread1.dateCreated,
    dateDeleted: null,
    headline: thread1.headline,
    articleBody: thread1.articleBody,
    userId: 'user1',
    boardId: 'board1',
  },
  {
    id: 'thread2',
    slug: thread2.slug,
    dateCreated: thread2.dateCreated,
    dateDeleted: thread2.dateDeleted,
    headline: thread2.headline,
    articleBody: thread2.articleBody,
    userId: 'user1',
    boardId: 'board1',
  },
  {
    id: 'thread3',
    slug: thread3.slug,
    dateCreated: thread3.dateCreated,
    dateDeleted: null,
    headline: thread3.headline,
    articleBody: thread3.articleBody,
    userId: 'user1',
    boardId: 'board1',
  },
];
