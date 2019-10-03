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
  loadAll,
  sendCreate,
  sendPost,
} from 'client/api';

/** Converts a comment from the API format to the view format. */
const convertComment = ({ links, ...comment }) => R.compose(
  R.assoc('canDelete', !!links.deleteAction),
  R.pick(['id', 'dateCreated', 'dateDeleted', 'text', 'threadSlug', 'author'])
)(comment);

/** Loads comments from the server. */
export const loadComments = async (threadSlug) => {
  const { data } = await loadAll(href(`/threads/${threadSlug}/comments`));
  return data.map(convertComment);
};

/**
 * Sends the specified `comment` to the server to be created.
 */
export const sendCreateComment = async (comment) => {
  const url = href(`/threads/${comment.threadSlug}/comments`);
  const { body } = await sendCreate(url, ['id', 'text'], comment);
  return convertComment(body);
};

/** Checks if the current user can create a comment. */
export const checkCanCreateComment = async (threadSlug) => {
  const url = href(`/threads/${threadSlug}/comments`);
  const methods = await checkPermissions(url);
  return methods.includes('POST');
};

/** Sends a comment to be deleted on the server. */
export const sendDeleteComment = async (commentId) => {
  await sendPost(href(`/comments/${commentId}/delete`));
  return null;
};
