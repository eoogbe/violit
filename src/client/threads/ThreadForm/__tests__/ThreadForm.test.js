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
import * as ReactRouterDom from 'react-router-dom';
import TestRenderer from 'react-test-renderer';
import * as THREADS from '__fixtures__/threadsFixture';
import { Alert, Button } from 'client/core';
import { FormError, Input } from 'client/forms';
import mockFetch from 'testUtils/mockFetch';
import { updateWrapper, wait } from 'testUtils/wait';
import ThreadForm from '../ThreadForm';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(() => ({
    replace: () => {},
  })),
}));

const changeHeadline = (wrapper, value) => {
  wrapper.find(Input).first().simulate('change', {
    target: {
      name: 'headline',
      value,
    },
  });
};

const changeArticleBody = (wrapper, value) => {
  wrapper.find(Input).at(1).simulate('change', {
    target: {
      name: 'article-body',
      value,
    },
  });
};

const simulateSubmit = async (wrapper, waitFn = wait) => {
  const onSubmit = wrapper.find(ThreadForm).children().prop('onSubmit');
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

it('renders without crashing', async () => {
  mockFetch([
    THREADS.canCreateThreadFetch,
  ]);

  let renderer;
  await TestRenderer.act(async () => {
    renderer = TestRenderer.create(
      <ReactRouterDom.MemoryRouter>
        <ThreadForm />
      </ReactRouterDom.MemoryRouter>
    );

    await wait();
  });

  expect(renderer.toJSON()).toMatchSnapshot();
});

it('sets the document title', async () => {
  mockFetch([
    THREADS.canCreateThreadFetch,
  ]);

  await TestRenderer.act(async () => {
    TestRenderer.create(
      <ReactRouterDom.MemoryRouter>
        <ThreadForm />
      </ReactRouterDom.MemoryRouter>
    );

    await wait();
  });

  expect(document.title).toContain('New thread');
});

it('when cannot create thread redirects to the login screen', async () => {
  mockFetch([
    THREADS.cannotCreateThreadFetch,
  ]);

  let location;
  await TestRenderer.act(async () => {
    TestRenderer.create(
      <ReactRouterDom.MemoryRouter>
        <ThreadForm />
        <ReactRouterDom.Route
          path="*"
          render={(props) => {
            location = props.location;
            return null;
          }}
        />
      </ReactRouterDom.MemoryRouter>
    );

    await wait();
  });

  expect(location).toHaveProperty('pathname', '/login');
});

it('when submitting redirects to the new thread location', async () => {
  const historyReplace = jest.fn();
  ReactRouterDom.useHistory.mockReturnValue({
    replace: historyReplace,
  });

  mockFetch([
    THREADS.canCreateThreadFetch,
    THREADS.createThreadFetch,
  ]);

  const wrapper = mount(
    <ReactRouterDom.MemoryRouter>
      <ThreadForm />
    </ReactRouterDom.MemoryRouter>
  );
  expect(wrapper.find(Button).prop('disabled')).toBe(true);

  changeHeadline(wrapper, THREADS.thread1.headline);
  expect(wrapper.find(Button).prop('disabled')).toBe(false);

  changeArticleBody(wrapper, THREADS.thread1.articleBody);

  await simulateSubmit(wrapper, () => updateWrapper(wrapper));

  expect(historyReplace).toHaveBeenCalledWith(THREADS.thread1.path);
});

it('with submit error sets form error', async () => {
  mockFetch([
    THREADS.canCreateThreadFetch,
    {
      url: 'http://localhost:4000/api/threads',
      method: 'POST',
      status: 422,
      body: {
        error: {
          message: 'Headline is required.',
        },
      },
    },
  ]);

  const wrapper = mount(
    <ReactRouterDom.MemoryRouter>
      <ThreadForm />
    </ReactRouterDom.MemoryRouter>
  );
  expect(wrapper.find(FormError).first()).toHaveLength(0);

  changeHeadline(wrapper, THREADS.thread1.headline);

  await simulateSubmit(wrapper, () => updateWrapper(wrapper));

  expect(wrapper.find(FormError).first().text()).toBe('Headline is required.');
  expect(wrapper.find(Button).prop('disabled')).toBe(true);
});

it('with unknown error renders the alert', async () => {
  mockFetch([
    THREADS.canCreateThreadFetch,
    {
      url: 'http://localhost:4000/api/threads',
      method: 'POST',
      status: 500,
    },
  ]);

  const wrapper = mount(
    <ReactRouterDom.MemoryRouter>
      <ThreadForm />
    </ReactRouterDom.MemoryRouter>
  );
  expect(wrapper.find(Alert)).toHaveLength(0);

  changeHeadline(wrapper, THREADS.thread1.headline);

  await simulateSubmit(wrapper, () => updateWrapper(wrapper));

  expect(wrapper.find(Alert)).toHaveLength(1);
});

it('with blank headline sets field error', async () => {
  mockFetch([
    THREADS.canCreateThreadFetch,
  ]);

  const wrapper = mount(
    <ReactRouterDom.MemoryRouter>
      <ThreadForm />
    </ReactRouterDom.MemoryRouter>
  );

  let errorWrapper = getFieldErrorWrapper(wrapper, 0);
  expect(errorWrapper).toHaveLength(0);

  changeHeadline(wrapper, '  ');

  await updateWrapper(wrapper);

  errorWrapper = getFieldErrorWrapper(wrapper, 0);
  expect(errorWrapper.text()).toBe('Must not be blank.');

  expect(wrapper.find(Button).prop('disabled')).toBe(true);
});
