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
import styled from 'styled-components';
import { EmptyListParagraph } from 'client/article';
import { LoadingContainer } from 'client/loading';
import ThreadItem from '../ThreadItem';
import * as api from '../api';

const StyledThreadList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

/** Renders a single thread list item. */
const renderThreadItem = (thread) => (
  <ThreadItem key={thread.id} {...thread} />
);

/** Renders the list data. */
const renderList = (threads) => {
  if (!threads.length) {
    return <EmptyListParagraph>No threads</EmptyListParagraph>;
  }

  return (
    <StyledThreadList>
      {threads.map(renderThreadItem)}
    </StyledThreadList>
  );
};

/** The list of threads for the board. */
const ThreadList = () => (
  <LoadingContainer
    loadData={api.loadThreads}
    action="loading the threads"
    render={renderList}
  />
);

export default ThreadList;
