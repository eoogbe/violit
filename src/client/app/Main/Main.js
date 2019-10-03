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
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { Login, Signup, UnauthenticatedRoute } from 'client/auth';
import { Board } from 'client/board';
import { Alert } from 'client/core';
import { Thread, ThreadForm } from 'client/threads';
import { promiseListener } from '../store';
import { getError } from '../selectors';

const StyledMain = styled.main`
  font-size: 1rem;
  flex: 1;
  position: relative;
  margin: ${({ theme }) => theme.spacingLg};
  background-color: ${({ theme }) => theme.white};
`;

/** The main section of a page. */
const Main = () => {
  const error = useSelector(getError);

  return (
    <StyledMain>
      <Switch>
        <Route exact path="/">
          <Board />
        </Route>
        <Route path="/threads/:slug">
          <Thread />
        </Route>
        <Route path="/new-thread">
          <ThreadForm />
        </Route>
        <UnauthenticatedRoute path="/login">
          <Login createAsyncFunction={promiseListener.createAsyncFunction} />
        </UnauthenticatedRoute>
        <UnauthenticatedRoute path="/signup">
          <Signup createAsyncFunction={promiseListener.createAsyncFunction} />
        </UnauthenticatedRoute>
      </Switch>
      {error && <Alert />}
    </StyledMain>
  );
};

export default Main;
