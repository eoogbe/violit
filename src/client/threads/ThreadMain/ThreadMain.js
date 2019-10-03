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

import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ArticleFooter, ArticleHeader } from 'client/article';
import { CommentForm } from 'client/comments';
import { Markdown, PathSavingLink, useTitle } from 'client/core';
import * as api from '../api';

const Headline = styled.h2`
  font-size: 1.75rem;
  margin: 0;
`;

const NoArticleBodyParagraph = styled.p`
  font-size: 1rem;
  margin: ${({ theme }) => theme.spacingMd} 0;
  color: ${({ theme }) => theme.gray700};
`;

NoArticleBodyParagraph.displayName = 'NoArticleBodyParagraph';

const NoCommentFormParagraph = styled.p`
  font-size: 1rem;
  margin: ${({ theme }) => theme.spacingMd} 0;
  color: ${({ theme }) => theme.gray700};

  a {
    color: ${({ theme }) => theme.gray700};
    color: ${({ theme }) => theme.black}
  }
`;

/** The container for the main content of the thread screen. */
const ThreadMain = (props) => {
  const {
    id,
    slug,
    headline,
    articleBody,
    author,
    dateCreated,
    loggedIn,
    createComment,
    onDeleteError,
  } = props;
  const [dateDeleted, setDateDeleted] = useState(props.dateDeleted);
  const [
    canCreateComment,
    setCanCreateComment,
  ] = useState(props.canCreateComment);
  const [canDelete, setCanDelete] = useState(props.canDelete);

  const deleteThread = useCallback(async () => {
    setCanDelete(false);
    setCanCreateComment(false);
    setDateDeleted(new Date().toISOString());

    try {
      await api.sendDeleteThread(slug);
    } catch (err) {
      if (onDeleteError) {
        onDeleteError(err);
      }
    }
  }, [slug, onDeleteError]);

  useTitle(headline);

  return (
    <>
      <Headline itemProp="headline">{headline}</Headline>
      <ArticleHeader author={author} dateCreated={dateCreated} />
      <div itemProp="articleBody">
        {!dateDeleted && articleBody && <Markdown source={articleBody} />}
        {dateDeleted &&
          <NoArticleBodyParagraph>[deleted]</NoArticleBodyParagraph>}
      </div>
      {loggedIn && canCreateComment &&
        <CommentForm createComment={createComment} />}
      {!dateDeleted && !canCreateComment &&
        <NoCommentFormParagraph>
          What are your thoughts?&nbsp;
          <PathSavingLink to="/login">Log in</PathSavingLink>
        </NoCommentFormParagraph>}
      {loggedIn && canDelete &&
        <ArticleFooter
          contentId={`thread-${id}`}
          deleteContent={deleteThread}
        />}
    </>
  );
};

ThreadMain.propTypes = {
  /** The unique id of the thread. */
  id: PropTypes.string.isRequired,
  /** The url-optimized slug of the thread. */
  slug: PropTypes.string.isRequired,
  /** The username of the person who started the thread. */
  author: PropTypes.string.isRequired,
  /** The date the thread was posted. */
  dateCreated: PropTypes.string.isRequired,
  /** The date the thread was deleted. */
  dateDeleted: PropTypes.string,
  /** The title of the thread. */
  headline: PropTypes.string.isRequired,
  /** The body of the thread. */
  articleBody: PropTypes.string,
  /** `true` if the current user is logged in. */
  loggedIn: PropTypes.bool,
  /** `true` if the current user can create a comment. */
  canCreateComment: PropTypes.bool,
  /** Creates a comment. */
  createComment: PropTypes.func.isRequired,
  /** `true` if the current user can delete the thread. */
  canDelete: PropTypes.bool,
  /** Called when comment deletion fails. */
  onDeleteError: PropTypes.func,
};

export default ThreadMain;
