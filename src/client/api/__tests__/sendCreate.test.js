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

import mockFetch from 'testUtils/mockFetch';
import InvalidResponseError from '../InvalidResponseError';
import sendCreate from '../sendCreate';

const URL = 'http://localhost:4000/api/foo';

const KEYS = ['bar'];

const OBJECT = { bar: 'baz' };

it('returns the location and body of an object created on the server', () => {
  mockFetch([
    {
      url: URL,
      method: 'POST',
      status: 201,
      headers: {
        Location: 'http://localhost:4000/api/foo/foo1',
      },
      body: {
        items: [
          { data: [{ name: 'foo', value: 'bar' }] },
        ],
      },
    },
  ]);
  const result = sendCreate(URL, KEYS, OBJECT);
  return expect(result).resolves.toEqual({
    body: {
      foo: 'bar',
      links: {},
    },
    location: 'http://localhost:4000/api/foo/foo1',
  });
});

it('when response does not have Created status rejects the promise', () => {
  mockFetch([
    {
      url: URL,
      method: 'POST',
      status: 204,
    },
  ]);
  const error = sendCreate(URL, KEYS, OBJECT);
  return expect(error).rejects.toEqual(new InvalidResponseError({
    status: 204,
    body: null,
  }));
});

it('without response body returns null body', () => {
  mockFetch([
    {
      url: URL,
      method: 'POST',
      status: 201,
      headers: {
        Location: 'http://localhost:4000/api/foo/foo1',
      },
    },
  ]);
  const result = sendCreate(URL, KEYS, OBJECT);
  return expect(result).resolves.toEqual({
    body: null,
    location: 'http://localhost:4000/api/foo/foo1',
  });
});
