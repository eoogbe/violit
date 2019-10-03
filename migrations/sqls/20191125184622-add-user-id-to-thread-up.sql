-- Copyright 2022 Google LLC
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--      http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
CREATE TABLE thread_tmp(
  id TEXT PRIMARY KEY NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  dateCreated TEXT NOT NULL DEFAULT(STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  headline TEXT NOT NULL,
  articleBody TEXT,
  userId TEXT
    REFERENCES user (id)
      ON DELETE SET NULL,
  boardId TEXT NOT NULL
    REFERENCES board (id)
      ON DELETE CASCADE
);

CREATE TABLE comment_tmp(
  id TEXT PRIMARY KEY NOT NULL,
  dateCreated TEXT NOT NULL DEFAULT(STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  content TEXT NOT NULL,
  userId TEXT
    REFERENCES user (id)
      ON DELETE SET NULL,
  threadId TEXT NOT NULL
    REFERENCES thread_tmp (id)
      ON DELETE CASCADE
);

INSERT INTO thread_tmp (
  id,
  slug,
  dateCreated,
  headline,
  articleBody,
  userId,
  boardId
) SELECT
  thread.id,
  thread.slug,
  thread.dateCreated,
  thread.headline,
  thread.articleBody,
  firstUser.id,
  thread.boardId
FROM thread
  JOIN (
    SELECT id
    FROM user
    ORDER BY username
    LIMIT 1
  ) AS firstUser;

INSERT INTO comment_tmp (id, dateCreated, content, userId, threadId)
SELECT id, dateCreated, content, userId, threadId
FROM comment;

DROP TABLE comment;

DROP TABLE thread;

ALTER TABLE thread_tmp
RENAME TO thread;

ALTER TABLE comment_tmp
RENAME TO comment;
