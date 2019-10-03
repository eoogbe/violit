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

import { expectSaga } from 'redux-saga-test-plan';
import * as USER from '__fixtures__/userFixture';
import mockFetch from 'testUtils/mockFetch';
import wrapPromise from 'client/utils/wrapPromise';
import actions from '../../actions';
import * as api from '../../api';
import saga from '../login';

const CREDENTIALS = {
  username: USER.username,
  password: USER.password,
};

const LOGIN_TRIGGERED_ACTION = actions.loginTriggered(CREDENTIALS);

it('with result puts loginSucceeded action', () => {
  mockFetch([
    USER.loginFetch,
  ]);
  return expectSaga(saga)
    .call(wrapPromise, api.login, [CREDENTIALS])
    .put(actions.loginSucceeded(USER.credentials))
    .dispatch(LOGIN_TRIGGERED_ACTION)
    .silentRun();
});

it('with error puts loginFailed action', () => {
  mockFetch([
    {
      url: USER.authUrl,
      method: 'POST',
      status: 500,
    },
  ]);
  return expectSaga(saga)
    .call(wrapPromise, api.login, [CREDENTIALS])
    .put(actions.loginFailed())
    .dispatch(LOGIN_TRIGGERED_ACTION)
    .silentRun();
});

it('when result has error puts credentialsInvalid action', () => {
  const message = 'Username or password is incorrect.';
  mockFetch([
    {
      url: USER.authUrl,
      method: 'POST',
      status: 404,
      body: {
        error: { message },
      },
    },
  ]);

  return expectSaga(saga)
    .call(wrapPromise, api.login, [CREDENTIALS])
    .put(actions.credentialsInvalid(message))
    .dispatch(LOGIN_TRIGGERED_ACTION)
    .silentRun();
});
