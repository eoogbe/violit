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

import * as R from 'ramda';
import {
  checkPermissions,
  href,
  load,
  loadAll,
  sendCreate,
  sendPost,
} from 'client/api';
import { api as commentsApi } from 'client/comments';

const THREAD_KEYS = [
  'id',
  'slug',
  'dateCreated',
  'dateDeleted',
  'headline',
  'articleBody',
  'author',
];

/** Converts a thread from the API format to the view format. */
const convertThread = ({ links, ...thread }) => R.compose(
  R.assoc('canDelete', !!links.deleteAction),
  R.pick(THREAD_KEYS)
)(thread);

/** Loads the threads from the server. */
export const loadThreads = async () => {
  const { data } = await loadAll(href('/threads'));
  return data.map(convertThread);
};

/** Loads a thread from the server. */
export const loadThread = async (threadSlug) => {
  const thread = await load(href(`/threads/${threadSlug}`));
  const canCreateComment = await commentsApi.checkCanCreateComment(thread.slug);
  return R.compose(
    R.assoc('canCreateComment', canCreateComment),
    convertThread
  )(thread);
};

/**
 * Sends the specified `thread` to the server to be created.
 */
export const sendCreateThread = async (thread) => {
  const url = href('/threads');
  try {
    const { body } = await sendCreate(url, ['headline', 'articleBody'], thread);
    return convertThread(body);
  } catch (err) {
    const message = R.path(['response', 'body', 'error', 'message'], err);
    if (!message) {
      throw new Error('Something went wrong creating the thread.');
    }

    return { error: message };
  }
};

/** Checks if the current user can create a thread. */
export const checkCanCreateThread = async () => {
  const methods = await checkPermissions(href('/threads'));
  return methods.includes('POST');
};

/** Sends a thread to be deleted on the server. */
export const sendDeleteThread = async (threadSlug) => {
  await sendPost(href(`/threads/${threadSlug}/delete`));
  return null;
};
