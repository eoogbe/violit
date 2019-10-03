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
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  headline TEXT NOT NULL,
  articleBody TEXT
);

INSERT INTO thread_tmp (headline, articleBody)
SELECT headline, articleBody
FROM thread;

CREATE TABLE comment_tmp(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  content TEXT NOT NULL,
  threadId INTEGER NOT NULL
    REFERENCES thread_tmp (id)
      ON DELETE CASCADE
);

INSERT INTO comment_tmp (content, threadId)
SELECT comment.content, thread_tmp.id
FROM comment
  JOIN thread
    ON comment.threadId = thread.id
  JOIN thread_tmp
    ON thread.headline = thread_tmp.headline
      AND thread.articleBody = thread_tmp.articleBody;

DROP TABLE comment;

DROP TABLE thread;

ALTER TABLE thread_tmp
RENAME TO thread;

ALTER TABLE comment_tmp
RENAME TO comment;
