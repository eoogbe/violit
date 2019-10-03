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
import { Markdown } from 'client/core';
import * as api from '../api';

const StyledComment = styled.li`
  font-size: 1rem;
  margin: ${({ theme }) => theme.spacingLg} 0;
  padding: 0 ${({ theme }) => theme.spacingMd};
  border-left: 2px solid ${({ theme }) => theme.gray300};
  list-style: none;
`;

const NoTextParagraph = styled.p`
  font-size: 1rem;
  margin: ${({ theme }) => theme.spacingMd} 0;
  color: ${({ theme }) => theme.gray700};
`;

NoTextParagraph.displayName = 'NoTextParagraph';

/** A comment reply. */
const Comment = (props) => {
  const { id, author, dateCreated, text, onDeleteError } = props;
  const [dateDeleted, setDateDeleted] = useState(props.dateDeleted);
  const [canDelete, setCanDelete] = useState(props.canDelete);

  const deleteComment = useCallback(async () => {
    setCanDelete(false);
    setDateDeleted(new Date().toISOString());

    try {
      await api.sendDeleteComment(id);
    } catch (err) {
      if (onDeleteError) {
        onDeleteError(err);
      }
    }
  }, [id, onDeleteError]);

  return (
    <StyledComment
      itemScope
      itemType="http://schema.org/Comment"
      itemProp="comment"
    >
      <article>
        <ArticleHeader author={author} dateCreated={dateCreated} />
        <div itemProp="text">
          {!dateDeleted && <Markdown source={text} />}
          {dateDeleted && <NoTextParagraph>[deleted]</NoTextParagraph>}
        </div>
        {canDelete &&
          <ArticleFooter
            contentId={`comment-${id}`}
            deleteContent={deleteComment}
          />}
      </article>
    </StyledComment>
  );
};

Comment.propTypes = {
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
  /** Called when comment deletion fails. */
  onDeleteError: PropTypes.func,
};

export default Comment;
