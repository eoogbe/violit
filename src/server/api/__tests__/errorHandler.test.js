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

import { createResponse } from 'testUtils/testServerResponse';
import errorHandler from '../errorHandler';

it('sends the error collection', () => {
  const req = { path: '/foo' };
  const res = createResponse({});
  errorHandler({ status: 500, message: 'Oh no!', expose: true }, req, res);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith({
    collection: {
      version: '1.0',
      href: 'http://localhost:4000/api/foo',
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: 'http://localhost:4000/api/auth' },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
      error: {
        title: 'Internal Server Error',
        message: 'Oh no!',
        code: 500,
      },
    },
  });
});

it('uses the status from the error object', () => {
  const req = {};
  const res = createResponse({});
  errorHandler({ status: 400 }, req, res);
  expect(res.status).toHaveBeenCalledWith(400);
  expect(res.send).toHaveBeenCalledWith({
    collection: {
      version: '1.0',
      href: 'http://localhost:4000/api',
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: 'http://localhost:4000/api/auth' },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
      error: {
        title: 'Bad Request',
        code: 400,
        message: null,
      },
    },
  });
});

it('when status code unknown uses a default title', () => {
  const req = {};
  const res = createResponse({});
  errorHandler({ status: 104 }, req, res);
  expect(res.status).toHaveBeenCalledWith(104);
  expect(res.send).toHaveBeenCalledWith({
    collection: {
      version: '1.0',
      href: 'http://localhost:4000/api',
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: 'http://localhost:4000/api/auth' },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
      error: {
        title: 'Unknown Error',
        code: 104,
        message: null,
      },
    },
  });
});

it('when unknown status code less than 100 uses 500 status code', () => {
  const req = {};
  const res = createResponse({});
  errorHandler({ status: 1 }, req, res);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith({
    collection: {
      version: '1.0',
      href: 'http://localhost:4000/api',
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: 'http://localhost:4000/api/auth' },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
      error: {
        title: 'Unknown Error',
        code: 1,
        message: null,
      },
    },
  });
});

it('when unknown status code greater than 599 uses 500 status code', () => {
  const req = {};
  const res = createResponse({});
  errorHandler({ status: 600 }, req, res);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith({
    collection: {
      version: '1.0',
      href: 'http://localhost:4000/api',
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: 'http://localhost:4000/api/auth' },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
      error: {
        title: 'Unknown Error',
        code: 600,
        message: null,
      },
    },
  });
});

it('when unexposed hides error message', () => {
  const req = {};
  const res = createResponse({});
  errorHandler({ message: 'Oh no!' }, req, res);
  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith({
    collection: {
      version: '1.0',
      href: 'http://localhost:4000/api',
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: 'http://localhost:4000/api/auth' },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
      error: {
        title: 'Unknown Error',
        message: null,
      },
    },
  });
});
