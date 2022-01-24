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

import { call, takeLatest } from 'redux-saga/effects';
import wrapPromise from 'client/utils/wrapPromise';
import actions from '../actions';
import * as api from '../api';

/** Worker saga for logging a user out of the current session. */
function* logout() {
  yield call(wrapPromise, api.logout);
}

/** Watcher saga for logging a user out of the current session. */
export default function* logoutDaemon() {
  yield takeLatest(actions.logoutTriggered.type, logout);
}
