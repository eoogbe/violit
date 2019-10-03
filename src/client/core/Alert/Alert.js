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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';
import styled from 'styled-components';

const StyledAlert = styled.div`
  font-size: 1rem;
  display: flex;
  align-items: flex-start;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  padding: ${({ theme }) => theme.spacingMd};
  background-color: ${({ theme }) => theme.red200};
`;

const CloseButton = styled.button`
  padding: ${({ theme }) => theme.spacingSm};
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.gray700};
`;

CloseButton.displayName = 'CloseButton';

const Paragraph = styled.p`
  margin: 0;
`;

const ReloadButton = styled.button`
  font-size: 1rem;
  padding: 0;
  border: none;
  background: none;
  text-decoration: underline;
`;

ReloadButton.displayName = 'ReloadButton';

/** An error alert message. */
const Alert = ({ action }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  const closeButtonIconAttrs = {
    title: 'Dismiss alert',
    focusable: 'false',
    viewBox: '0 0 24 24',
  };

  return (
    <StyledAlert role="alert" aria-live="assertive">
      <Paragraph>
        Oops! Something went wrong with {action || 'that action'}!&nbsp;
        <ReloadButton type="button" onClick={() => window.location.reload()}>
          Reload page
        </ReloadButton>
      </Paragraph>
      <CloseButton type="button" onClick={() => setDismissed(true)}>
        <MdClose size="1.25em" attr={closeButtonIconAttrs} />
      </CloseButton>
    </StyledAlert>
  );
};

Alert.propTypes = {
  /** A message describing the attempted action causing the error. */
  action: PropTypes.string,
};

export default Alert;
