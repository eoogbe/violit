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
import { createResponse } from 'testUtils/testServerResponse';
import controller from '../user';

describe('GET', () => {
  it('sends a user', () => {
    const req = {
      params: { username: 'fred-astaire' },
    };
    const res = createResponse({});

    const collection = controller.get(req, res);

    expect(collection).toEqual({
      version: '1.0',
      href: USER.userUrl,
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: 'http://localhost:4000/api/auth' },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
      items: USER.userApi,
    });
  });
});
