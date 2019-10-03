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

import { Forbidden } from 'http-errors';
import * as USER from '__fixtures__/userFixture';
import {
  createAuthenticatedModel,
  createModel,
} from 'testUtils/testServerModel';
import {
  createAuthenticatedResponse,
  createResponse,
} from 'testUtils/testServerResponse';
import setCredentials from '../setCredentials';

it('sets the response credentials', async () => {
  const req = {
    cookies: {
      token: 'token123',
    },
  };
  const res = createAuthenticatedResponse({});
  const next = jest.fn();

  await setCredentials(req, res, next);

  expect(res.locals.credentials).toEqual(USER.credentials);
  expect(next).toHaveBeenCalled();
});

it('without credentials clears the cookie', async () => {
  const req = {
    cookies: {
      token: 'token123',
    },
  };
  const res = createResponse({
    locals: {
      model: {
        auth: {
          getCredentials: () => Promise.reject(new Forbidden()),
        },
      },
    },
  });
  const next = jest.fn();

  await setCredentials(req, res, next);

  expect(res.locals.credentials).toBeNull();
  expect(res.clearCookie).toHaveBeenCalledWith('token');
  expect(next).toHaveBeenCalled();
});

it('when unexpected error rejects the promise', () => {
  const req = {
    cookies: {
      token: 'token123',
    },
  };
  const res = createResponse({
    locals: {
      model: {
        auth: {
          getCredentials: () => Promise.reject(new Error()),
        },
      },
    },
  });

  const error = setCredentials(req, res);

  expect(error).rejects.toEqual(new Error());
});
