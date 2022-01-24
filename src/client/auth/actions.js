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

import createActions from 'client/utils/createActions';

export default createActions('auth', [
  'LOAD_TRIGGERED',
  ['LOAD_SUCCEEDED', 'user'],
  'LOAD_FAILED',
  ['LOGIN_TRIGGERED', 'credentials'],
  ['LOGIN_SUCCEEDED', 'user'],
  'LOGIN_FAILED',
  ['CREDENTIALS_INVALID', 'error'],
  'LOGOUT_TRIGGERED',
  ['SIGNUP_TRIGGERED', 'user'],
  ['SIGNUP_SUCCEEDED', 'user'],
  ['SIGNUP_FAILED'],
  ['CHECK_HAS_USER_TRIGGERED', 'username'],
  ['CHECK_HAS_USER_SUCCEEDED', 'hasUser'],
  'CHECK_HAS_USER_FAILED',
]);
