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

import path from 'path';
import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import * as BOARD from '__fixtures__/boardFixture';
import * as COMMENTS from '__fixtures__/commentsFixture';
import * as THREADS from '__fixtures__/threadsFixture';
import * as USER from '__fixtures__/userFixture';

const INSERT_USER_SQL =
`INSERT INTO user (id, username, password)
VALUES (:id, :username, :password)`;

const INSERT_BOARD_SQL =
`INSERT INTO board (id, name)
VALUES (:id, :name)`;

const INSERT_THREAD_SQL =
`INSERT INTO thread (
  id,
  slug,
  dateCreated,
  dateDeleted,
  headline,
  articleBody,
  userId,
  boardId
) VALUES (
  :id,
  :slug,
  :dateCreated,
  :dateDeleted,
  :headline,
  :articleBody,
  :userId,
  :boardId
)`;

const INSERT_COMMENT_SQL =
`INSERT INTO comment (id, dateCreated, dateDeleted, content, userId, threadId)
VALUES (:id, :dateCreated, :dateDeleted, :content, :userId, :threadId)`;

/** Initializes the test database. */
export default () => {
  const dbPath = path.resolve(__dirname, '..', '..', 'data', 'test.db');
  const db = new Database(dbPath, {
    fileMustExist: true,
  });

  db.prepare('DELETE FROM comment').run();
  db.prepare('DELETE FROM thread').run();
  db.prepare('DELETE FROM board').run();
  db.prepare('DELETE FROM user').run();

  db.prepare(INSERT_USER_SQL).run({
    id: 'user1',
    username: USER.username,
    password: bcrypt.hashSync(USER.password, 4),
  });

  db.prepare(INSERT_BOARD_SQL).run(BOARD.board);

  const insertThreadStmt = db.prepare(INSERT_THREAD_SQL);
  THREADS.db.forEach((thread) => {
    insertThreadStmt.run(thread);
  });

  const insertCommentStmt = db.prepare(INSERT_COMMENT_SQL);
  COMMENTS.db.forEach((comment) => {
    insertCommentStmt.run(comment);
  });

  return db;
};
