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
import * as R from 'ramda';
import { Provider } from 'react-redux';
import TestRenderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import * as USER from '__fixtures__/userFixture';
import {
  actions as authActions,
  constants as authConstants,
} from 'client/auth';
import UserDropdown from '../UserDropdown';

const STATE = {
  [authConstants.NAME]: {
    credentials: USER.credentials,
  },
};

const mockStore = configureStore();

it('renders without crashing', () => {
  const store = mockStore(STATE);
  const renderer = TestRenderer.create(
    <Provider store={store}>
      <UserDropdown />
    </Provider>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});

it('renders the open menu', () => {
  const store = mockStore(STATE);
  const renderer = TestRenderer.create(
    <Provider store={store}>
      <UserDropdown />
    </Provider>
  );
  const instance = renderer.root;

  const toggle = instance.find(R.pathEq(['type', 'displayName'], 'Toggle'));
  TestRenderer.act(() => {
    toggle.props.onClick();
  });
  expect(renderer.toJSON()).toMatchSnapshot();
});

it('triggers logout', () => {
  const store = mockStore(STATE);
  const wrapper = mount(
    <Provider store={store}>
      <UserDropdown />
    </Provider>
  );

  wrapper.find('Toggle').simulate('click');
  wrapper.find('MenuItemButton').first().simulate('click');

  expect(store.getActions()).toEqual([authActions.logoutTriggered()]);
});
