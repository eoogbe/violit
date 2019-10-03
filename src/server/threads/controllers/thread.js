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

const createThreadCollection = require('./createThreadCollection');

/** The controller for the thread resource. */
module.exports = {
  get: (req, res) => {
    const { model } = res.locals;
    const { getThreadBySlug } = model.threads;
    const thread = getThreadBySlug(req.params.threadSlug);
    return createThreadCollection(res.locals)(thread);
  },
};
