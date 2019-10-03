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

import { all, fork } from 'redux-saga/effects';
import checkHasUserDaemon from './checkHasUser';
import loadCredentialsDaemon from './loadCredentials';
import loginDaemon from './login';
import logoutDaemon from './logout';
import signupDaemon from './signup';

/** The main auth saga. */
export default function* root() {
  yield all([
    fork(checkHasUserDaemon),
    fork(loadCredentialsDaemon),
    fork(loginDaemon),
    fork(logoutDaemon),
    fork(signupDaemon),
  ]);
}
