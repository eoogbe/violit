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
import controller from '../comments';

describe('GET', () => {
  it('sends the comments', () => {
    const req = {
      params: {
        threadSlug: THREADS.thread1.slug,
      },
    };
    const res = createResponse({});

    const collection = controller.get(req, res);

    expect(collection).toEqual({
      version: '1.0',
      href: THREADS.thread1.commentsUrl,
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: 'http://localhost:4000/api/auth' },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
      items: COMMENTS.api,
    });
  });
  it('with credentials sets the template', () => {
    const req = {
      params: {
        threadSlug: THREADS.thread1.slug,
      },
    };
    const res = createAuthenticatedResponse({});

    const collection = controller.get(req, res);

    expect(collection).toEqual({
      version: '1.0',
      href: THREADS.thread1.commentsUrl,
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticated-as', href: 'http://localhost:4000/api/auth' },
        { rel: 'logout', href: 'http://localhost:4000/api/auth' },
      ],
      items: COMMENTS.api,
      template: {
        data: [
          { name: 'id', value: '' },
          { name: 'text', value: '' },
        ],
      },
    });
  });
  it('without comments sends empty items', () => {
    const req = {
      params: {
        threadSlug: THREADS.thread1.slug,
      },
    };
    const res = createResponse({
      locals: {
        model: createModel({
          comments: {
            getCommentsByThreadSlug: () => [],
          },
        }),
      },
    });

    const collection = controller.get(req, res);

    expect(collection).toEqual({
      version: '1.0',
      href: THREADS.thread1.commentsUrl,
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: 'http://localhost:4000/api/auth' },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
    });
  });
});

describe('POST', () => {
  it('creates a comment', () => {
    const req = {
      params: {
        threadSlug: THREADS.thread1.slug,
      },
      body: {
        template: {
          data: [
            { name: 'id', value: 'comment1' },
            { name: 'text', value: COMMENTS.comment1.text },
          ],
        },
      },
    };
    const res = createAuthenticatedResponse({});

    const collection = controller.post(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.set).toHaveBeenCalledWith(
      'Location',
      'http://localhost:4000/api/comments/comment1'
    );
    expect(res.set).toHaveBeenCalledWith(
      'Content-Location',
      'http://localhost:4000/api/comments/comment1'
    );
    expect(collection).toEqual({
      version: '1.0',
      href: 'http://localhost:4000/api/comments/comment1',
      links: [
        {
          rel: 'collection',
          href: THREADS.thread1.commentsUrl,
        },
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticated-as', href: 'http://localhost:4000/api/auth' },
        { rel: 'logout', href: 'http://localhost:4000/api/auth' },
      ],
      items: [COMMENTS.api[0]],
    });
  });
});
