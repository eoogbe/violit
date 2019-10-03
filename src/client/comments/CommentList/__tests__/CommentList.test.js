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

import React, { createRef } from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import TestRenderer from 'react-test-renderer';
import * as COMMENTS from '__fixtures__/commentsFixture';
import * as THREADS from '__fixtures__/threadsFixture';
import mockFetch from 'testUtils/mockFetch';
import { wait } from 'testUtils/wait';
import { Alert } from 'client/core';
import Comment from '../../Comment';
import CommentList from '../CommentList';

const NOW = 1572566400000;

const ADDITIONAL_COMMENTS = [
  {
    id: 'comment1',
    dateCreated: COMMENTS.comment1.dateCreated,
    dateDeleted: null,
    text: COMMENTS.comment1.text,
    threadSlug: COMMENTS.comment1.threadSlug,
    author: COMMENTS.comment1.author,
    canDelete: true,
  },
];

it('renders without crashing', async () => {
  Date.now = jest.fn().mockReturnValue(NOW);
  mockFetch([
    {
      url: THREADS.thread1.commentsUrl,
      method: 'GET',
      status: 200,
      body: {
        items: [COMMENTS.api[1], COMMENTS.api[2]],
      },
    },
  ]);

  let renderer;
  await TestRenderer.act(async () => {
    renderer = TestRenderer.create(
      <CommentList
        threadSlug={THREADS.thread1.slug}
        additionalComments={ADDITIONAL_COMMENTS}
      />
    );

    await wait();
  });

  expect(renderer.toJSON()).toMatchSnapshot();
});

it('renders when loading', () => {
  global.fetch = jest.fn().mockReturnValue(wait(5));

  let renderer;
  TestRenderer.act(() => {
    renderer = TestRenderer.create(
      <CommentList threadSlug={THREADS.thread1.slug} />
    );
  });

  expect(renderer.toJSON()).toMatchSnapshot();
});

it('renders with load error', async () => {
  global.fetch = jest.fn().mockRejectedValue(null);

  let renderer;
  await TestRenderer.act(async () => {
    renderer = TestRenderer.create(
      <CommentList threadSlug={THREADS.thread1.slug} />
    );

    await wait();
  });

  expect(renderer.toJSON()).toMatchSnapshot();
});

it('renders when empty', async () => {
  mockFetch([
    {
      url: THREADS.thread1.commentsUrl,
      method: 'GET',
      status: 200,
      body: {
        items: [],
      },
    },
  ]);

  let renderer;
  await TestRenderer.act(async () => {
    renderer = TestRenderer.create(
      <CommentList threadSlug={THREADS.thread1.slug} />
    );

    await wait();
  });

  expect(renderer.toJSON()).toMatchSnapshot();
});

it('forwards the ref', async () => {
  mockFetch([
    COMMENTS.commentsFetch,
  ]);
  const ref = createRef();

  await act(async () => {
    mount(<CommentList threadSlug={THREADS.thread1.slug} ref={ref} />);

    await wait();
  });

  expect(ref.current).toBeTruthy();
});

// TOOD(#68): Figure out how to manipulate an enzyme wrapper for an element
// loaded asynchronously
it.skip('with delete error shows alert', async () => {
  mockFetch([
    COMMENTS.commentsFetch,
    {
      url: 'http://localhost:4000/api/comments/comment1/delete',
      method: 'POST',
      status: 500,
    },
  ]);

  const wrapper = mount(<CommentList threadSlug={THREADS.thread1.slug} />);

  await wait();

  expect(wrapper.find(Alert)).toHaveLength(0);

  wrapper.find(Comment).first().find('OverflowToggle').simulate('click');
  wrapper
    .find(Comment)
    .first()
    .find('MenuItemButton')
    .first()
    .simulate('click');

  expect(wrapper.find(Alert).text()).toContain('deleting the comment');
});
