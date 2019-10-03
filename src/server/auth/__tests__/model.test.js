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

import fs from 'fs';
import { Forbidden, NotFound } from 'http-errors';
import jwt from 'jsonwebtoken';
import * as USER from '__fixtures__/userFixture';
import initDb from 'testUtils/initializeDatabase';
import createModel from '../model';

const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8');
const publicKey = fs.readFileSync(process.env.PUBLIC_KEY_PATH, 'utf8');

const sign = () => {
  const payload = {
    iat: Math.floor(Date.now() / 1000),
  };
  return jwt.sign(payload, privateKey, {
    algorithm: 'RS256',
    subject: 'fred-astaire',
  });
};

let db;

beforeEach(() => {
  db = initDb();
});

afterEach(() => {
  db.close();
});

describe('verify', () => {
  it('reverses sign', async () => {
    const { sign, verify } = createModel({ db });

    const token = await sign({ username: USER.username });
    const decoded = await verify(token);

    expect(decoded).toMatchObject({
      sub: USER.username,
      iat: expect.any(Number),
    });
  });
});

describe('getCredentials', () => {
  it('returns the verified credentials', () => {
    const { getCredentials } = createModel({ db });

    const token = sign();

    const credentials = getCredentials(token);
    return expect(credentials).resolves.toEqual({
      username: 'fred-astaire',
    });
  });
  it('with invalid token rejects the promise', () => {
    const { getCredentials } = createModel({ db });
    const error = getCredentials('token123');
    return expect(error).rejects.toEqual(
      new Forbidden('Not authenticated')
    );
  });
});

describe('createCredentials', () => {
  it('returns a JWT token', async () => {
    const { createCredentials } = createModel({ db });

    const token = await createCredentials({
      username: USER.username,
      password: USER.password,
    });

    const credentials = jwt.verify(token, publicKey);
    expect(credentials).toMatchObject({
      sub: USER.username,
      iat: expect.any(Number),
    });
  });
  it('with invalid username rejects the promise', () => {
    const { createCredentials } = createModel({ db });
    const error = createCredentials({
      username: 'invalid',
      password: USER.password,
    });
    return expect(error).rejects.toEqual(
      new NotFound('Username or password is incorrect')
    );
  });
  it('with invalid password rejects the promise', () => {
    const { createCredentials } = createModel({ db });
    const error = createCredentials({
      username: USER.username,
      password: 'invalid',
    });
    return expect(error).rejects.toEqual(
      new NotFound('Username or password is incorrect')
    );
  });
});
