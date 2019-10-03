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
import { MdAddBox } from 'react-icons/md';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ThreadList } from 'client/threads';
import { theme, useTitle } from 'client/core';
import { LoadingContainer } from 'client/loading';
import * as api from '../api';

const StyledBoard = styled.article`
  font-size: 1rem;
  padding: ${({ theme }) => theme.spacingMd};
  position: relative;
`;

const Header = styled.header`
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid ${({ theme }) => theme.gray200};
`;

const Name = styled.h2`
  font-size: 1rem;
  margin: ${({ theme }) => theme.spacingSm} 0;
`;

/** The screen for a subforum. */
const Board = () => {
  useTitle();

  return (
    <StyledBoard>
      <Header>
        <LoadingContainer
          loadData={api.loadBoard}
          action="loading the board"
          render={({ name }) => (
            <Name>{name}</Name>
          )}
        />
        <Link to="/new-thread">
          {/* SVG title added for a11y. */}
          <MdAddBox
            color={theme.primaryColor}
            size="1.5em"
            attr={{ title: 'New thread', viewBox: '0 0 24 24' }}
          />
        </Link>
      </Header>
      <ThreadList />
    </StyledBoard>
  );
};

export default Board;
