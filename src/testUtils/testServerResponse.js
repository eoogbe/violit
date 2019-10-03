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

import * as R from 'ramda';
import routes from 'server/api/routes';
import { createAuthenticatedModel, createModel } from './testServerModel';
import * as USER from '__fixtures__/userFixture';

/** Creates a test response object with default values. */
export const createResponse = R.mergeDeepRight({
  status: jest.fn().mockReturnThis(),
  set: jest.fn().mockReturnThis(),
  clearCookie: jest.fn().mockReturnThis(),
  send: jest.fn(),
  locals: {
    model: createModel({}),
    routes,
  },
});

/** Creates a test response object for an authenticated user. */
export const createAuthenticatedResponse = R.mergeDeepRight(createResponse({
  locals: {
    model: createAuthenticatedModel({}),
    credentials: USER.credentials,
  },
}));
