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

import * as THREADS from '__fixtures__/threadsFixture';
import { createModel } from 'testUtils/testServerModel';
import {
  createAuthenticatedResponse,
  createResponse,
} from 'testUtils/testServerResponse';
import controller from '../threadDelete';

describe('GET', () => {
  it('when thread not deleted sends the potential delete thread action', () => {
    const req = {
      params: {
        threadSlug: THREADS.thread1.slug,
      },
    };
    const res = createResponse({});

    const collection = controller.get(req, res);

    expect(collection).toEqual({
      version: '1.0',
      href: THREADS.thread1.deleteUrl,
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: 'http://localhost:4000/api/auth' },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
      items: [
        {
          href: THREADS.thread1.deleteUrl,
          data: [
            { name: 'actionStatus', value: 'potentialActionStatus' },
          ],
          links: [
            { rel: 'object', href: THREADS.thread1.url },
            {
              rel: 'targetCollection',
              href: 'http://localhost:4000/api/board',
            },
          ],
        },
      ],
    });
  });
  it('when thread deleted sends the completed delete thread action', () => {
    const req = {
      params: {
        threadSlug: THREADS.thread2.slug,
      },
    };
    const res = createResponse({
      locals: {
        model: createModel({
          threads: {
            getThreadBySlug: (slug) => ({
              ...THREADS.normalized.thread2,
              slug,
            }),
          },
        }),
      },
    });

    const collection = controller.get(req, res);

    expect(collection).toEqual({
      version: '1.0',
      href: THREADS.thread2.deleteUrl,
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: 'http://localhost:4000/api/auth' },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
      items: [
        {
          href: THREADS.thread2.deleteUrl,
          data: [
            { name: 'actionStatus', value: 'completedActionStatus' },
            { name: 'endTime', value: THREADS.thread2.dateDeleted },
          ],
          links: [
            { rel: 'object', href: THREADS.thread2.url },
            {
              rel: 'targetCollection',
              href: 'http://localhost:4000/api/board',
            },
          ],
        },
      ],
    });
  });
});

describe('POST', () => {
  it('performs the thread delete action', () => {
    const req = {
      params: {
        threadSlug: THREADS.thread1.slug,
      },
    };
    const res = createAuthenticatedResponse({});

    const collection = controller.post(req, res);

    expect(collection).toEqual({
      version: '1.0',
      href: THREADS.thread1.deleteUrl,
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticated-as', href: 'http://localhost:4000/api/auth' },
        { rel: 'logout', href: 'http://localhost:4000/api/auth' },
      ],
      items: THREADS.deleteThreadApi,
    });
  });
});
