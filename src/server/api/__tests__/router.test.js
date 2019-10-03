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

import request from 'supertest';
import createServer from 'testUtils/createServer';
import initDb from 'testUtils/initializeDatabase';
import { createModel } from 'testUtils/testServerModel';
import router from '../router';

const SUCCESS_RESPONSE_SHAPE = {
  collection: {
    version: '1.0',
    href: expect.stringMatching(/^http:\/\/localhost:4000\/api/),
    links: expect.arrayContaining([
      { rel: 'home', href: 'http://localhost:4000/api' },
    ]),
  },
};

let db;

beforeEach(() => {
  db = initDb();
});

afterEach(() => {
  db.close();
});

it('responds with the Collection+JSON content type', () => {
  const server = createServer(router, { model: createModel({}) });
  const response = request(server).get('/');
  return expect(response).resolves.toHaveProperty(
    'type',
    'application/vnd.collection+json'
  );
});

it('when request method unknown serves Not Implmented', () => {
  const server = createServer(router, { model: createModel({}) });
  const response = request(server).put('/');
  return expect(response).resolves.toHaveProperty('body', {
    collection: {
      version: '1.0',
      href: 'http://localhost:4000/api',
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: 'http://localhost:4000/api/auth' },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
      error: {
        title: 'Not Implemented',
        message: 'Request method not recognized',
        code: 501,
      },
    },
  });
});

it('only supports Collection+JSON requests', () => {
  const server = createServer(router, { model: createModel({}) });
  const response = request(server)
    .post('/threads/lorem-ipsum/comments')
    .send('Text request');
  return expect(response).resolves.toHaveProperty('body', {
    collection: {
      version: '1.0',
      href: 'http://localhost:4000/api/threads/lorem-ipsum/comments',
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: 'http://localhost:4000/api/auth' },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
      error: {
        title: 'Unsupported Media Type',
        message: 'Unsupported Media Type',
        code: 415,
      },
    },
  });
});

it('with invalid Accept header serves Not Acceptable', () => {
  const server = createServer(router, { model: createModel({}) });
  const response = request(server).get('/').accept('text/html');
  return expect(response).resolves.toHaveProperty('body', {
    collection: {
      version: '1.0',
      href: 'http://localhost:4000/api',
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: 'http://localhost:4000/api/auth' },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
      error: {
        title: 'Not Acceptable',
        message: 'Not Acceptable',
        code: 406,
      },
    },
  });
});

it('when OPTIONS request sets the CORS headers', async () => {
  const server = createServer(router, { model: createModel({}) });

  const response = await request(server).options('/');

  expect(response).toHaveProperty('headers.allow', 'GET,HEAD,OPTIONS');
  expect(response).toHaveProperty(
    'headers.access-control-allow-methods',
    'HEAD,GET,POST,DELETE,OPTIONS'
  );
  expect(response).toHaveProperty(
    'headers.access-control-expose-headers',
    'Allow,Location'
  );
  expect(response).toHaveProperty('headers.access-control-allow-credentials');
  expect(response).not.toHaveProperty('headers.content-type');
});

it('when request method not allowed for the resource serves Method Not Allowed', async () => {
  const server = createServer(router, { model: createModel({}) });

  const response = await request(server).post('/');

  expect(response).toHaveProperty('headers.allow', 'GET,HEAD,OPTIONS');
  expect(response).toHaveProperty('body', {
    collection: {
      version: '1.0',
      href: 'http://localhost:4000/api',
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: 'http://localhost:4000/api/auth' },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
      error: {
        title: 'Method Not Allowed',
        message: 'Method Not Allowed',
        code: 405,
      },
    },
  });
});

it('uses the database', async () => {
  const server = createServer(router, { db });
  const response = await request(server).get('/thread');
  expect(response.body).toMatchObject(SUCCESS_RESPONSE_SHAPE);
});

it('without a matching resource serves Not Found', () => {
  const server = createServer(router, { model: createModel({}) });
  const response = request(server).get('/404');
  return expect(response).resolves.toHaveProperty('body', {
    collection: {
      version: '1.0',
      href: 'http://localhost:4000/api/404',
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: 'http://localhost:4000/api/auth' },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
      error: {
        title: 'Not Found',
        message: 'Not Found',
        code: 404,
      },
    },
  });
});
