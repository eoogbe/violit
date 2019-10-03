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
import { actWait, wait } from 'testUtils/wait';
import useLoad from '../useLoad';

const TestComponent = ({ fetch }) => {
  const [loading, error, data] = useLoad(fetch);
  return (
    <div>
      <span className="loading">{`${loading}`}</span>
      <span className="error">{`${error}`}</span>
      <span className="data">{data}</span>
    </div>
  );
};

it('loads the data', async () => {
  const fetch = () => Promise.resolve('foo');

  const wrapper = mount(<TestComponent fetch={fetch} />);
  expect(wrapper.find('.loading').text()).toBe('true');
  expect(wrapper.find('.error').text()).toBe('false');
  expect(wrapper.find('.data').text()).toBe('');

  await actWait();

  expect(wrapper.find('.loading').text()).toBe('false');
  expect(wrapper.find('.error').text()).toBe('false');
  expect(wrapper.find('.data').text()).toBe('foo');
});

it('when load fails sets the error', async () => {
  const fetch = () => Promise.reject();
  const wrapper = mount(<TestComponent fetch={fetch} />);

  await actWait();

  expect(wrapper.find('.loading').text()).toBe('false');
  expect(wrapper.find('.error').text()).toBe('true');
  expect(wrapper.find('.data').text()).toBe('');
});

describe('when cancelled', () => {
  it('does not set data', async () => {
    const setLoading = jest.fn();
    const setError = jest.fn();
    const setData = jest.fn();

    const TestComponent = ({ fetch }) => {
      const [loading, error, data] = useLoad(() => Promise.resolve('foo'));
      setLoading(loading);
      setError(error);
      setData(data);

      return (
        <div>
        <span className="loading">{`${loading}`}</span>
        <span className="error">{`${error}`}</span>
        <span className="data">{data}</span>
        </div>
      );
    };

    const wrapper = mount(<TestComponent />);
    wrapper.unmount();

    await actWait();

    expect(setLoading).toHaveProperty('mock.calls', [[true]]);
    expect(setError).toHaveProperty('mock.calls', [[false]]);
    expect(setData).toHaveProperty('mock.calls', [[null]]);
  });
  it('does not set error', async () => {
    const setLoading = jest.fn();
    const setError = jest.fn();
    const setData = jest.fn();

    const TestComponent = ({ fetch }) => {
      const [loading, error, data] = useLoad(() => Promise.reject());
      setLoading(loading);
      setError(error);
      setData(data);

      return (
        <div>
        <span className="loading">{`${loading}`}</span>
        <span className="error">{`${error}`}</span>
        <span className="data">{data}</span>
        </div>
      );
    };

    const wrapper = mount(<TestComponent />);
    wrapper.unmount();

    await actWait();

    expect(setLoading).toHaveProperty('mock.calls', [[true]]);
    expect(setError).toHaveProperty('mock.calls', [[false]]);
    expect(setData).toHaveProperty('mock.calls', [[null]]);
  });
});
