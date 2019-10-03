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

import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import TestRenderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import * as USER from '__fixtures__/userFixture';
import { wait } from 'testUtils/wait';
import { NAME } from '../constants';
import actions from '../actions';
import useCredentials from '../useCredentials';

const mockStore = configureStore();

const TestComponent = () => {
  const credentials = useCredentials();

  return <div className="credentials">{JSON.stringify(credentials)}</div>;
};

it('loads the credentials on mount', async () => {
  const store = mockStore();

  TestRenderer.create(
    <Provider store={store}>
      <TestComponent />
    </Provider>
  );

  await wait();

  expect(store.getActions()).toEqual([actions.loadTriggered()]);
});

it('returns the loaded credentials', () => {
  const store = mockStore({
    [NAME]: {
      credentials: USER.credentials,
    },
  });

  const wrapper = mount(
    <Provider store={store}>
      <TestComponent />
    </Provider>
  );

  const credentials = wrapper.find('.credentials').text();
  expect(credentials).toBe(JSON.stringify(USER.credentials));
});
