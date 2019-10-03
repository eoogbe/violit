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

import * as R from 'ramda';
import { checkExists, href, load, sendCreate, sendDelete } from 'client/api';

/** Creates the specified `credentials` on the server. */
const createCredentials = async (url, credentials, {
  status,
  errorMessage,
 }) => {
  try {
    const { body } = await sendCreate(
      url,
      ['username', 'password'],
      credentials
    );
    return R.pick(['username'], body);
  } catch (err) {
    if (R.path(['response', 'status'], err) !== status) {
      throw new Error(errorMessage);
    }

    const message = R.path(['response', 'body', 'error', 'message'], err);
    if (!message) {
      throw new Error(errorMessage);
    }

    return { error: message };
  }
};

/** Loads the current user's credentials from the server if they exist. */
export const loadCredentials = async () => {
  try {
    const credentials = await load(href('/auth'));
    return R.pick(['username'], credentials);
  } catch (err) {
    if (R.path(['response', 'status'], err) !== 405) {
      throw new Error('Something went wrong with loading the credentials.');
    }

    return null;
  }
};

/** Authenticates a user. */
export const login = (credentials) =>
  createCredentials(href('/auth'), credentials, {
    status: 404,
    errorMessage: 'Something went wrong with logging in.'
  });

/** Logs a user out of the current session. */
export const logout = async () => {
  await sendDelete(href('/auth'));
  return null;
};

/** Registers the specified `user` on the server. */
export const signup = (user) =>
  createCredentials(href('/users'), user, {
    status: 422,
    errorMessage: 'Something went wrong with signing up.'
  });

/** Checks if a user with the specified `username` exists on the server. */
export const checkHasUser = (username) =>
  checkExists(href(`/users/${username}`));
