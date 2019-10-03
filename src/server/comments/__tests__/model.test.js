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

import { NotFound, UnprocessableEntity } from 'http-errors';
import * as COMMENTS from '__fixtures__/commentsFixture';
import * as THREADS from '__fixtures__/threadsFixture';
import * as USER from '__fixtures__/userFixture';
import initDb from 'testUtils/initializeDatabase';
import { ISO_DATE_PATTERN } from 'testUtils/regexPatterns';
import createModel from '../model';

let db;

beforeEach(() => {
  db = initDb();
});

afterEach(() => {
  db.close();
});

describe('getCommentsByThreadSlug', () => {
  it('finds comments by the slug of their parent thread', () => {
    const { getCommentsByThreadSlug } = createModel({ db });
    const comments = getCommentsByThreadSlug(THREADS.thread1.slug);
    expect(comments).toEqual(COMMENTS.unnormalized);
  });
});

describe('getCommentById', () => {
  it('finds a comment by its id', () => {
    const { getCommentById } = createModel({ db });
    const comment = getCommentById('comment1');
    expect(comment).toEqual(COMMENTS.normalized.comment1);
  });
  it('when comment not found rejects the promise', () => {
    const { getCommentById } = createModel({ db });
    expect(() => getCommentById('7')).toThrow(new NotFound());
  });
});

describe('createComment', () => {
  it('creates a comment', () => {
    const { createComment } = createModel({ db });
    const input = {
      id: 'comment4',
      text: 'Lorem ipsum ',
      threadSlug: THREADS.thread1.slug,
    };

    const comment = createComment(input, USER.credentials);

    expect(comment).toMatchObject({
      id: 'comment4',
      dateCreated: expect.stringMatching(ISO_DATE_PATTERN),
      text: 'Lorem ipsum',
      threadSlug: THREADS.thread1.slug,
      author: USER.username,
    });
  });
  it('with empty id rejects the promise', () => {
    const { createComment } = createModel({ db });
    const input = {
      id: '',
      text: 'Lorem ipsum',
      threadSlug: THREADS.thread1.slug,
    };

    expect(() => createComment(input, USER.credentials)).toThrow(
      new UnprocessableEntity('Id is required.')
    );
  });
  it('with blank text rejects the promise', () => {
    const { createComment } = createModel({ db });
    const input  = {
      id: 'comment4',
      text: '  ',
      threadSlug: THREADS.thread1.slug,
    };

    expect(() => createComment(input, USER.credentials)).toThrow(
      new UnprocessableEntity('Text is required.')
    );
  });
  it('with empty thread slug', () => {
    const { createComment } = createModel({ db });
    const input = {
      id: 'comment4',
      text: 'Lorem ipsum ',
      threadSlug: '',
    };

    expect(() => createComment(input, USER.credentials)).toThrow(
      new UnprocessableEntity('Thread slug is required.')
    );
  });
});

describe('softDeleteComment', () => {
  it('sets the comment date deleted', () => {
    const { softDeleteComment } = createModel({ db });
    const comment = softDeleteComment('comment1');
    expect(comment.dateDeleted).toBeTruthy();
  });
});

describe('canDeleteComment', () => {
  it('without credentials returns false', () => {
    const { canDeleteComment } = createModel({ db });
    const result = canDeleteComment(COMMENTS.normalized.comment1, null);
    expect(result).toBe(false);
  });
  it('when comment deleted returns false', () => {
    const { canDeleteComment } = createModel({ db });
    const result = canDeleteComment(
      COMMENTS.normalized.comment2,
      USER.credentials
    );
    expect(result).toBe(false);
  });
  it('with different comment author', () => {
    const { canDeleteComment } = createModel({ db });
    const comment = {
      ...COMMENTS.normalized.comment1,
      author: 'ginger-rogers',
    };

    const result = canDeleteComment(comment, USER.credentials);

    expect(result).toBe(false);
  });
  it('when can delete comment returns true', () => {
    const { canDeleteComment } = createModel({ db });
    const result = canDeleteComment(
      COMMENTS.normalized.comment1,
      USER.credentials
    );
    expect(result).toBe(true);
  });
});
