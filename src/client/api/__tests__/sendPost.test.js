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

import InvalidResponseError from '../InvalidResponseError';
import { CONTENT_TYPE } from '../constants';
import sendPost from '../sendPost';

const URL = 'http://localhost:4000/api/foo';

const KEYS = ['bar'];

const OBJECT = { bar: 'baz' };

it('returns the response of a POST request', () => {
  const headers = { get: () => CONTENT_TYPE };
  const response = {
    ok: true,
    status: 200,
    headers,
    json: () => Promise.resolve({
      collection: {
        items: [
          { data: [{ name: 'foo', value: 'bar' }] },
        ],
      },
    }),
  };
  global.fetch = jest.fn().mockResolvedValue(response);

  const result = sendPost(URL, KEYS, OBJECT);

  return expect(result).resolves.toEqual({
    status: 200,
    headers,
    body: {
      data: [
        {
          foo: 'bar',
          links: {},
        },
      ],
      links: {},
    },
  });
});

it('without request body does not send request body', async () => {
  const headers = { get: () => CONTENT_TYPE };
  const response = {
    ok: true,
    status: 200,
    headers,
    json: () => Promise.resolve({
      collection: {
        items: [
          { data: [{ name: 'foo', value: 'bar' }] },
        ],
      },
    }),
  };
  global.fetch = jest.fn().mockResolvedValue(response);

  const result = sendPost(URL);

  return expect(result).resolves.toEqual({
    status: 200,
    headers,
    body: {
      data: [
        {
          foo: 'bar',
          links: {},
        },
      ],
      links: {},
    },
  });
});

it('when response not successful rejects the promise', () => {
  const response = {
    ok: false,
    status: 500,
    headers: {
      get: () => CONTENT_TYPE,
    },
    json: () => Promise.resolve({
      collection: {
        error: {
          message: 'Internal Server Error',
        },
      },
    }),
  };
  global.fetch = jest.fn().mockResolvedValue(response);

  const error = sendPost(URL, KEYS, OBJECT);

  return expect(error).rejects.toEqual(new InvalidResponseError({
    status: 500,
    body: {
      error: {
        message: 'Internal Server Error',
      },
    },
  }));
});
