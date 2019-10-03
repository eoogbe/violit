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
import * as COMMENTS from '__fixtures__/commentsFixture';
import * as THREADS from '__fixtures__/threadsFixture';
import * as USER from '__fixtures__/userFixture';
import createServer from 'testUtils/createServer';
import {
  createAuthenticatedModel,
  createModel,
} from 'testUtils/testServerModel';
import router from '../router';

it('GET /', () => {
  const server = createServer(router, { model: createModel({}) });
  const response = request(server).get('/');
  return expect(response).resolves.toHaveProperty('ok', true);
});

it('GET /auth', () => {
  const server = createServer(router, {
    model: createAuthenticatedModel({}),
  });
  const response = request(server).get('/auth');
  return expect(response).resolves.toHaveProperty('ok', true);
});

it('POST /auth', () => {
  const server = createServer(router, { model: createModel({}) });
  const response = request(server)
    .post('/auth')
    .type('application/vnd.collection+json')
    .send({
      template: {
        data: [
          { name: 'username', value: USER.username },
          { name: 'password', value: USER.password },
        ],
      },
    });
  return expect(response).resolves.toHaveProperty('ok', true);
});

it('DELETE /auth', () => {
  const server = createServer(router, { model: createModel({}) });
  const response = request(server).delete('/auth');
  return expect(response).resolves.toHaveProperty('ok', true);
});

it('GET /board', () => {
  const server = createServer(router, { model: createModel({}) });
  const response = request(server).get('/board');
  return expect(response).resolves.toHaveProperty('ok', true);
});

it('GET /threads/lorem-ipsum/comments', () => {
  const server = createServer(router, { model: createModel({}) });
  const response = request(server).get('/threads/lorem-ipsum/comments');
  return expect(response).resolves.toHaveProperty('ok', true);
});

it('POST /threads/lorem-ipsum/comments', () => {
  const server = createServer(router, {
    model: createAuthenticatedModel({}),
  });
  const response = request(server)
    .post('/threads/lorem-ipsum/comments')
    .type('application/vnd.collection+json')
    .send({
      template: {
        data: [
          { name: 'id', value: 'comment1' },
          { name: 'text', value: COMMENTS.comment1.text },
        ],
      },
    });
  return expect(response).resolves.toHaveProperty('ok', true);
});

it('GET /comments/comment1', () => {
  const server = createServer(router, { model: createModel({}) });
  const response = request(server).get('/comments/comment1');
  return expect(response).resolves.toHaveProperty('ok', true);
});

it('GET /comments/comment1/delete', () => {
  const server = createServer(router, { model: createModel({}) });
  const response = request(server).get('/comments/comment1/delete');
  return expect(response).resolves.toHaveProperty('ok', true);
});

it('POST /comments/comment1/delete', () => {
  const server = createServer(router, {
    model: createAuthenticatedModel({}),
  });
  const response = request(server).post('/comments/comment1/delete');
  return expect(response).resolves.toHaveProperty('ok', true);
});

it('GET /threads', () => {
  const server = createServer(router, { model: createModel({}) });
  const response = request(server).get('/threads');
  return expect(response).resolves.toHaveProperty('ok', true);
});

it('POST /threads', () => {
  const server = createServer(router, {
    model: createAuthenticatedModel({}),
  });
  const response = request(server)
    .post('/threads')
    .type('application/vnd.collection+json')
    .send({
      template: {
        data: [
          { name: 'headline', value: THREADS.thread1.headline },
          { name: 'articleBody', value: THREADS.thread1.articleBody },
        ],
      },
    });
  return expect(response).resolves.toHaveProperty('ok', true);
});

it('GET /threads/lorem-ipsum', () => {
  const server = createServer(router, { model: createModel({}) });
  const response = request(server).get('/threads/lorem-ipsum');
  return expect(response).resolves.toHaveProperty('ok', true);
});

it('GET /threads/lorem-ipsum/delete', () => {
  const server = createServer(router, { model: createModel({}) });
  const response = request(server).get('/threads/lorem-ipsum/delete');
  return expect(response).resolves.toHaveProperty('ok', true);
});

it('POST /threads/lorem-ipsum/delete', () => {
  const server = createServer(router, {
    model: createAuthenticatedModel({}),
  });
  const response = request(server).post('/threads/lorem-ipsum/delete');
  return expect(response).resolves.toHaveProperty('ok', true);
});

it('POST /users', () => {
  const server = createServer(router, { model: createModel({}) });
  const response = request(server)
    .post('/users')
    .type('application/vnd.collection+json')
    .send({
      template: {
        data: [
          { name: 'username', value: USER.username },
          { name: 'password', value: USER.password },
        ],
      },
    });
  return expect(response).resolves.toHaveProperty('ok', true);
});

it('GET /users/fred-astaire', () => {
  const server = createServer(router, { model: createModel({}) });
  const response = request(server).get('/users/fred-astaire');
  return expect(response).resolves.toHaveProperty('ok', true);
});
