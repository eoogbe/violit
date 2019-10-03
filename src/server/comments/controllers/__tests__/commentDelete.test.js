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

import * as COMMENTS from '__fixtures__/commentsFixture';
import * as THREADS from '__fixtures__/threadsFixture';
import { createModel } from 'testUtils/testServerModel';
import {
  createAuthenticatedResponse,
  createResponse,
} from 'testUtils/testServerResponse';
import controller from '../commentDelete';

describe('GET', () => {
  it('when comment not deleted sends the potential delete comment action', () => {
    const req = {
      params: {
        commentId: 'comment1',
      },
    };
    const res = createResponse({});

    const collection = controller.get(req, res);

    expect(collection).toEqual({
      version: '1.0',
      href: 'http://localhost:4000/api/comments/comment1/delete',
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: 'http://localhost:4000/api/auth' },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
      items: [
        {
          href: 'http://localhost:4000/api/comments/comment1/delete',
          data: [
            { name: 'actionStatus', value: 'potentialActionStatus' },
          ],
          links: [
            {
              rel: 'object',
              href: 'http://localhost:4000/api/comments/comment1',
            },
            { rel: 'targetCollection', href: THREADS.thread1.commentsUrl },
          ],
        },
      ],
    });
  });
  it('when comment deleted sends the completed delete comment action', () => {
    const req = {
      params: {
        commentId: 'comment2',
      },
    };
    const res = createResponse({
      locals: {
        model: createModel({
          comments: {
            getCommentById: (id) => ({
              ...COMMENTS.normalized.comment2,
              id,
            }),
          },
        }),
      },
    });

    const collection = controller.get(req, res);

    expect(collection).toEqual({
      version: '1.0',
      href: 'http://localhost:4000/api/comments/comment2/delete',
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: 'http://localhost:4000/api/auth' },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
      items: [
        {
          href: 'http://localhost:4000/api/comments/comment2/delete',
          data: [
            { name: 'actionStatus', value: 'completedActionStatus' },
            { name: 'endTime', value: COMMENTS.comment2.dateDeleted },
          ],
          links: [
            {
              rel: 'object',
              href: 'http://localhost:4000/api/comments/comment2',
            },
            { rel: 'targetCollection', href: THREADS.thread1.commentsUrl },
          ],
        },
      ],
    });
  });
});

describe('POST', () => {
  it('performs the comment delete action', () => {
    const req = {
      params: {
        commentId: 'comment1',
      },
    };
    const res = createAuthenticatedResponse({});

    const collection = controller.post(req, res);

    expect(collection).toEqual({
      version: '1.0',
      href: 'http://localhost:4000/api/comments/comment1/delete',
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticated-as', href: 'http://localhost:4000/api/auth' },
        { rel: 'logout', href: 'http://localhost:4000/api/auth' },
      ],
      items: COMMENTS.deleteCommentApi,
    });
  });
});
