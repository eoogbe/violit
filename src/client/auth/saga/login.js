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

import { call, put, takeLatest } from 'redux-saga/effects';
import wrapPromise from 'client/utils/wrapPromise';
import actions from '../actions';
import * as api from '../api';

/** Worker saga for authenticating a user. */
function* login({ payload }) {
  const { result, error } = yield call(wrapPromise, api.login, [
    payload.credentials,
  ]);
  if (error) {
    return yield put(actions.loginFailed());
  }

  if (result.error) {
    return yield put(actions.credentialsInvalid(result.error));
  }

  yield put(actions.loginSucceeded(result));
}

/** Watcher saga for authenticating a user. */
export default function* loginDaemon() {
  yield takeLatest(actions.loginTriggered.type, login);
}
