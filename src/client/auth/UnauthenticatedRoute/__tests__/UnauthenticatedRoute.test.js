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
import configureStore from 'redux-mock-store';
import { MemoryRouter, Route } from 'react-router-dom';
import TestRenderer from 'react-test-renderer';
import * as USER from '__fixtures__/userFixture';
import { wait } from 'testUtils/wait';
import actions from '../../actions';
import { NAME } from '../../constants';
import UnauthenticatedRoute from '../UnauthenticatedRoute';

const mockStore = configureStore();

it('with credentials redirects to the home screen', () => {
  const store = mockStore({
    [NAME]: {
      credentials: USER.credentials,
    },
  });

  let location;
  TestRenderer.create(
    <Provider store={store}>
      <MemoryRouter>
        <UnauthenticatedRoute>
          <div />
        </UnauthenticatedRoute>
        <Route
          path="*"
          render={(props) => {
            location = props.location;
            return null;
          }}
        />
      </MemoryRouter>
    </Provider>
  );

  expect(location).toHaveProperty('pathname', '/');
});

it('without credentials renders its children', () => {
  const store = mockStore();
  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter>
        <UnauthenticatedRoute>
          <div />
        </UnauthenticatedRoute>
      </MemoryRouter>
    </Provider>
  );
  expect(wrapper.find('div')).toHaveLength(1);
});
