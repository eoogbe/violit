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
import { createAuthenticatedModel } from 'testUtils/testServerModel';
import {
  createAuthenticatedResponse,
  createResponse,
} from 'testUtils/testServerResponse';
import policies from '../comments';

describe('POST', () => {
  it('without credentials returns false', () => {
    const req = {
      params: {
        threadSlug: THREADS.thread1.slug,
      },
    };
    const res = createResponse({});

    const isAllowed = policies.post(req, res);

    expect(isAllowed).toBe(false);
  });
  it('when thread deleted returns false', () => {
    const req = {
      params: {
        threadSlug: THREADS.thread2.slug,
      },
    };
    const res = createAuthenticatedResponse({
      locals: {
        model: createAuthenticatedModel({
          threads: {
            getThreadBySlug: (slug) => ({
              ...THREADS.normalized.thread2,
              slug,
            }),
          },
        }),
      },
    });

    const isAllowed = policies.post(req, res);

    expect(isAllowed).toBe(false);
  });
  it('when can create comment returns true', () => {
    const req = {
      params: {
        threadSlug: THREADS.thread1.slug,
      },
    };
    const res = createAuthenticatedResponse({});

    const isAllowed = policies.post(req, res);

    expect(isAllowed).toBe(true);
  });
});
