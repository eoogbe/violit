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
  validateUsername,
  validatePassword,
  validatePasswordConfirmation,
} from '../validation';

describe('validateUsername', () => {
  it('with empty username returns error', () => {
    const error = validateUsername({ username: '' }, {});
    expect(error).resolves.toBe('Required.');
  });
  it('when username has special characters returns error', () => {
    const error = validateUsername({ username: 'ginger-rogers!' }, {});
    expect(error).resolves.toBe(
      'Can only have letters, numbers, \'-\', or \'_\'.'
    );
  });
  it('when username does not start with a letter returns error', () => {
    const error = validateUsername({ username: '1ginger-rogers' }, {});
    expect(error).resolves.toBe('Must start with a letter.');
  });
  it('when username already exists on the server returns error', () => {
    const error = validateUsername({ username: USER.username }, {
      checkHasUserAsyncFunc: {
        asyncFunction: () => Promise.resolve({ hasUser: true })
      },
    });

    expect(error).resolves.toBe('Already taken.');
  });
  it('with valid username returns null', () => {
    const error = validateUsername({ username: USER.username }, {
      checkHasUserAsyncFunc: {
        asyncFunction: () => Promise.resolve({ hasUser: false })
      },
    });

    expect(error).resolves.toBeNull();
  });
});

describe('validatePassword', () => {
  it('with empty password returns error', () => {
    const error = validatePassword({ password: '' });
    expect(error).toBe('Required.');
  });
  it('when password less than 8 characters returns error', () => {
    const error = validatePassword({ password: 'short' });
    expect(error).toBe('Must be at least 8 characters.');
  });
  it('with valid password returns null', () => {
    const error = validatePassword({ password: USER.password });
    expect(error).toBeNull();
  });
});

describe('validatePasswordConfirmation', () => {
  it('with empty password confirmation returns error', () => {
    const error = validatePasswordConfirmation({ passwordConfirmation: '' });
    expect(error).toBe('Required.');
  });
  it('when password confirmation does not match password returns error', () => {
    const error = validatePasswordConfirmation({
      password: USER.password,
      passwordConfirmation: 'different',
    });
    expect(error).toBe('Must match password.');
  });
  it('with valid password confirmation returns null', () => {
    const error = validatePasswordConfirmation({
      password: USER.password,
      passwordConfirmation: USER.password,
    });
    expect(error).toBeNull();
  });
});
