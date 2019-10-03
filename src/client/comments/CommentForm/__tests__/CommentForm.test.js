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
import TestRenderer from 'react-test-renderer';
import { Button } from 'client/core';
import { Input } from 'client/forms';
import { updateWrapper } from 'testUtils/wait';
import CommentForm from '../CommentForm';

const changeText = (wrapper, value) => {
  wrapper.find(Input).simulate('change', {
    target: { name: 'text', value },
  });
};

const simulateSubmit = (wrapper) => {
  const onSubmit = wrapper.find(CommentForm).children().prop('onSubmit');
  return act(async () => {
    await onSubmit({
      preventDefault: () => {},
    });
    await updateWrapper(wrapper);
  });
};

it('renders without crashing', () => {
  const renderer = TestRenderer.create(<CommentForm createComment={() => {}} />);
  expect(renderer.toJSON()).toMatchSnapshot();
});

it('when submitting triggers comment creation', async () => {
  const createComment = jest.fn();

  const wrapper = mount(<CommentForm createComment={createComment} />);
  expect(wrapper.find(Button).prop('disabled')).toBe(true);

  changeText(wrapper, 'Lorem ipsum  ');

  await simulateSubmit(wrapper);

  expect(createComment).toHaveBeenCalled();
  expect(wrapper.find(Input).prop('value')).toBe('');
  expect(wrapper.find(Button).prop('disabled')).toBe(true);
});

it('with blank comment disables the submit button', async () => {
  const wrapper = mount(<CommentForm createComment={() => {}} />);

  changeText(wrapper, '  ');

  await updateWrapper(wrapper);

  expect(wrapper.find(Button).prop('disabled')).toBe(true);
});
