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
import { load, loadAll } from '../load';

const URL = 'http://localhost:4000/api/foo';

describe('loadAll', () => {
  it('returns objects loaded from the server', () => {
    mockFetch([
      {
        url: URL,
        method: 'GET',
        status: 200,
        body: {
          items: [
            { data: [{ name: 'foo', value: 'bar' }] },
            { data: [{ name: 'baz', value: 'qux' }] },
            { data: [{ name: 'fizz', value: 'buzz' }] },
          ],
        },
      },
    ]);
    const result = loadAll(URL);
    return expect(result).resolves.toEqual({
      data: [
        {
          foo: 'bar',
          links: {},
        },
        {
          baz: 'qux',
          links: {},
        },
        {
          fizz: 'buzz',
          links: {},
        },
      ],
      links: {},
    });
  });
  it('when response does not have OK status rejects the promise', () => {
    mockFetch([
      {
        url: URL,
        method: 'GET',
        status: 404,
        body: {
          error: {
            message: 'Not Found',
          },
        },
      },
    ]);
    const error = loadAll(URL);
    expect(error).rejects.toEqual(new InvalidResponseError({
      status: 404,
      body: {
        error: {
          message: 'Not Found',
        },
      },
    }));
  });
  it('when response does not have a body rejects the promise', () => {
    mockFetch([
      {
        url: URL,
        method: 'GET',
        status: 200,
      },
    ]);
    const error = loadAll(URL);
    expect(error).rejects.toEqual(new Error('Response body empty'));
  });
});

describe('load', () => {
  it('returns an object loaded from the server', () => {
    mockFetch([
      {
        url: URL,
        method: 'GET',
        status: 200,
        body: {
          items: [
            { data: [{ name: 'foo', value: 'bar' }] },
          ],
        },
      },
    ]);
    const result = load(URL);
    return expect(result).resolves.toEqual({
      foo: 'bar',
      links: {},
    });
  });
});
