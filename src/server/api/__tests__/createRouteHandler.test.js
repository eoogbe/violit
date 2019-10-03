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

import { MethodNotAllowed } from 'http-errors';
import { createResponse } from 'testUtils/testServerResponse';
import createRouteHandler from '../createRouteHandler';

it('calls the appropriate route handler', async () => {
  const controller = {
    get: () => ({ href: 'http://localhost:4000/api' }),
    post: () => {},
  };
  const req = { method: 'GET' };
  const res = createResponse({});

  await createRouteHandler(controller)(req, res);

  expect(res.send).toHaveBeenCalledWith({
    collection: {
      href: 'http://localhost:4000/api',
    },
  });
});

it('when route handler does not return a body', async () => {
  const controller = {
    get: () => {},
  };
  const req = { method: 'GET' };
  const res = createResponse({
    removeHeader: jest.fn(),
  });

  await createRouteHandler(controller)(req, res);

  expect(res.removeHeader).toHaveBeenCalledWith('Content-Type');
  expect(res.send).toHaveBeenCalledWith();
});

it('when HEAD request calls the get route', async () => {
  const controller = {
    get: jest.fn(() => ({ href: 'http://localhost:4000/api' })),
  };
  const req = { method: 'HEAD' };
  const res = createResponse({
    removeHeader: jest.fn(),
  });

  await createRouteHandler(controller)(req, res);

  expect(controller.get).toHaveBeenCalledWith(req, res);
  expect(res.send).toHaveBeenCalledWith();
});
