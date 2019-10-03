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
import * as USER from '__fixtures__/userFixture';
import routes from 'server/api/routes';
import {
  createAuthenticatedModel,
  createModel,
} from 'testUtils/testServerModel';
import addThreadItems from '../addThreadItems';

it('adds threads to the items of a collection', () => {
  const collection = addThreadItems({
    credentials: USER.credentials,
    model: createAuthenticatedModel({}),
    routes,
  })(THREADS.unnormalized)({});
  expect(collection).toEqual({
    items: THREADS.api,
  });
});

it('when cannot delete thread does not set the thread delete action link', () => {
  const collection = addThreadItems( {
    model: createModel({}),
    routes,
  })([THREADS.normalized.thread2])({});
  expect(collection).toEqual({
    items: [
      {
        href: THREADS.thread2.url,
        data: [
          { name: 'id', value: 'thread2' },
          { name: 'slug', value: THREADS.thread2.slug },
          { name: 'dateCreated', value: THREADS.thread2.dateCreated },
          { name: 'dateDeleted', value: THREADS.thread2.dateDeleted },
          { name: 'headline', value: THREADS.thread2.headline },
          { name: 'articleBody', value: '' },
          { name: 'author', value: THREADS.thread2.author },
        ],
        links: [
          { rel: 'isPartOf', href: 'http://localhost:4000/api/board' },
          {
            rel: 'comment',
            href: THREADS.thread2.commentsUrl,
          },
        ],
      },
    ],
  });
});
