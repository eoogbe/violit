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

import * as COMMENTS from '__fixtures__/commentsFixture';
import * as THREADS from '__fixtures__/threadsFixture';
import mockFetch from 'testUtils/mockFetch';
import {
  checkCanCreateThread,
  loadThread,
  loadThreads,
  sendCreateThread,
  sendDeleteThread,
} from '../api';

describe('loadThreads', () => {
  it('loads the threads from the server', () => {
    mockFetch([
      THREADS.threadsFetch,
    ]);
    const threads = loadThreads();
    return expect(threads).resolves.toEqual([
      {
        id: 'thread1',
        slug: THREADS.thread1.slug,
        dateCreated: THREADS.thread1.dateCreated,
        dateDeleted: null,
        headline: THREADS.thread1.headline,
        articleBody: THREADS.thread1.articleBody,
        author: THREADS.thread1.author,
        canDelete: true,
      },
      {
        id: 'thread3',
        slug: THREADS.thread3.slug,
        dateCreated: THREADS.thread3.dateCreated,
        dateDeleted: null,
        headline: THREADS.thread3.headline,
        articleBody: THREADS.thread3.articleBody,
        author: THREADS.thread3.author,
        canDelete: true,
      },
    ]);
  });
});

describe('loadThread', () => {
  it('loads the thread from the server', () => {
    mockFetch([
      THREADS.threadFetch1,
      COMMENTS.canCreateCommentFetch,
    ]);
    const thread = loadThread(THREADS.thread1.slug);
    return expect(thread).resolves.toEqual({
      id: 'thread1',
      slug: THREADS.thread1.slug,
      dateCreated: THREADS.thread1.dateCreated,
      dateDeleted: null,
      headline: THREADS.thread1.headline,
      articleBody: THREADS.thread1.articleBody,
      author: THREADS.thread1.author,
      canCreateComment: true,
      canDelete: true,
    });
  });
});

describe('sendCreateThread', () => {
  it('creates a thread on the server', () => {
    mockFetch([
      THREADS.createThreadFetch,
    ]);
    const thread = sendCreateThread(THREADS.createInput);
    return expect(thread).resolves.toEqual({
      id: 'thread1',
      slug: THREADS.thread1.slug,
      dateCreated: THREADS.thread1.dateCreated,
      dateDeleted: null,
      headline: THREADS.thread1.headline,
      articleBody: THREADS.thread1.articleBody,
      author: THREADS.thread1.author,
      canDelete: true,
    });
  });
  describe('with error', () => {
    it('without error message throws', () => {
      mockFetch([
        {
          url: 'http://localhost:4000/api/threads',
          method: 'POST',
          status: 500,
        },
      ]);
      const error = sendCreateThread(THREADS.createInput);
      return expect(error).rejects.toBeInstanceOf(Error);
    });
    it('with error message returns error result', () => {
      mockFetch([
        {
          url: 'http://localhost:4000/api/threads',
          method: 'POST',
          status: 422,
          body: {
            error: {
              message: 'Headline is required.',
            },
          },
        },
      ]);
      const result = sendCreateThread(THREADS.createInput);
      return expect(result).resolves.toEqual({
        error: 'Headline is required.',
      });
    });
  });
});

describe('checkCanCreateThread', () => {
  it('when POST method not allowed returns false', () => {
    mockFetch([
      THREADS.cannotCreateThreadFetch,
    ]);
    const canCreateThread = checkCanCreateThread();
    return expect(canCreateThread).resolves.toBe(false);
  });
  it('when POST method allow returns true', () => {
    mockFetch([
      THREADS.canCreateThreadFetch,
    ]);
    const canCreateThread = checkCanCreateThread();
    return expect(canCreateThread).resolves.toBe(true);
  });
});

describe('sendDeleteThread', () => {
  it('deletes a thread on the server', () => {
    mockFetch([
      THREADS.deleteThreadFetch,
    ]);
    const result = sendDeleteThread(THREADS.thread1.slug);
    return expect(result).resolves.toBeNull();
  });
});
