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

import { css } from 'styled-components';

export default css`
  font-size: 1rem;
  box-sizing: border-box;
  min-width: 6em;
  line-height: 1.5em;
  padding: ${({ theme }) => theme.spacingSm} ${({ theme }) => theme.spacingMd};
  border: 1px solid
    ${props => props.secondary ? props.theme.primaryColor : props.theme.white};
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color:
    ${props => props.secondary ? props.theme.white : props.theme.primaryColor};
  color:
    ${props => props.secondary ? props.theme.primaryColor : props.theme.white};
  text-align: center;
  text-decoration: none;

  :disabled {
    opacity: 0.5;
  }

  a {
    color:
      ${props => props.secondary
          ? props.theme.primaryColor : props.theme.white};
    text-decoration: none;
  }
`;
