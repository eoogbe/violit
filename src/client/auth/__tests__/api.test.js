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
import mockFetch from 'testUtils/mockFetch';
import { checkHasUser, loadCredentials, login, logout, signup } from '../api';

describe('loadCredentials', () => {
  it('loads the credentials from the server', () => {
    mockFetch([
      USER.credentialsFetch,
    ]);
    const credentials = loadCredentials();
    return expect(credentials).resolves.toEqual(USER.credentials);
  });
  it('when error status not 405 throws', () => {
    mockFetch([
      {
        url: USER.authUrl,
        method: 'GET',
        status: 500,
      },
    ]);
    const error = loadCredentials();
    return expect(error).rejects.toBeInstanceOf(Error);
  });
  it('with 405 error returns empty credentials', () => {
    mockFetch([
      {
        url: USER.authUrl,
        method: 'GET',
        status: 405,
      },
    ]);
    const credentials = loadCredentials();
    return expect(credentials).resolves.toBeNull();
  });
});

describe('login', () => {
  it('creates credentials on the server', () => {
    mockFetch([
      USER.loginFetch,
    ]);
    const credentials = login({
      username: USER.username,
      password: USER.password,
    });
    return expect(credentials).resolves.toEqual(USER.credentials);
  });
  describe('with error', () => {
    it('when error status not 404 throws', () => {
      mockFetch([
        {
          url: USER.authUrl,
          method: 'POST',
          status: 500,
        },
      ]);
      const error = login({
        username: USER.username,
        password: USER.password,
      });
      return expect(error).rejects.toBeInstanceOf(Error);
    });
    it('without error message throws', () => {
      mockFetch([
        {
          url: USER.authUrl,
          method: 'POST',
          status: 404,
        },
      ]);
      const error = login({
        username: USER.username,
        password: USER.password,
      });
      return expect(error).rejects.toBeInstanceOf(Error);
    });
    it('with 404 error returns error result', () => {
      mockFetch([
        {
          url: USER.authUrl,
          method: 'POST',
          status: 404,
          body: {
            error: {
              message: 'Username or password is incorrect.',
            },
          },
        },
      ]);
      const result = login({
        username: USER.username,
        password: USER.password,
      });
      return expect(result).resolves.toEqual({
        error: 'Username or password is incorrect.',
      });
    });
  });
});

describe('logout', () => {
  it('deletes the credentials from the server', () => {
    mockFetch([
      USER.logoutFetch,
    ]);
    const result = logout();
    return expect(result).resolves.toBeNull();
  });
});

describe('signup', () => {
  it('creates a user on the server', () => {
    mockFetch([
      USER.signupFetch,
    ]);
    const credentials = signup({
      username: USER.username,
      password: USER.password,
    });
    return expect(credentials).resolves.toEqual(USER.credentials);
  });
  describe('with error', () => {
    it('when error status not 422 throws', () => {
      mockFetch([
        {
          url: USER.usersUrl,
          method: 'POST',
          status: 500,
        },
      ]);
      const error = signup({
        username: USER.username,
        password: USER.password,
      });
      return expect(error).rejects.toBeInstanceOf(Error);
    });
    it('without error message throws', () => {
      mockFetch([
        {
          url: USER.usersUrl,
          method: 'POST',
          status: 422,
        },
      ]);
      const error = signup({
        username: USER.username,
        password: USER.password,
      });
      return expect(error).rejects.toBeInstanceOf(Error);
    });
    it('with 422 error returns error result', () => {
      mockFetch([
        {
          url: USER.usersUrl,
          method: 'POST',
          status: 422,
          body: {
            error: {
              message: 'Username is already taken.',
            },
          },
        },
      ]);
      const result = signup({
        username: USER.username,
        password: USER.password,
      });
      return expect(result).resolves.toEqual({
        error: 'Username is already taken.',
      });
    });
  });
});

describe('checkHasUser', () => {
  it('checks for the existence of a user on the server', () => {
    mockFetch([
      USER.hasUserFetch,
    ]);
    const hasUser = checkHasUser(USER.username);
    return expect(hasUser).resolves.toBe(true);
  });
});
