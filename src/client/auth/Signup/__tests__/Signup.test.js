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
import * as ReactRouterDom from 'react-router-dom';
import TestRenderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import * as USER from '__fixtures__/userFixture';
import { Button } from 'client/core';
import { FormError, Input } from 'client/forms';
import mockFetch from 'testUtils/mockFetch';
import { updateWrapper, wait } from 'testUtils/wait';
import actions from '../../actions';
import { NAME } from '../../constants';
import Signup from '../Signup';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(() => ({
    replace: () => {},
  })),
}));

const mockStore = configureStore();

const expectState = (initialState = {}) => {
  const store = mockStore({
    [NAME]: initialState,
  });

  let renderer;
  TestRenderer.act(() => {
    renderer = TestRenderer.create(
      <Provider store={store}>
        <ReactRouterDom.MemoryRouter initialEntries={['/signup']}>
          <Signup createAsyncFunction={() => {}} />
        </ReactRouterDom.MemoryRouter>
      </Provider>
    );
  });

  expect(renderer.toJSON()).toMatchSnapshot();
};

const mountSignup = (options) => {
  const { asyncFunction, initialEntries } = options || {};
  const store = mockStore();
  const createAsyncFunction = () => ({ asyncFunction });
  const wrapper = mount(
    <Provider store={store}>
      <ReactRouterDom.MemoryRouter initialEntries={initialEntries}>
        <Signup createAsyncFunction={createAsyncFunction} />
      </ReactRouterDom.MemoryRouter>
    </Provider>
  );
  return { store, wrapper };
};

const changeUsername = (wrapper, value) => {
  wrapper.find(Input).first().simulate('change', {
    target: {
      name: 'username',
      value,
    },
  });
};

const blurUsername = (wrapper, value) => {
  wrapper.find(Input).first().simulate('blur', {
    target: {
      name: 'username',
      value,
    },
  });
};

const changePassword = (wrapper, value) => {
  wrapper.find(Input).at(1).simulate('change', {
    target: {
      name: 'password',
      value,
    },
  });
};

const blurPassword = (wrapper, value) => {
  wrapper.find(Input).at(1).simulate('blur', {
    target: {
      name: 'password',
      value,
    },
  });
};

const changePasswordConfirmation = (wrapper, value) => {
  wrapper.find(Input).at(2).simulate('change', {
    target: {
      name: 'password-confirmation',
      value,
    },
  });
};

const blurPasswordConfirmation = (wrapper, value) => {
  wrapper.find(Input).at(2).simulate('blur', {
    target: {
      name: 'password-confirmation',
      value,
    },
  });
};

const simulateSubmit = async (wrapper, waitFn = wait) => {
  const onSubmit = wrapper.find(Signup).children().prop('onSubmit');
  return act(async () => {
    await onSubmit({
      preventDefault: () => {},
    });
    await waitFn();
  });
};

const getFieldErrorWrapper = (wrapper, index) =>
  wrapper
    .find('FieldList')
    .children()
    .children()
    .children()
    .at(index)
    .find(FormError);

it('renders without crashing', () => {
  expectState();
});

it('sets the document title', () => {
  const store = mockStore();
  TestRenderer.act(() => {
    TestRenderer.create(
      <Provider store={store}>
        <ReactRouterDom.MemoryRouter initialEntries={['/signup']}>
          <Signup createAsyncFunction={() => {}} />
        </ReactRouterDom.MemoryRouter>
      </Provider>
    );
  });
  expect(document.title).toContain('Signup');
});

describe('when submitting', () => {
  it('runs async function', async () => {
    mockFetch([
      USER.doesNotHaveUserFetch,
    ]);

    const asyncFunction = jest.fn();

    const { wrapper } = mountSignup({ asyncFunction });
    expect(wrapper.find(Button).prop('disabled')).toBe(true);

    changeUsername(wrapper, USER.username);
    blurUsername(wrapper, USER.username);

    changePassword(wrapper, USER.password);
    blurPassword(wrapper, USER.password);

    changePasswordConfirmation(wrapper, USER.password);
    blurPasswordConfirmation(wrapper, USER.password);

    await simulateSubmit(wrapper);

    expect(asyncFunction).toHaveBeenCalledWith({
      user: {
        username: USER.username,
        password: USER.password,
      },
    });
  });
  it('when previous location saved redirects to the previous location', async () => {
    mockFetch([
      USER.doesNotHaveUserFetch,
    ]);

    const historyReplace = jest.fn();
    ReactRouterDom.useHistory.mockReturnValue({
      replace: historyReplace,
    });

    const { wrapper } = mountSignup({
      asyncFunction: () => Promise.resolve(),
      initialEntries: [
        {
          pathname: '/signup',
          state: {
            from: '/prev',
          },
        },
      ],
    });

    changeUsername(wrapper, USER.username);
    blurUsername(wrapper, USER.username);

    changePassword(wrapper, USER.password);
    blurPassword(wrapper, USER.password);

    changePasswordConfirmation(wrapper, USER.password);
    blurPasswordConfirmation(wrapper, USER.password);

    await simulateSubmit(wrapper);

    expect(historyReplace).toHaveBeenCalledWith('/prev');
  });
  it('when previous location not saved redirects to homepage', async () => {
    mockFetch([
      USER.doesNotHaveUserFetch,
    ]);

    const historyReplace = jest.fn();
    ReactRouterDom.useHistory.mockReturnValue({
      replace: historyReplace,
    });

    const { wrapper } = mountSignup({
      asyncFunction: () => Promise.resolve(),
      initialEntries: ['/signup'],
    });

    changeUsername(wrapper, USER.username);
    blurUsername(wrapper, USER.username);

    changePassword(wrapper, USER.password);
    blurPassword(wrapper, USER.password);

    changePasswordConfirmation(wrapper, USER.password);
    blurPasswordConfirmation(wrapper, USER.password);

    await simulateSubmit(wrapper);

    expect(historyReplace).toHaveBeenCalledWith('/');
  });
  it('with submit error sets form error', async () => {
    mockFetch([
      USER.doesNotHaveUserFetch,
    ]);

    const error = 'invalid';
    const { wrapper } = mountSignup({
      asyncFunction: () => Promise.reject({ error }),
    });

    expect(wrapper.find(FormError).first()).toHaveLength(0);

    changeUsername(wrapper, USER.username);
    blurUsername(wrapper, USER.username);

    changePassword(wrapper, USER.password);
    blurPassword(wrapper, USER.password);

    changePasswordConfirmation(wrapper, USER.password);
    blurPasswordConfirmation(wrapper, USER.password);

    await simulateSubmit(wrapper, () => updateWrapper(wrapper));

    expect(wrapper.find(FormError).first().text()).toBe(error);
    expect(wrapper.find(Button).prop('disabled')).toBe(true);
  });
});

it('with invalid username sets username error', async () => {
  const { wrapper } = mountSignup();

  let errorWrapper = getFieldErrorWrapper(wrapper, 0);
  expect(errorWrapper).toHaveLength(0);

  changeUsername(wrapper, '');
  blurUsername(wrapper, '');

  await updateWrapper(wrapper);

  errorWrapper = getFieldErrorWrapper(wrapper, 0);
  expect(errorWrapper.text()).toBe('Required.');

  expect(wrapper.find(Button).prop('disabled')).toBe(true);
});

it('with invalid password sets password error', async () => {
  const { wrapper } = mountSignup();

  let errorWrapper = getFieldErrorWrapper(wrapper, 1);
  expect(errorWrapper).toHaveLength(0);

  changePassword(wrapper, '');
  blurPassword(wrapper, '');

  await updateWrapper(wrapper);

  errorWrapper = getFieldErrorWrapper(wrapper, 1);
  expect(errorWrapper.text()).toBe('Required.');

  expect(wrapper.find(Button).prop('disabled')).toBe(true);
});

it('with invalid password confirmation sets password confirmation error', async () => {
  const { wrapper } = mountSignup();

  let errorWrapper = getFieldErrorWrapper(wrapper, 2);
  expect(errorWrapper).toHaveLength(0);

  changePasswordConfirmation(wrapper, '');
  blurPasswordConfirmation(wrapper, '');

  await updateWrapper(wrapper);

  errorWrapper = getFieldErrorWrapper(wrapper, 2);
  expect(errorWrapper.text()).toBe('Required.');

  expect(wrapper.find(Button).prop('disabled')).toBe(true);
});
