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
import { MemoryRouter } from 'react-router-dom';
import TestRenderer from 'react-test-renderer';
import * as THREADS from '__fixtures__/threadsFixture';
import { ArticleFooter } from 'client/article';
import { CommentForm } from 'client/comments';
import { Input } from 'client/forms';
import mockFetch from 'testUtils/mockFetch';
import { updateWrapper, wait } from 'testUtils/wait';
import ThreadMain from '../ThreadMain';

const NOW = 1572566400000;

const simulateCommentFormSubmit = (wrapper) => {
  const onSubmit = wrapper.find(CommentForm).children().prop('onSubmit');
  return act(async () => {
    await onSubmit({
      preventDefault: () => {},
    });
    await updateWrapper(wrapper);
  });
};

it('render without crashing', () => {
  Date.now = jest.fn().mockReturnValue(NOW);
  const renderer = TestRenderer.create(
    <MemoryRouter>
      <ThreadMain
        id="thread1"
        slug={THREADS.thread1.slug}
        author={THREADS.thread1.author}
        dateCreated={THREADS.thread1.dateCreated}
        headline={THREADS.thread1.headline}
        articleBody={THREADS.thread1.articleBody}
        createComment={() => {}}
        loggedIn
        canCreateComment
        canDelete
      />
    </MemoryRouter>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});

it('renders without article body', () => {
  Date.now = jest.fn().mockReturnValue(NOW);
  const renderer = TestRenderer.create(
    <MemoryRouter>
      <ThreadMain
        id="thread1"
        slug={THREADS.thread1.slug}
        author={THREADS.thread1.author}
        dateCreated={THREADS.thread1.dateCreated}
        headline={THREADS.thread1.headline}
        createComment={() => {}}
        loggedIn
        canCreateComment
        canDelete
      />
    </MemoryRouter>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});

it('renders when deleted', () => {
  Date.now = jest.fn().mockReturnValue(NOW);
  const renderer = TestRenderer.create(
    <MemoryRouter>
      <ThreadMain
        id="thread1"
        slug={THREADS.thread1.slug}
        author={THREADS.thread1.author}
        dateCreated={THREADS.thread1.dateCreated}
        dateDeleted={THREADS.thread1.dateDeleted}
        headline={THREADS.thread1.headline}
        articleBody={THREADS.thread1.articleBody}
        createComment={() => {}}
      />
    </MemoryRouter>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});

it('renders when cannot create a comment', () => {
  Date.now = jest.fn().mockReturnValue(NOW);
  const renderer = TestRenderer.create(
    <MemoryRouter>
      <ThreadMain
        id="thread1"
        slug={THREADS.thread1.slug}
        author={THREADS.thread1.author}
        dateCreated={THREADS.thread1.dateCreated}
        headline={THREADS.thread1.headline}
        articleBody={THREADS.thread1.articleBody}
        createComment={() => {}}
      />
    </MemoryRouter>
  );
  expect(renderer.toJSON()).toMatchSnapshot();
});

it('sets the document title', () => {
  TestRenderer.act(() => {
    TestRenderer.create(
      <MemoryRouter>
        <ThreadMain
          id="thread1"
          slug={THREADS.thread1.slug}
          author={THREADS.thread1.author}
          dateCreated={THREADS.thread1.dateCreated}
          headline={THREADS.thread1.headline}
          articleBody={THREADS.thread1.articleBody}
          createComment={() => {}}
          loggedIn
          canCreateComment
          canDelete
        />
      </MemoryRouter>
    );
  });
  expect(document.title).toBe(THREADS.thread1.title);
});

it('when submitting comment form creates a comment', async () => {
  const createComment = jest.fn();

  const wrapper = mount(
    <MemoryRouter>
      <ThreadMain
        id="thread1"
        slug={THREADS.thread1.slug}
        author={THREADS.thread1.author}
        dateCreated={THREADS.thread1.dateCreated}
        headline={THREADS.thread1.headline}
        articleBody={THREADS.thread1.articleBody}
        createComment={createComment}
        loggedIn
        canCreateComment
        canDelete
      />
    </MemoryRouter>
  );

  wrapper.find(Input).simulate('change', {
    target: { name: 'text', value: 'Lorem ipsum' },
  });

  await simulateCommentFormSubmit(wrapper);

  expect(createComment).toHaveBeenCalled();
});

describe('when delete menu item clicked', () => {
  it('deletes the thread', async () => {
    mockFetch([
      THREADS.deleteThreadFetch,
    ]);

    const wrapper = mount(
      <MemoryRouter>
        <ThreadMain
          id="thread1"
          slug={THREADS.thread1.slug}
          author={THREADS.thread1.author}
          dateCreated={THREADS.thread1.dateCreated}
          headline={THREADS.thread1.headline}
          articleBody={THREADS.thread1.articleBody}
          createComment={() => {}}
          loggedIn
          canCreateComment
          canDelete
        />
      </MemoryRouter>
    );

    expect(wrapper.find('NoArticleBodyParagraph')).toHaveLength(0);
    expect(wrapper.find(CommentForm)).toHaveLength(1);
    expect(wrapper.find(ArticleFooter)).toHaveLength(1);

    wrapper.find('OverflowToggle').simulate('click');
    wrapper.find('MenuItemButton').first().simulate('click');

    expect(wrapper.find('NoArticleBodyParagraph')).toHaveLength(1);
    expect(wrapper.find(CommentForm)).toHaveLength(0);
    expect(wrapper.find(ArticleFooter)).toHaveLength(0);

    await wait();
  });
  it('when delete fails calls delete error callback', async () => {
    mockFetch([
      {
        url: THREADS.thread1.deleteUrl,
        method: 'POST',
        status: 500,
      },
    ]);

    const onDeleteError = jest.fn();
    const wrapper = mount(
      <MemoryRouter>
        <ThreadMain
          id="thread1"
          slug={THREADS.thread1.slug}
          author={THREADS.thread1.author}
          dateCreated={THREADS.thread1.dateCreated}
          headline={THREADS.thread1.headline}
          articleBody={THREADS.thread1.articleBody}
          createComment={() => {}}
          onDeleteError={onDeleteError}
          loggedIn
          canCreateComment
          canDelete
        />
      </MemoryRouter>
    );

    wrapper.find('OverflowToggle').simulate('click');
    wrapper.find('MenuItemButton').first().simulate('click');

    await wait();

    expect(onDeleteError).toHaveBeenCalled();
  });
  it('without delete error callback does nothing', async () => {
    mockFetch([
      {
        url: THREADS.thread1.deleteUrl,
        method: 'POST',
        status: 500,
      },
    ]);

    const wrapper = mount(
      <MemoryRouter>
        <ThreadMain
          id="thread1"
          slug={THREADS.thread1.slug}
          author={THREADS.thread1.author}
          dateCreated={THREADS.thread1.dateCreated}
          headline={THREADS.thread1.headline}
          articleBody={THREADS.thread1.articleBody}
          createComment={() => {}}
          loggedIn
          canCreateComment
          canDelete
        />
      </MemoryRouter>
    );

    wrapper.find('OverflowToggle').simulate('click');
    wrapper.find('MenuItemButton').first().simulate('click');

    await wait();
  });
});
