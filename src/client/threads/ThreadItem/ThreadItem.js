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

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArticleHeader } from 'client/article';

const StyledThreadItem = styled.li`
  font-size: 1rem;
  margin: ${({ theme }) => theme.spacingLg} 0;
  list-style: none;
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.black};
  text-decoration: none;
`;

const Headline = styled.p`
  margin: 0;
`;

/** A thread list item. */
const ThreadItem = ({ slug, author, dateCreated, headline }) => (
  <StyledThreadItem>
    <StyledLink to={`/threads/${slug}`}>
      <article
        itemScope
        itemType="http://schema.org/DiscussionForumPosting"
      >
        <ArticleHeader author={author} dateCreated={dateCreated} />
        <Headline itemProp="headline">{headline}</Headline>
      </article>
    </StyledLink>
  </StyledThreadItem>
);

ThreadItem.propTypes = {
  /** The url-optimized slug of the thread. */
  slug: PropTypes.string.isRequired,
  /** The username of the person who started the thread. */
  author: PropTypes.string.isRequired,
  /** The date the thread was posted. */
  dateCreated: PropTypes.string.isRequired,
  /** The title of the thread. */
  headline: PropTypes.string.isRequired,
};

export default ThreadItem;
