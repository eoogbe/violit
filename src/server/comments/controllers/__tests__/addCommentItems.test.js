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

import * as COMMENTS from '__fixtures__/commentsFixture';
import * as USER from '__fixtures__/userFixture';
import routes from 'server/api/routes';
import { createAuthenticatedModel } from 'testUtils/testServerModel';
import addCommentItems from '../addCommentItems';

it('adds comments to the items of a collection', () => {
  const collection = addCommentItems({
    credentials: USER.credentials,
    model: createAuthenticatedModel({}),
    routes,
  })(COMMENTS.unnormalized)({});
  expect(collection).toEqual({
    items: COMMENTS.api,
  });
});
