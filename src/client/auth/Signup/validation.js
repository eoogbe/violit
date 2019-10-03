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

/** Validates that the username is correct. */
export const validateUsername =
  async ({ username }, { checkHasUserAsyncFunc }) => {
    if (!username) {
      return 'Required.';
    }

    if (!/^[\w-]+$/.test(username)) {
      return 'Can only have letters, numbers, \'-\', or \'_\'.';
    }

    if (!/^[A-Z]/i.test(username)) {
      return 'Must start with a letter.';
    }

    try {
      const { hasUser } = await checkHasUserAsyncFunc.asyncFunction({
        username,
      });
      if (hasUser) {
        return 'Already taken.';
      }
    } catch (e) {
      // Pass through. Handle validation on the server.
    }

    return null;
  };

/** Validates that the password is correct. */
export const validatePassword = ({ password }) => {
  if (!password) {
    return 'Required.';
  }

  if (password.length < 8) {
    return 'Must be at least 8 characters.';
  }

  return null;
};

/** Validates that the password confirmation is  correct. */
export const validatePasswordConfirmation =
  ({ password, passwordConfirmation }) => {
    if (!passwordConfirmation) {
      return 'Required.';
    }

    if (passwordConfirmation !== password) {
      return 'Must match password.';
    }

    return null;
  };
