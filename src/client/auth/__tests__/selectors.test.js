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

import * as USER from '__fixtures__/userFixture';
import { NAME } from '../constants';
import { getCredentials, getUsername } from '../selectors';

describe('getCredentials', () => {
  it('gets the credentials of the current user', () => {
    const state = {
      [NAME]: {
        credentials: USER.credentials,
      },
    };
    const credentials = getCredentials(state);
    expect(credentials).toEqual(USER.credentials);
  });
});

describe('getUsername', () => {
  it('gets the username of the current user', () => {
    const state = {
      [NAME]: {
        credentials: USER.credentials,
      },
    };
    const username = getUsername(state);
    expect(username).toBe(USER.username);
  });
});
