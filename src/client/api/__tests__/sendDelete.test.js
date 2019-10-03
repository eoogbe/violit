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
import sendDelete from '../sendDelete';

const URL = 'http://localhost:4000/api/foo';

it('send a DELETE request to the server', () => {
  mockFetch([
    {
      url: URL,
      method: 'DELETE',
      status: 200,
    },
  ]);
  const body = sendDelete(URL);
  return expect(body).resolves.toBeNull();
});

it('when response not successful rejects the promise', () => {
  mockFetch([
    {
      url: URL,
      method: 'DELETE',
      status: 500,
      body: {
        error: {
          message: 'Internal Server Error',
        },
      },
    },
  ]);
  const error = sendDelete(URL);
  return expect(error).rejects.toEqual(new InvalidResponseError({
    status: 500,
    body: {
      error: {
        message: 'Internal Server Error',
      },
    },
  }));
});
