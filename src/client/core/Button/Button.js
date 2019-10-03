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
import styles from './styles';

const StyledButton = styled.button`${styles}`;

const StyledLoading = styled(Loading)`
  margin: 0 auto;
`;

/** The primary button element. */
const Button = ({ loading, children, ...props }) => (
  <StyledButton {...props}>
    {!loading && children}
    {loading &&
      <StyledLoading
        type="bubbles"
        width="1.5em"
        height="1.5em"
      />}
  </StyledButton>
);

Button.propTypes = {
  /** The default behavior of the button. */
  type: PropTypes.oneOf(['button', 'reset', 'submit']),
  /** `true` to prevent the user from interacting with the button. */
  disabled: PropTypes.bool,
  /** `true` to set the loading indicator. */
  loading: PropTypes.bool,
  /** The content of the button. */
  children: PropTypes.node,
};

export default Button;
