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
CREATE TABLE board (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL
);

INSERT INTO board (id, name)
VALUES ('e2eae1bb-9289-43c1-ba72-e0e74e9da7cd', 'dance');

CREATE TABLE thread_tmp(
  id TEXT PRIMARY KEY,
  dateCreated TEXT NOT NULL DEFAULT(STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  headline TEXT NOT NULL,
  articleBody TEXT,
  boardId TEXT NOT NULL
    REFERENCES board (id)
      ON DELETE CASCADE
);

INSERT INTO thread_tmp (id, headline, articleBody, boardId)
SELECT id, headline, articleBody, 'e2eae1bb-9289-43c1-ba72-e0e74e9da7cd'
FROM thread;

CREATE TABLE comment_tmp(
  id TEXT PRIMARY KEY,
  dateCreated TEXT NOT NULL DEFAULT(STRFTIME('%Y-%m-%dT%H:%M:%fZ', 'NOW')),
  content TEXT NOT NULL,
  userId TEXT
    REFERENCES user (id)
      ON DELETE SET NULL,
  threadId TEXT NOT NULL
    REFERENCES thread_tmp (id)
      ON DELETE CASCADE
);

INSERT INTO comment_tmp (id, dateCreated, content, userId, threadId)
SELECT id, dateCreated, content, userId, threadId
FROM comment;

DROP TABLE comment;

DROP TABLE thread;

ALTER TABLE thread_tmp
RENAME TO thread;

ALTER TABLE comment_tmp
RENAME TO comment;
