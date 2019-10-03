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

/** Worker saga for loading the credentials from the server. */
function* loadCredentials() {
  const { result, error } = yield call(wrapPromise, api.loadCredentials);
  if (error) {
    return yield put(actions.loadFailed());
  }

  yield put(actions.loadSucceeded(result));
}

/** Watcher saga for loading the credentials from the server. */
export default function* loadCredentialsDaemon() {
  yield takeLatest(actions.loadTriggered.type, loadCredentials);
}
