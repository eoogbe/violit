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

import { CONTENT_TYPE } from '../constants';
import parseResponseBody from '../parseResponseBody';

const createResponse = (collection) => ({
  headers: {
    get: () => CONTENT_TYPE,
  },
  json: () => Promise.resolve({ collection }),
});

it('converts the Collection+JSON response into objects', () => {
  const response = createResponse({
    items: [
      { data: [{ name: 'foo', value: 'bar' }] },
      { data: [{ name: 'baz', value: '' }] },
      { data: [{ name: 'fizz', value: 'buzz' }] },
    ],
  });
  const body = parseResponseBody(response);
  return expect(body).resolves.toEqual({
    data: [
      {
        foo: 'bar',
        links: {},
      },
      {
        baz: null,
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

it('with links sets the links', () => {
  const response = createResponse({
    items: [
      {
        data: [{ name: 'bar', value: 'baz' }],
        links: [{ rel: 'qux', href: 'http://localhost:4000/api/qux' }],
      },
    ],
    links: [
      { rel: 'foo', href: 'http://localhost:4000/api/foo' },
    ],
  });
  const body = parseResponseBody(response);
  return expect(body).resolves.toEqual({
    data: [
      {
        bar: 'baz',
        links: {
          qux: 'http://localhost:4000/api/qux',
        },
      },
    ],
    links: {
      foo: 'http://localhost:4000/api/foo',
    },
  });
});

it('without items returns an empty object', () => {
  const response = createResponse({});
  const body = parseResponseBody(response);
  return expect(body).resolves.toEqual({
    data: [],
    links: {},
  });
});

it('with error returns an error object', () => {
  const response = createResponse({
    error: {
      message: 'Internal Server Error',
    },
  });
  const body = parseResponseBody(response);
  return expect(body).resolves.toEqual({
    error: {
      message: 'Internal Server Error',
    },
  });
});

it('without content returns null', () => {
  const response = {
    headers: {
      get: () => null,
    },
  };
  const body = parseResponseBody(response);
  return expect(body).resolves.toBeNull();
});
