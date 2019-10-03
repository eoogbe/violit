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
import controller from '../users';

describe('POST', () => {
  it('creates a user', async () => {
    const req = {
      body: {
        template: {
          data: [
            { name: 'username', value: USER.username },
            { name: 'password', value: USER.password },
          ],
        },
      },
    };
    const res = createResponse({
      cookie: jest.fn().mockReturnThis(),
    });

    const collection = await controller.post(req, res);

    expect(res.cookie).toHaveBeenCalledWith('token', 'token123', {
      httpOnly: true,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.set).toHaveBeenCalledWith(
      'Location',
      USER.userUrl
    );
    expect(res.set).toHaveBeenCalledWith(
      'Content-Location',
      USER.userUrl
    );
    expect(collection).toEqual({
      version: '1.0',
      href: USER.userUrl,
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticated-as', href: 'http://localhost:4000/api/auth' },
        { rel: 'logout', href: 'http://localhost:4000/api/auth' },
      ],
      items: USER.userApi,
    });
  });
});
