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
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import TestRenderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import * as BOARD from '__fixtures__/boardFixture';
import * as COMMENTS from '__fixtures__/commentsFixture';
import * as THREADS from '__fixtures__/threadsFixture';
import * as USER from '__fixtures__/userFixture';
import { constants as authConstants } from 'client/auth';
import mockFetch from 'testUtils/mockFetch';
import { wait } from 'testUtils/wait';
import App from '../App';

const mockStore = configureStore();

const createMocks = (initialState) => {
  Date.now = jest.fn().mockReturnValue(1572566400000);
  mockFetch([
    BOARD.boardFetch,
    THREADS.threadsFetch,
    THREADS.threadFetch1,
    THREADS.canCreateThreadFetch,
    COMMENTS.canCreateCommentFetch,
    COMMENTS.commentsFetch,
  ]);
  return mockStore(initialState);
};

const expectState = async (initialState, initialEntries) => {
  const store = createMocks(initialState);

  let renderer;
  await TestRenderer.act(async () => {
    renderer = TestRenderer.create(
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    await wait();
  });

  return expect(renderer.toJSON()).toMatchSnapshot();
};

it('renders without crashing', () => {
  return expectState({
    [authConstants.NAME]: {
      credentials: USER.credentials,
    },
  });
});

it('renders when logged out', () => {
  return expectState({});
});
