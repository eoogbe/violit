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
import {
  createAuthenticatedResponse,
  createResponse,
} from 'testUtils/testServerResponse';
import controller from '../controller';

describe('GET', () => {
  it('sends the auth credentials', () => {
    const req = {};
    const res = createAuthenticatedResponse({});

    const collection = controller.get(req, res);

    expect(collection).toEqual({
      version: '1.0',
      href: USER.authUrl,
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticated-as', href: USER.authUrl },
        { rel: 'logout', href: USER.authUrl },
      ],
      items: USER.authApi,
    });
  });
});

describe('POST', () => {
  it('saves the auth token', async () => {
    const req = {
      cookies: {},
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
      USER.authUrl
    );
    expect(res.set).toHaveBeenCalledWith(
      'Content-Location',
      USER.authUrl
    );
    expect(collection).toEqual({
      version: '1.0',
      href: USER.authUrl,
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticated-as', href: USER.authUrl },
        { rel: 'logout', href: USER.authUrl },
      ],
      items: USER.authApi,
    });
  });
});

describe('DELETE', () => {
  it('clears the token cookie', () => {
    const res = createResponse({});

    const collection = controller.delete(null, res);

    expect(res.clearCookie).toHaveBeenCalledWith('token');
    expect(collection).toEqual({
      version: '1.0',
      href: USER.authUrl,
      links: [
        { rel: 'home', href: 'http://localhost:4000/api' },
        { rel: 'authenticate', href: USER.authUrl },
        { rel: 'register-user', href: 'http://localhost:4000/api/users' },
      ],
    });
  });
});
