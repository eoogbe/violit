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

import * as R from 'ramda';
import { createSelector } from 'reselect';
import { NAME } from './constants';

/** Selects the auth state. */
export const getAuth = R.prop(NAME);

/** Selects the credentials of the current user. */
export const getCredentials = createSelector(
  [getAuth],
  R.prop('credentials')
);

/** Selects the username of the current user. */
export const getUsername = createSelector(
  [getAuth],
  R.path(['credentials', 'username'])
);
