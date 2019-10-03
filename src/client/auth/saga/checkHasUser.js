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

import { call, debounce, put } from 'redux-saga/effects';
import wrapPromise from 'client/utils/wrapPromise';
import actions from '../actions';
import * as api from '../api';

/** Worker saga for checking if a user exists on the server. */
export function* checkHasUser({ payload }) {
  const { result, error } = yield call(wrapPromise, api.checkHasUser, [
    payload.username,
  ]);
  if (error) {
    return yield put(actions.checkHasUserFailed());
  }

  yield put(actions.checkHasUserSucceeded(result));
}

/**
 * Watcher saga for checking if a user exists on the server.
 *
 * Limits the rate of server calls.
 */
export default function* checkHasUserDaemon() {
  yield debounce(1000, actions.checkHasUserTriggered.type, checkHasUser);
}
