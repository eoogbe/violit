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
import TestRenderer from 'react-test-renderer';
import Alert from '../Alert';

it('renders without crashing', () => {
  const renderer = TestRenderer.create(<Alert />);
  expect(renderer.toJSON()).toMatchSnapshot();
});

it('renders with an action', () => {
  const renderer = TestRenderer.create(<Alert action="creating the foo" />);
  expect(renderer.toJSON()).toMatchSnapshot();
});

it('when close button clicked is hidden', () => {
  const wrapper = mount(<Alert />);
  wrapper.find('CloseButton').simulate('click');
  expect(wrapper.children()).toHaveLength(0);
});

it('when reload button clicked reloads the page', () => {
  const reload = jest.fn();
  global.location.reload = reload;
  const wrapper = mount(<Alert />);

  wrapper.find('ReloadButton').simulate('click');

  expect(reload).toHaveBeenCalled();
});
