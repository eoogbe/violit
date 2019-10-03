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
  checkCanCreateComment,
  loadComments,
  sendCreateComment,
  sendDeleteComment,
} from '../api';

describe('loadComments', () => {
  it('loads comments from the server', () => {
    mockFetch([
      COMMENTS.commentsFetch,
    ]);
    const comments = loadComments(THREADS.thread1.slug);
    return expect(comments).resolves.toEqual([
      {
        id: 'comment1',
        dateCreated: COMMENTS.comment1.dateCreated,
        dateDeleted: null,
        text: COMMENTS.comment1.text,
        threadSlug: COMMENTS.comment1.threadSlug,
        author: COMMENTS.comment1.author,
        canDelete: true,
      },
      {
        id: 'comment2',
        dateCreated: COMMENTS.comment2.dateCreated,
        dateDeleted: COMMENTS.comment2.dateDeleted,
        text: COMMENTS.comment2.text,
        threadSlug: COMMENTS.comment2.threadSlug,
        author: COMMENTS.comment2.author,
        canDelete: false,
      },
      {
        id: 'comment3',
        dateCreated: COMMENTS.comment3.dateCreated,
        dateDeleted: null,
        text: COMMENTS.comment3.text,
        threadSlug: COMMENTS.comment3.threadSlug,
        author: COMMENTS.comment3.author,
        canDelete: true,
      },
    ]);
  });
});

describe('sendCreateComment', () => {
  it('creates a comment on the server', () => {
    mockFetch([
      COMMENTS.createCommentFetch,
    ]);
    const comment = sendCreateComment(COMMENTS.createInput);
    return expect(comment).resolves.toEqual({
      id: 'comment1',
      dateCreated: COMMENTS.comment1.dateCreated,
      dateDeleted: null,
      text: COMMENTS.comment1.text,
      threadSlug: COMMENTS.comment1.threadSlug,
      author: COMMENTS.comment1.author,
      canDelete: true,
    });
  });
});

describe('checkCanCreateComment', () => {
  it('when POST method not allowed returns false', () => {
    mockFetch([
      COMMENTS.cannotCreateCommentFetch,
    ]);
    const canCreateComment = checkCanCreateComment(THREADS.thread1.slug);
    return expect(canCreateComment).resolves.toBe(false);
  });
  it('when POST method allowed returns true', () => {
    mockFetch([
      COMMENTS.canCreateCommentFetch,
    ]);
    const canCreateComment = checkCanCreateComment(THREADS.thread1.slug);
    return expect(canCreateComment).resolves.toBe(true);
  });
});

describe('sendDeleteComment', () => {
  it('deletes a comment on the server', () => {
    mockFetch([
      COMMENTS.deleteCommentFetch,
    ]);
    const result = sendDeleteComment('comment1');
    return expect(result).resolves.toBeNull();
  });
});
