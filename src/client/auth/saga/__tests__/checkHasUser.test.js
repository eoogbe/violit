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

import { debounce } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as USER from '__fixtures__/userFixture';
import mockFetch from 'testUtils/mockFetch';
import wrapPromise from 'client/utils/wrapPromise';
import actions from '../../actions';
import * as api from '../../api';
import checkHasUserDaemon, { checkHasUser } from '../checkHasUser';

const CHECK_HAS_USER_TRIGGERED_ACTION =
  actions.checkHasUserTriggered(USER.username);

it('debounces the worker saga', () => {
  testSaga(checkHasUserDaemon)
    .next()
    .is(debounce(1000, actions.checkHasUserTriggered.type, checkHasUser))
    .next()
    .isDone();
});

it('with results puts checkHasUserSucceeded', () => {
  mockFetch([
    USER.hasUserFetch,
  ]);
  return expectSaga(checkHasUser, CHECK_HAS_USER_TRIGGERED_ACTION)
    .call(wrapPromise, api.checkHasUser, [USER.username])
    .put(actions.checkHasUserSucceeded(true))
    .run();
});

it('with error puts checkHasUserFailed', () => {
  mockFetch([
    {
      url: USER.userUrl,
      method: 'HEAD',
      status: 500,
    },
  ]);
  return expectSaga(checkHasUser, CHECK_HAS_USER_TRIGGERED_ACTION)
    .call(wrapPromise, api.checkHasUser, [USER.username])
    .put(actions.checkHasUserFailed())
    .run();
});
