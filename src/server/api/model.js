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

const { model: authModel } = require('../auth');
const { model: boardModel } = require('../board');
const { model: commentsModel } = require('../comments');
const { model: threadsModel } = require('../threads');
const { model: usersModel } = require('../users');

module.exports = ({ db }) => ({
  auth: authModel({ db }),
  board: boardModel({ db }),
  comments: commentsModel({ db }),
  threads: threadsModel({ db }),
  users: usersModel({ db }),
});
