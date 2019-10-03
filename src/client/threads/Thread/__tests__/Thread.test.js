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
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import TestRenderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import * as COMMENTS from '__fixtures__/commentsFixture';
import * as THREADS from '__fixtures__/threadsFixture';
import * as USER from '__fixtures__/userFixture';
import { constants as authConstants } from 'client/auth';
import { CommentForm } from 'client/comments';
import { Alert } from 'client/core';
import { Input } from 'client/forms';
import mockFetch from 'testUtils/mockFetch';
import { updateWrapper, wait } from 'testUtils/wait';
import Thread from '../Thread';

const NOW = 1572566400000;

const mockStore = configureStore();

const expectRender = async (responses, { loggedIn }) => {
  Date.now = jest.fn().mockReturnValue(NOW);
  mockFetch(responses);

  const state = loggedIn && {
    [authConstants.NAME]: {
      credentials: USER.credentials,
    },
  };
  const store = mockStore(state);

  let renderer;
  await TestRenderer.act(async () => {
    renderer = TestRenderer.create(
      <Provider store={store}>
        <MemoryRouter initialEntries={[THREADS.thread1.path]}>
          <Route path="/threads/:slug">
            <Thread />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await wait();
  });

  return expect(renderer.toJSON()).toMatchSnapshot();
};

const simulateCommentFormSubmit = (wrapper) => {
  const onSubmit = wrapper.find(CommentForm).children().prop('onSubmit');
  return act(async () => {
    await onSubmit({
      preventDefault: () => {},
    });
    await updateWrapper(wrapper);
  });
};

it('renders without crashing', () => {
  return expectRender([
    THREADS.threadFetch1,
    COMMENTS.canCreateCommentFetch,
    COMMENTS.commentsFetch,
  ], { loggedIn: true });
});

// TOOD(#68): Figure out how to manipulate an enzyme wrapper for an element
// loaded asynchronously
it.skip('when submitting comment form scrolls to comment list', async () => {
  mockFetch([
    THREADS.threadFetch1,
    COMMENTS.canCreateCommentFetch,
    COMMENTS.commentsFetch,
  ]);

  const scrollIntoView = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollIntoView;

  const store = mockStore({
    [authConstants.NAME]: {
      data: USER.credentials,
    },
  });

  const wrapper = mount(
    <Provider store={store}>
      <MemoryRouter initialEntries={[THREADS.thread1.path]}>
        <Route path="/threads/:slug">
          <Thread />
        </Route>
      </MemoryRouter>
    </Provider>
  );

  await wait();

  wrapper.find(Input).simulate('change', {
    target: { name: 'text', value: 'Lorem ipsum' },
  });

  await simulateCommentFormSubmit(wrapper);

  expect(scrollIntoView).toHaveBeenCalled();
});

// TOOD(#68): Figure out how to manipulate an enzyme wrapper for an element
// loaded asynchronously
it.skip('when delete fails shows an alert', async () => {
  mockFetch([
    {
      url: THREADS.thread1.deleteUrl,
      method: 'POST',
      status: 500,
    },
  ]);

  const store = mockStore({
    [authConstants.NAME]: {
      data: USER.credentials,
    },
  });

  let wrapper;
  await act(async () => {
    wrapper = mount(
      <Provider store={store}>
        <MemoryRouter initialEntries={[THREADS.thread1.path]}>
          <Route path="/threads/:slug">
            <Thread />
          </Route>
        </MemoryRouter>
      </Provider>
    );

    await wait();
  });

  expect(wrapper.find(Alert)).toHaveLength(0);

  await act(async () => {
    wrapper.find('OverflowToggle').simulate('click');
    wrapper.find('MenuItemButton').first().simulate('click');

    await wait();
  });

  expect(wrapper.find(Alert)).toHaveLength(1);
});
