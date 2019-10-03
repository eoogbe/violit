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
import ArticleHeader from '../ArticleHeader';

const NOW = 1572566400000;

const AUTHOR = 'fred-astaire';

const DATE_CREATED = '2019-09-29T01:23:45.679Z';

it('renders without crashing', () => {
  Date.now = jest.fn().mockReturnValue(NOW);
  const renderer = TestRenderer.create(
    <ArticleHeader author={AUTHOR} dateCreated={DATE_CREATED} />
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});
