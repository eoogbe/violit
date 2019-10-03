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

import { NotFound, UnprocessableEntity } from 'http-errors';
import * as USER from '__fixtures__/userFixture';
import initDb from 'testUtils/initializeDatabase';
import createModel from '../model';

let db;

beforeEach(() => {
  db = initDb();
});

afterEach(() => {
  db.close();
});

describe('getUserById', () => {
  it('finds a user by its id', () => {
    const { getUserById } = createModel({ db });
    const user = getUserById('user1');
    expect(user).toEqual(USER.credentials);
  });
  it('when user not found rejects the promise', () => {
    const { getUserById } = createModel({ db });
    expect(() => getUserById('7')).toThrow(new NotFound());
  });
});

describe('getUserByUsername', () => {
  it('finds a user by its username', () => {
    const { getUserByUsername } = createModel({ db });
    const user = getUserByUsername(USER.username);
    expect(user).toEqual(USER.credentials);
  });
  it('when user not found rejects the promise', () => {
    const { getUserByUsername } = createModel({ db });
    expect(() => getUserByUsername('not-found')).toThrow(new NotFound());
  });
});

describe('createUser', () => {
  it('creates a user', () => {
    const { createUser } = createModel({ db });
    const input = { username: 'ginger-rogers', password: 'password456' };

    const user = createUser(input);

    return expect(user).resolves.toEqual({ username: 'ginger-rogers' });
  });
  it('with empty username rejects the promise', () => {
    const { createUser } = createModel({ db });
    const input = { username: '', password: 'password456' };

    const error = createUser(input);

    return expect(error).rejects.toEqual(
      new UnprocessableEntity('Username is required.')
    );
  });
  it('when username has special characters rejects the promise', () => {
    const { createUser } = createModel({ db });
    const input = { username: 'ginger-rogers!', password: 'password456' };

    const error = createUser(input);

    return expect(error).rejects.toEqual(
      new UnprocessableEntity(
        'Username can only have letters, numbers, \'-\', or \'_\'.'
      )
    );
  });
  it('when username does not start with a letter rejects the promise', () => {
    const { createUser } = createModel({ db });
    const input = { username: '1ginger-rogers', password: 'password456' };

    const error = createUser(input);

    return expect(error).rejects.toEqual(
      new UnprocessableEntity('Username must start with a letter.')
    );
  });
  it('when username already exists rejects the promise', () => {
    const { createUser } = createModel({ db });
    const input = { username: USER.username, password: 'password456' };

    const error = createUser(input);

    return expect(error).rejects.toEqual(
      new UnprocessableEntity('Username is already taken.')
    );
  });
  it('with empty password rejects the promise', () => {
    const { createUser } = createModel({ db });
    const input = { username: 'ginger-rogers', password: '' };

    const error = createUser(input);

    return expect(error).rejects.toEqual(
      new UnprocessableEntity('Password is required.')
    );
  });
  it('when password less than 8 characters rejects the promise', () => {
    const { createUser } = createModel({ db });
    const input = { username: 'ginger-rogers', password: 'short' };

    const error = createUser(input);

    return expect(error).rejects.toEqual(
      new UnprocessableEntity('Password must be at least 8 characters.')
    );
  });
});
