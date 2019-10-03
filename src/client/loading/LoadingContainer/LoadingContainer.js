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
import Loading from 'react-loading';
import styled from 'styled-components';
import { Alert, theme } from 'client/core';
import useLoad from '../useLoad';

const StyledError = styled.div`
  font-size: 1rem;
  position: relative;
  height: 3.5em;
`;

const StyledLoading = styled(Loading)`
  font-size: 1rem;
  margin: ${({ theme }) => theme.spacingMd} auto;
`;

/** Holds data that needs to be loaded. */
const LoadingContainer = ({ loadData, action, render }) => {
  const [loading, error, data] = useLoad(loadData);

  if (error) {
    return (
      <StyledError>
        <Alert action={action} />
      </StyledError>
    );
  }

  if (loading) {
    return (
      <StyledLoading type="spinningBubbles" color={theme.primaryColor} />
    );
  }

  return render(data);
};

LoadingContainer.propTypes = {
  /** A message describing the attempted action. */
  action: PropTypes.string,
  /** Loads the data from the server. */
  loadData: PropTypes.func.isRequired,
  /** Renderer called when the server has returned data. */
  render: PropTypes.func.isRequired,
};

export default LoadingContainer;
