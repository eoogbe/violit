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
import { actWait, updateWrapper } from 'testUtils/wait';
import useOptimisticPrepend from '../useOptimisticPrepend';

const UUID_REGEX = /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/;

const TestComponent = ({ optimisticCreate, sendCreate, options, inputs }) => {
  const [
    items,
    error,
    onCreate,
  ] = useOptimisticPrepend(optimisticCreate, sendCreate, options);
  const handleClick = () => {
    if (!inputs.length) {
      throw new Error('out of inputs');
    }

    onCreate({ text: inputs.pop() });
  };

  return (
    <div>
      {items.map(({ id, ...item }, idx) => (
        <div key={idx} className="item">{JSON.stringify(item)}</div>
      ))}
      <span className="error">{`${error}`}</span>
      <button className="create-button" type="button" onClick={handleClick}>
        Prepend item
      </button>
    </div>
  );
};

it('optimistically prepends an item to a list', async () => {
  const optimisticCreate = (id, input) => ({
    ...input,
    id,
  });
  const sendCreate = (input) => Promise.resolve({
    ...input,
    created: true,
  });

  const wrapper = mount(
    <TestComponent
      optimisticCreate={optimisticCreate}
      sendCreate={sendCreate}
      inputs={['foo', 'bar']}
    />
  );
  expect(wrapper.find('.item')).toHaveLength(0);
  expect(wrapper.find('.error').text()).toBe('false');

  wrapper.find('.create-button').simulate('click');

  expect(wrapper.find('.item')).toHaveLength(1);
  expect(wrapper.find('.item').at(0).text()).toBe(
    JSON.stringify({ text: 'bar' })
  );
  expect(wrapper.find('.error').text()).toBe('false');

  await actWait();

  expect(wrapper.find('.item')).toHaveLength(1);
  expect(wrapper.find('.item').at(0).text()).toBe(
    JSON.stringify({ text: 'bar', created: true })
  );
  expect(wrapper.find('.error').text()).toBe('false');

  wrapper.find('.create-button').simulate('click');

  expect(wrapper.find('.item')).toHaveLength(2);
  expect(wrapper.find('.item').at(0).text()).toBe(
    JSON.stringify({ text: 'foo' })
  );
  expect(wrapper.find('.item').at(1).text()).toBe(
    JSON.stringify({ text: 'bar', created: true })
  );
  expect(wrapper.find('.error').text()).toBe('false');

  await actWait();

  expect(wrapper.find('.item')).toHaveLength(2);
  expect(wrapper.find('.item').at(0).text()).toBe(
    JSON.stringify({ text: 'foo', created: true })
  );
  expect(wrapper.find('.item').at(1).text()).toBe(
    JSON.stringify({ text: 'bar', created: true })
  );
  expect(wrapper.find('.error').text()).toBe('false');
});

it('calls onPrepend', async () => {
  const optimisticCreate = (id, input) => ({
    ...input,
    id,
  });
  const sendCreate = (input) => Promise.resolve({
    ...input,
    created: true,
  });
  const onPrepend = jest.fn();
  const wrapper = mount(
    <TestComponent
      optimisticCreate={optimisticCreate}
      sendCreate={sendCreate}
      options={{ onPrepend }}
      inputs={['foo', 'bar']}
    />
  );

  wrapper.find('.create-button').simulate('click');

  expect(onPrepend.mock.calls[0][0]).toMatchObject({
    id: expect.stringMatching(UUID_REGEX),
    text: 'bar',
  });

  await actWait();
});

it('ignores duplicate send create calls', async () => {
  const optimisticCreate = (id, input) => ({
    ...input,
    id,
  });
  const sendCreate = (input) => Promise.resolve({
    ...input,
    created: true,
  });

  const wrapper = mount(
    <TestComponent
      optimisticCreate={optimisticCreate}
      sendCreate={sendCreate}
      inputs={['foo', 'bar']}
    />
  );

  wrapper.find('.create-button').simulate('click');
  wrapper.find('.create-button').simulate('click');

  expect(wrapper.find('.item')).toHaveLength(1);
  expect(wrapper.find('.item').at(0).text()).toBe(
    JSON.stringify({ text: 'bar' })
  );
  expect(wrapper.find('.error').text()).toBe('false');

  await actWait();

  expect(wrapper.find('.item')).toHaveLength(1);
  expect(wrapper.find('.item').at(0).text()).toBe(
    JSON.stringify({ text: 'bar', created: true })
  );
  expect(wrapper.find('.error').text()).toBe('false');
});

it('when create fails reverts the prepend', async () => {
  const optimisticCreate = (id, input) => ({
    ...input,
    id,
  });
  const sendCreate = () => Promise.reject();

  const wrapper = mount(
    <TestComponent
      optimisticCreate={optimisticCreate}
      sendCreate={sendCreate}
      inputs={['foo', 'bar']}
    />
  );

  wrapper.find('.create-button').simulate('click');

  expect(wrapper.find('.item')).toHaveLength(1);
  expect(wrapper.find('.item').at(0).text()).toBe(
    JSON.stringify({ text: 'bar' })
  );
  expect(wrapper.find('.error').text()).toBe('false');

  await updateWrapper(wrapper);

  expect(wrapper.find('.item')).toHaveLength(0);
  expect(wrapper.find('.error').text()).toBe('true');
});
