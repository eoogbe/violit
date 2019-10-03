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
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useCredentials } from 'client/auth';
import { Button, PathSavingLink, buttonStyles } from 'client/core';
import Main from '../Main';
import UserDropdown from '../UserDropdown';

const StyledApp = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow: hidden;
  background-color: ${({ theme }) => theme.gray200};
`;

const Header = styled.header`
  font-size: 1rem;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  padding: ${({ theme }) => theme.spacingMd};
  background-color: ${({ theme }) => theme.white};
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-family: 'Montserrat', sans-serif;
  margin: 0;
  color: ${({ theme }) => theme.primaryColor};

  a {
    color: ${({ theme }) => theme.primaryColor};
    text-decoration: none;
  }
`;

const HeaderNav = styled.nav`
  display: flex;
  justify-content: flex-end;
  justify-self: end;
`;

const LoginLink = styled(
  ({ secondary, ...props }) => <PathSavingLink {...props} />
)`
  ${buttonStyles}
  font-size: 1rem;
  margin-left: ${({ theme }) => theme.spacingMd};
`;

/** The application. */
const App = () => {
  const credentials = useCredentials();

  return (
    <StyledApp>
      <Header>
        <Title>
          <Link to="/">Violit</Link>
        </Title>
        {!credentials &&
          <HeaderNav>
            <Button>
              <PathSavingLink to="/signup">Sign up</PathSavingLink>
            </Button>
            <LoginLink to="/login" secondary>Log in</LoginLink>
          </HeaderNav>}
        {credentials && <UserDropdown />}
      </Header>
      <Main />
    </StyledApp>
  );
};

export default App;
