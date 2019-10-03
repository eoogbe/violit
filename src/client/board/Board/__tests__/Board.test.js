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
import { MemoryRouter } from 'react-router-dom';
import TestRenderer from 'react-test-renderer';
import * as BOARD from '__fixtures__/boardFixture';
import * as THREADS from '__fixtures__/threadsFixture';
import mockFetch from 'testUtils/mockFetch';
import { wait } from 'testUtils/wait';
import Board from '../Board';

const NOW = 1572566400000;

const expectRender = async (responses) => {
  Date.now = jest.fn().mockReturnValue(NOW);
  mockFetch(responses);

  let renderer;
  await TestRenderer.act(async () => {
    renderer = TestRenderer.create(
      <MemoryRouter>
        <Board />
      </MemoryRouter>
    );

    await wait();
  });

  return expect(renderer.toJSON()).toMatchSnapshot();
};

it('renders without crashing', async () => {
  return expectRender([
    BOARD.boardFetch,
    THREADS.threadsFetch,
  ]);
});

it('sets the document title', async () => {
  mockFetch([
    BOARD.boardFetch,
    THREADS.threadsFetch,
  ]);

  await TestRenderer.act(async () => {
    TestRenderer.create(
      <MemoryRouter>
        <Board />
      </MemoryRouter>
    );
  });

  expect(document.title).toBe('Violit');
});
