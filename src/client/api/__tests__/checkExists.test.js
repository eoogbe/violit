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
import checkExists from '../checkExists';

const URL = 'http://localhost:4000/api/foo';

it('when response ok returns true', () => {
  mockFetch([
    {
      url: URL,
      method: 'HEAD',
      status: 200,
    },
  ]);
  const exists = checkExists(URL);
  return expect(exists).resolves.toBe(true);
});

it('when response status 404 returns false', () => {
  mockFetch([
    {
      url: URL,
      method: 'HEAD',
      status: 404,
    },
  ]);
  const exists = checkExists(URL);
  return expect(exists).resolves.toBe(false);
});

it('when response not successful rejects the promise', () => {
  mockFetch([
    {
      url: URL,
      method: 'HEAD',
      status: 500,
    },
  ]);
  const error = checkExists(URL);
  return expect(error).rejects.toEqual(new InvalidResponseError({
    status: 500,
  }));
});
