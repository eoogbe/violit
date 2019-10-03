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

import React, { forwardRef, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Loading from 'react-loading';
import styled from 'styled-components';
import { EmptyListParagraph } from 'client/article';
import { Alert, theme } from 'client/core';
import { useLoad } from 'client/loading';
import Comment from '../Comment';
import * as api from '../api';

const StyledError = styled.div`
  font-size: 1rem;
  position: relative;
  height: 3.5em;
`;

const StyledCommentList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const StyledLoading = styled(Loading)`
  font-size: 1rem;
  margin: ${({ theme }) => theme.spacingMd} auto;
`;
/** Renders a single comment item. */
const renderComment = ({ onDeleteError }) => (comment) => (
  <Comment key={comment.id} {...comment} onDeleteError={onDeleteError} />
);

/** The list of comments for a thread. */
const CommentList = forwardRef(({ threadSlug, additionalComments }, ref) => {
  const [deleteError, setDeleteError] = useState(false);

  const loadComments = useCallback(() => {
    return api.loadComments(threadSlug);
  }, [threadSlug]);

  const [
    loading,
    loadError,
    loadedComments,
  ] = useLoad(loadComments);

  if (loadError) {
    return (
      <StyledError>
        <Alert action="loading the comments" />
      </StyledError>
    );
  }

  if (deleteError) {
    return (
      <StyledError>
        <Alert action="deleting the comment" />
      </StyledError>
    );
  }

  const comments =
    [].concat(additionalComments, loadedComments).filter(Boolean);
  if (comments.length) {
    return (
      <StyledCommentList ref={ref}>
        {comments.map(renderComment({
          onDeleteError: () => setDeleteError(true),
        }))}
      </StyledCommentList>
    );
  }

  if (loading) {
    return (
      <StyledLoading type="spinningBubbles" color={theme.primaryColor} />
    );
  }

  return <EmptyListParagraph>No comments</EmptyListParagraph>;
});

CommentList.propTypes = {
  /** The slug of the parent thread. */
  threadSlug: PropTypes.string.isRequired,
  /** Comments to prepend to the loaded comments. */
  additionalComments: PropTypes.arrayOf(PropTypes.shape({
    /** The unique id of the comment. */
    id: PropTypes.string.isRequired,
    /** The username of the person who wrote the comment. */
    author: PropTypes.string.isRequired,
    /** The date the comment was posted. */
    dateCreated: PropTypes.string.isRequired,
    /** The date the comment was deleted. */
    dateDeleted: PropTypes.string,
    /** The text content of the comment. */
    text: PropTypes.string,
    /** `true` if the current user can delete the comment. */
    canDelete: PropTypes.bool,
  })),
  /** A ref to the list. */
  ref: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

export default CommentList;
