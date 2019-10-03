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
import saga from '../logout';

it('calls the logout api', () => {
  mockFetch([
    USER.logoutFetch,
  ]);
  return expectSaga(saga)
    .call(wrapPromise, api.logout)
    .dispatch(actions.logoutTriggered())
    .silentRun();
});
