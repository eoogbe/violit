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
import TestRenderer from 'react-test-renderer';
import useTitle from '../useTitle';

const TestComponent = ({ title }) => {
  useTitle(title);
  return null;
};

it('sets the document title to the page title', () => {
  TestRenderer.act(() => {
    TestRenderer.create(<TestComponent title="Lorem ipsum" />);
  });
  expect(document.title).toBe('Lorem ipsum | Violit');
});

it('when title too long truncates the title name', () => {
  const title = 'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ';
  TestRenderer.act(() => {
    TestRenderer.create(<TestComponent title={title} />);
  });
  expect(document.title).toBe(
    'ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTU... | Violit'
  );
});

it('without page title uses the site title', () => {
  TestRenderer.act(() => {
    TestRenderer.create(<TestComponent title={null} />);
  });
  expect(document.title).toBe('Violit');
});
