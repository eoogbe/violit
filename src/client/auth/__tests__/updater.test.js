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
import actions from '../actions';
import updater from '../updater';

it('initializes the state', () => {
  const action = { type: '' };
  const next = updater(action)();
  expect(next).toEqual({});
});

it('handles loadSucceeded', () => {
  const action = actions.loadSucceeded(USER.credentials);
  const next = updater(action)({});
  expect(next).toEqual({
    credentials: USER.credentials,
  });
});

it('handles loginSucceeded', () => {
  const action = actions.loginSucceeded(USER.credentials);
  const next = updater(action)({});
  expect(next).toEqual({
    credentials: USER.credentials,
  });
});

it('handles logoutTriggered', () => {
  const action = actions.logoutTriggered();
  const next = updater(action)({});
  expect(next).toEqual({
    credentials: null,
  });
});

it('handles signupSucceeded', () => {
  const action = actions.signupSucceeded(USER.credentials);
  const next = updater(action)({});
  expect(next).toEqual({
    credentials: USER.credentials,
  });
});
