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

import styled from 'styled-components';

/** An interactive control for a form. */
const Input = styled.input`
  font-size: 1rem;
  font-family: 'Roboto', sans-serif;
  box-sizing: border-box;
  display: block;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacingMd};
  padding: ${({ theme }) => theme.spacingMd};
  border: 1px solid ${({ theme }) => theme.gray500};
  border-radius: ${({ theme }) => theme.borderRadius};
  resize: none;
`;

/** @component */
export default Input;
