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

const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const debug = require('debug')('violit:db');
const uuid = require('uuid/v4');

const SALT_ROUNDS = 10;

const USERS = [
  {
    id: uuid(),
    username: 'fred-astaire',
    password: 'password123',
  },
  {
    id: uuid(),
    username: 'ginger-rogers',
    password: 'password456',
  },
];

const THREADS = [
  {
    id: uuid(),
    slug: 'social-dance-is-a-unique-form-of-dance',
    headline: 'Social dance is a unique form of dance',
    articleBody: `Social dance is the easiest form of dance to learn because of
its unique audience. All dance has an audience, whether it be the judges or just
the other people in the room. The audience for social dance is just your dance
partner.

Because the audience is so small, the pressure to perform well is reduced. All
you have to do is keep your partner happy. You can be off the beat, on the wrong
foot, or even change the dance in the middle. Everything is ok, so long as your
partner is having fun!

The ease of entry for social dance is part of what makes it so fun.
It's my favorite kind of dance!
`,
  },
  {
    id: uuid(),
    slug: 'how-do-I-learn-the-chicken-noodle-soup',
    headline: 'How do I learn the chicken noodle soup?',
  },
  {
    id: uuid(),
    slug: 'dae-hate-bachata',
    headline: 'DAE hate bachata?',
    articleBody: `It's like grinding but with a basic step. Doesn't help that we
do it in a well-lit dance hall.`,
  },
];

const COMMENTS = [
  'I *love* social dance too!',
  `I thought I had two left feet, but now you've got me intrigued. Is it easier
than Zumba?`,
  `Coming from a competitive ballroom background, I found social dance harder to
get into than I expected. It took me a while to get used to the freedom social
dance provides. In competitive dance, there's one right way: the judges' way.
To contrast, social dance is absurdly flexible.`,
];

const INSERT_USER_SQL =
`INSERT INTO user (id, username, password)
SELECT :id, :username, :password
WHERE NOT EXISTS (
  SELECT 1
  FROM user
  WHERE username = :username
)`;

const INSERT_THREAD_SQL =
`INSERT INTO thread (id, slug, headline, articleBody, userId, boardId)
SELECT :id, :slug, :headline, :articleBody, user.id, board.id
FROM (
  SELECT id
  FROM user
  WHERE user.username = :username
) user
  CROSS JOIN board
WHERE NOT EXISTS (
  SELECT 1
  FROM thread
  WHERE thread.headline = :headline
)`;

const SELECT_HAS_COMMENTS_SQL =
`SELECT 1
FROM comment
  JOIN thread
    ON comment.threadId = thread.id
WHERE thread.headline = :headline`;

const INSERT_COMMENT_SQL =
`INSERT INTO comment (id, content, userId, threadId)
SELECT :id, :content, user.id, thread.id
FROM (
  SELECT id
  FROM user
  WHERE user.username = :username
) user
  CROSS JOIN (
    SELECT id
    FROM thread
    WHERE thread.headline = :headline
  ) thread`;

/** Inserts the seed users. */
const insertUsers = (db) => {
  const insertUserStmt = db.prepare(INSERT_USER_SQL);

  USERS.forEach(({ id, username, password }) => {
    insertUserStmt.run({
      id,
      username,
      password: bcrypt.hashSync(password, SALT_ROUNDS),
    });
  });
};

/** Inserts the seed threads. */
const insertThreads = (db) => {
  const insertThreadStmt = db.prepare(INSERT_THREAD_SQL);

  THREADS.forEach(({ id, slug, headline, articleBody }) => {
    insertThreadStmt.run({
      id,
      slug,
      headline,
      articleBody,
      username: USERS[0].username,
    });
  });
};

/** Inserts the seed comments if the thread does not already have comments. */
const insertComments = (db) => {
  const selectHasCommentsStmt = db.prepare(SELECT_HAS_COMMENTS_SQL);
  const hasComments = selectHasCommentsStmt.get({
    headline: THREADS[0].headline,
  });
  if (hasComments) {
    return;
  }

  const insertCommentStmt = db.prepare(INSERT_COMMENT_SQL);

  COMMENTS.forEach((content) => {
    insertCommentStmt.run({
      id: uuid(),
      content,
      username: USERS[0].username,
      headline: THREADS[0].headline,
    });
  });
};

/** Inserts the seed data. */
const run = () => {
  const db = new Database('./data/dev.db', {
    fileMustExist: true,
    verbose: debug,
  });
  insertUsers(db);
  insertThreads(db);
  insertComments(db);
};

run();
