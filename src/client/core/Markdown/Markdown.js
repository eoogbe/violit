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
import BaseMarkdown from 'react-markdown';
import styled from 'styled-components';

/** A Markdown renderer. */
const Markdown = styled(BaseMarkdown).attrs({
  renderers: {
    link: ({ href, children }) =>
      <a rel="ugc" href={href}>{children}</a>,
  },
})`
  a {
    color: ${({ theme }) => theme.lightBlue700};
  }

  blockquote {
    font-size: 1rem;
    margin: ${({ theme }) => theme.spacingMd};
    padding-left: ${({ theme }) => theme.spacingMd};
    border-left: 2px solid ${({ theme }) => theme.lightBlue700};
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 1.25rem;
    margin: 0.4em 0;
  }

  p {
    font-size: 1rem;
    margin: ${({ theme }) => theme.spacingMd} 0;
  }
`;

Markdown.propTypes = {
  /** The Markdown source to parse. */
  source: PropTypes.string,
};

/** @component */
export default Markdown;
