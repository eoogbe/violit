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
import uuid from 'uuid/v4';
import * as THREADS from '__fixtures__/threadsFixture';
import * as USER from '__fixtures__/userFixture';
import initDb from 'testUtils/initializeDatabase';
import { ISO_DATE_PATTERN } from 'testUtils/regexPatterns';
import createModel from '../model';

const UUID1 = '01234567-89ab-cdef-0123-456789abcdef';
const UUID2 = '01234567-0123-4567-89ab-cdef01234567';
const UUID3 = '01234567-7654-3210-fedc-a9876543210f';

const INPUT_HEADLINE = 'Dolor sit amet, consectetur  ';
const EXPECTED_HEADLINE = 'Dolor sit amet, consectetur';

const EXPECTED_SLUG1 = 'Dolor-sit-amet-consectetur';
const EXPECTED_SLUG2 = 'Dolor-sit-amet-co-01234567';
const EXPECTED_SLUG3 = 'Dolor-sit-01234567-7654-3210-fedc-a9876543210f';

const INPUT_SHORT_HEADLINE = 'Dolor';

const EXPECTED_SHORT_SLUG1 = 'Dolor';
const EXPECTED_SHORT_SLUG2 = 'Dolor-01234567';
const EXPECTED_SHORT_SLUG3 = 'Dolor-01234567-7654-3210-fedc-a9876543210f';

jest.mock('uuid/v4');

let db;

beforeEach(() => {
  db = initDb();
});

afterEach(() => {
  db.close();
});

describe('getThreads', () => {
  it('finds all the threads', () => {
    const { getThreads } = createModel({ db });
    const threads = getThreads();
    expect(threads).toEqual(THREADS.unnormalized);
  });
});

describe('getThreadById', () => {
  it('finds a thread by its id', () => {
    const { getThreadById } = createModel({ db });
    const thread = getThreadById('thread1');
    expect(thread).toEqual(THREADS.normalized.thread1);
  });
  it('when thread not found rejects the promise', () => {
    const { getThreadById } = createModel({ db });
    expect(() => getThreadById('7')).toThrow(new NotFound());
  });
});

describe('getThreadBySlug', () => {
  it('finds a thread by its slug', () => {
    const { getThreadBySlug } = createModel({ db });
    const thread = getThreadBySlug(THREADS.thread1.slug);
    expect(thread).toEqual(THREADS.normalized.thread1);
  });
  it('when thread not found rejects the promise', () => {
    const { getThreadBySlug } = createModel({ db });
    expect(() => getThreadBySlug('not-found')).toThrow(new NotFound());
  });
});

describe('createThread', () => {
  it('creates a thread', () => {
    uuid.mockReturnValueOnce(UUID1)
      .mockReturnValueOnce(UUID2)
      .mockReturnValueOnce(UUID3);
    const { createThread } = createModel({ db });

    const thread1 = createThread({
      headline: INPUT_HEADLINE,
      articleBody: 'Adipiscing elit ',
    }, USER.credentials);

    expect(thread1).toMatchObject({
      id: UUID1,
      slug: EXPECTED_SLUG1,
      dateCreated: expect.stringMatching(ISO_DATE_PATTERN),
      headline: EXPECTED_HEADLINE,
      articleBody: 'Adipiscing elit',
      author: USER.username,
    });

    const thread2 = createThread({
      headline: INPUT_HEADLINE,
      articleBody: '  ',
    }, USER.credentials);

    expect(thread2).toMatchObject({
      id: UUID2,
      slug: EXPECTED_SLUG2,
      dateCreated: expect.stringMatching(ISO_DATE_PATTERN),
      headline: EXPECTED_HEADLINE,
      articleBody: null,
      author: USER.username,
    });

    const thread3 = createThread({
      headline: INPUT_HEADLINE,
    }, USER.credentials);

    expect(thread3).toMatchObject({
      id: UUID3,
      slug: EXPECTED_SLUG3,
      dateCreated: expect.stringMatching(ISO_DATE_PATTERN),
      headline: EXPECTED_HEADLINE,
      articleBody: null,
      author: USER.username,
    });
  });
  it('with a short headline creates a thread containing the full headline in the slug', () => {
    uuid.mockReturnValueOnce(UUID1)
      .mockReturnValueOnce(UUID2)
      .mockReturnValueOnce(UUID3);
    const { createThread } = createModel({ db });

    const thread1 = createThread({
      headline: INPUT_SHORT_HEADLINE,
    }, USER.credentials);

    expect(thread1).toHaveProperty('slug', EXPECTED_SHORT_SLUG1);

    const thread2 = createThread({
      headline: INPUT_SHORT_HEADLINE,
    }, USER.credentials);

    expect(thread2).toHaveProperty('slug', EXPECTED_SHORT_SLUG2);

    const thread3 = createThread({
      headline: INPUT_SHORT_HEADLINE,
    }, USER.credentials);

    expect(thread3).toHaveProperty('slug', EXPECTED_SHORT_SLUG3);
  });
  it('with blank headline rejects the promise', () => {
    const { createThread } = createModel({ db });
    const input = {
      headline: '  ',
    };

    expect(() => createThread(input, USER.credentials)).toThrow(
      new UnprocessableEntity('Headline is required.')
    );
  });
});

describe('softDeleteThread', () => {
  it('sets the thread date deleted', () => {
    const { softDeleteThread } = createModel({ db });
    const thread = softDeleteThread(THREADS.thread1.slug);
    expect(thread.dateDeleted).toBeTruthy();
  });
});

describe('canDeleteThread', () => {
  it('without credentials returns false', () => {
    const { canDeleteThread } = createModel({ db });
    const result = canDeleteThread(THREADS.normalized.thread1, null);
    expect(result).toBe(false);
  });
  it('when thread deleted returns false', () => {
    const { canDeleteThread } = createModel({ db });
    const result = canDeleteThread(
      THREADS.normalized.thread2,
      USER.credentials
    );
    expect(result).toBe(false);
  });
  it('with different thread author', () => {
    const { canDeleteThread } = createModel({ db });
    const thread = {
      ...THREADS.normalized.thread1,
      author: 'ginger-rogers',
    };

    const result = canDeleteThread(thread, USER.credentials);

    expect(result).toBe(false);
  });
  it('when can delete thread returns true', () => {
    const { canDeleteThread } = createModel({ db });
    const result = canDeleteThread(
      THREADS.normalized.thread1,
      USER.credentials
    );
    expect(result).toBe(true);
  });
});
