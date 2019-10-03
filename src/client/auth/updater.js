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

import {
  concat,
  constantState,
  decorate,
  handleAction,
  updateStateAt,
  withDefaultState,
} from 'redux-fp';
import matchActions from 'client/utils/matchActions';
import actions from './actions';

const INITIAL_STATE = {};

/** Updater that sets the current user's credentials. */
const setCredentials =
  decorate(
    matchActions([
      actions.loadSucceeded.type,
      actions.loginSucceeded.type,
      actions.signupSucceeded.type,
    ]),
    updateStateAt('credentials'),
    ({ payload }) => () => payload.user
  );

/** Updater that unsets the current user's credentials. */
const unsetCredentials =
  decorate(
    handleAction(actions.logoutTriggered.type),
    updateStateAt('credentials'),
    constantState(null)
  );

/** The auth updater. */
export default decorate(
  withDefaultState(INITIAL_STATE),
  concat(
    setCredentials,
    unsetCredentials,
  )
);
