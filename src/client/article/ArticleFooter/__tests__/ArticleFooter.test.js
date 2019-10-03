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
import TestRenderer from 'react-test-renderer';
import ArticleFooter from '../ArticleFooter';

it('renders without crashing', () => {
  const renderer = TestRenderer.create(
    <ArticleFooter contentId="article1" deleteContent={() => {}} />
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});

it('renders the open menu', () => {
  const renderer = TestRenderer.create(
    <ArticleFooter contentId="article1" deleteContent={() => {}} />
  );
  const instance = renderer.root;

  const toggle = instance.find(
    R.pathEq(['type', 'displayName'],
    'OverflowToggle')
  );
  TestRenderer.act(() => {
    toggle.props.onClick();
  });
  expect(renderer.toJSON()).toMatchSnapshot();
});

it('deletes the content', () => {
  const deleteContent = jest.fn();
  const wrapper = mount(
    <ArticleFooter contentId="article1" deleteContent={deleteContent} />
  );

  wrapper.find('OverflowToggle').simulate('click');
  wrapper.find('MenuItemButton').first().simulate('click');

  expect(deleteContent).toHaveBeenCalled();
});
