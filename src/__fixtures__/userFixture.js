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

export const username = 'fred-astaire';

export const password = 'password123';

export const credentials = {
  username,
};

export const authUrl = 'http://localhost:4000/api/auth';

export const usersUrl = 'http://localhost:4000/api/users';

export const userUrl = 'http://localhost:4000/api/users/fred-astaire';

export const authApi = [
  {
    href: authUrl,
    data: [
      { name: 'username', value: username },
    ],
  }
];

export const userApi = [
  {
    href: userUrl,
    data: [
      { name: 'username', value: username },
    ],
  }
];

export const credentialsFetch = {
  url: authUrl,
  method: 'GET',
  status: 200,
  body: {
    items: userApi,
  },
};

export const loginFetch = {
  url: authUrl,
  method: 'POST',
  status: 201,
  body: {
    items: userApi,
  },
};

export const logoutFetch = {
  url: authUrl,
  method: 'DELETE',
  status: 200,
};

export const signupFetch = {
  url: usersUrl,
  method: 'POST',
  status: 201,
  body: {
    items: userApi,
  },
};

export const hasUserFetch = {
  url: userUrl,
  method: 'HEAD',
  status: 200,
};

export const doesNotHaveUserFetch = {
  url: userUrl,
  method: 'HEAD',
  status: 404,
};
