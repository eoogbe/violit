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
import { createAuthenticatedResponse } from 'testUtils/testServerResponse';
import policies from '../commentDelete';

describe('POST', () => {
  it('checks if the current user can delete the comment', () => {
    const req = {
      params: {
        commentId: 'comment1',
      },
    };
    const res = createAuthenticatedResponse({});

    const isAllowed = policies.post(req, res);

    expect(isAllowed).toBe(true);
  });
});
