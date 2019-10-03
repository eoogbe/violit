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

import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useCredentials } from 'client/auth';
import { CommentList, api as commentsApi } from 'client/comments';
import { Alert } from 'client/core';
import { LoadingContainer } from 'client/loading';
import ThreadMain from '../ThreadMain';
import * as api from '../api';
import useOptimisticPrepend from '../useOptimisticPrepend';

const StyledThread = styled.article`
  font-size: 1rem;
  padding: ${({ theme }) => theme.spacingMd};
  position: relative;
`;

const StyledMainContainer = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.gray200};
`;

/** The screen for a thread of discussion. */
const Thread = () => {
  const { slug } = useParams();
  const credentials = useCredentials();
  const [deleteError, setDeleteError] = useState(false);

  const commentListEl = useRef();
  const [
    createdComments,
    createError,
    createComment,
  ] = useOptimisticPrepend((commentId, { text }) => ({
    id: commentId,
    author: credentials.username,
    dateCreated: new Date().toISOString(),
    text: text.trimEnd(),
    threadSlug: slug,
  }), commentsApi.sendCreateComment, {
    onPrepend: () => {
      commentListEl.current.scrollIntoView();
    },
  });

  return (
    <StyledThread
      itemScope
      itemType="http://schema.org/DiscussionForumPosting"
    >
      <StyledMainContainer>
        <LoadingContainer
          loadData={() => api.loadThread(slug)}
          action="loading the thread"
          render={(thread) => (
            <ThreadMain
              loggedIn={!!credentials}
              createComment={createComment}
              onDeleteError={() => setDeleteError(true)}
              {...thread}
            />
          )}
        />
      </StyledMainContainer>
      <CommentList
        threadSlug={slug}
        additionalComments={createdComments}
        ref={commentListEl}
      />
      {createError && <Alert action="creating a comment" />}
      {deleteError && <Alert action="deleting the thread" />}
    </StyledThread>
  );
};

export default Thread;
