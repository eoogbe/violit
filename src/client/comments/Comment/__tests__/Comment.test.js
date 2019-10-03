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
import * as COMMENTS from '__fixtures__/commentsFixture';
import { ArticleFooter } from 'client/article';
import mockFetch from 'testUtils/mockFetch';
import { wait } from 'testUtils/wait';
import Comment from '../Comment';

const NOW = 1572566400000;

it('renders without crashing', () => {
  Date.now = jest.fn().mockReturnValue(NOW);
  const renderer = TestRenderer.create(
    <Comment
      id="comment1"
      author={COMMENTS.comment1.author}
      dateCreated={COMMENTS.comment1.dateCreated}
      text={COMMENTS.comment1.text}
      canDelete
    />
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});

it('renders when deleted', () => {
  Date.now = jest.fn().mockReturnValue(NOW);
  const renderer = TestRenderer.create(
    <Comment
      id="comment1"
      author={COMMENTS.comment2.author}
      dateCreated={COMMENTS.comment2.dateCreated}
      dateDeleted={COMMENTS.comment2.dateDeleted}
    />
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});

describe('when delete menu item clicked', () => {
  it('deletes the comment', async () => {
    mockFetch([
      COMMENTS.deleteCommentFetch,
    ]);

    const wrapper = mount(
      <Comment
        id="comment1"
        author={COMMENTS.comment1.author}
        dateCreated={COMMENTS.comment1.dateCreated}
        text={COMMENTS.comment1.text}
        canDelete
      />
    );

    expect(wrapper.find('NoTextParagraph')).toHaveLength(0);
    expect(wrapper.find(ArticleFooter)).toHaveLength(1);

    wrapper.find('OverflowToggle').simulate('click');
    wrapper.find('MenuItemButton').first().simulate('click');

    expect(wrapper.find('NoTextParagraph')).toHaveLength(1);
    expect(wrapper.find(ArticleFooter)).toHaveLength(0);

    await wait();
  });
  it('when delete fails calls delete error callback', async () => {
    mockFetch([
      {
        url: 'http://localhost:4000/api/comments/comment1/delete',
        method: 'POST',
        status: 500,
      },
    ]);

    const onDeleteError = jest.fn();
    const wrapper = mount(
      <Comment
        id="comment1"
        author={COMMENTS.comment1.author}
        dateCreated={COMMENTS.comment1.dateCreated}
        text={COMMENTS.comment1.text}
        onDeleteError={onDeleteError}
        canDelete
      />
    );

    wrapper.find('OverflowToggle').simulate('click');
    wrapper.find('MenuItemButton').first().simulate('click');

    await wait();

    expect(onDeleteError).toHaveBeenCalled();
  });
  it('without delete error callback does nothing', async () => {
    mockFetch([
      {
        url: 'http://localhost:4000/api/comments/comment1/delete',
        method: 'POST',
        status: 500,
      },
    ]);

    const wrapper = mount(
      <Comment
        id="comment1"
        author={COMMENTS.comment1.author}
        dateCreated={COMMENTS.comment1.dateCreated}
        text={COMMENTS.comment1.text}
        canDelete
      />
    );

    wrapper.find('OverflowToggle').simulate('click');
    wrapper.find('MenuItemButton').first().simulate('click');

    await wait();
  });
});
