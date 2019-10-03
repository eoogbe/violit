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
import { wait } from 'testUtils/wait';
import LoadingContainer from '../LoadingContainer';

const ACTION = 'loading the foo';

it('renders without crashing', async () => {
  const loadData = () => Promise.resolve('foo');
  const render = (data) => <div>{data}</div>;

  let renderer;
  await TestRenderer.act(async () => {
    renderer = TestRenderer.create(
      <LoadingContainer loadData={loadData} action={ACTION} render={render} />
    );

    await wait();
  });

  expect(renderer.toJSON()).toMatchSnapshot();
});

it('renders when loading', async () => {
  const loadData = () => wait(5);
  const render = (data) => <div>{data}</div>;

  let renderer;
  await TestRenderer.act(async () => {
    renderer = TestRenderer.create(
      <LoadingContainer loadData={loadData} action={ACTION} render={render} />
    );
  });

  expect(renderer.toJSON()).toMatchSnapshot();
});

it('renders with error', async () => {
  const loadData = () => Promise.reject();
  const render = (data) => <div>{data}</div>;

  let renderer;
  await TestRenderer.act(async () => {
    renderer = TestRenderer.create(
      <LoadingContainer loadData={loadData} action={ACTION} render={render} />
    );

    await wait();
  });

  expect(renderer.toJSON()).toMatchSnapshot();
});
