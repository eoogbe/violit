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

import getSingleBodyObject from '../getSingleBodyObject';

it('converts a singleton response body list to a single object', () => {
  const obj = getSingleBodyObject({
    data: [
      {
        foo: 'bar',
        links: {
          'baz': 'http://localhost:4000/api/baz',
        },
      },
    ],
    links: {
      'qux': 'http://localhost:4000/api/qux',
    },
  });
  expect(obj).toEqual({
    foo: 'bar',
    links: {
      'baz': 'http://localhost:4000/api/baz',
      'qux': 'http://localhost:4000/api/qux',
    },
  });
});

it('when data empty returns links', () => {
  const obj = getSingleBodyObject({
    data: [],
    links: {
      'foo': 'http://localhost:4000/api/foo',
    },
  });
  expect(obj).toEqual({
    links: {
      'foo': 'http://localhost:4000/api/foo',
    },
  });
});
