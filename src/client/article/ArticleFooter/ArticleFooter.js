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

import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { MdDelete, MdMoreVert } from 'react-icons/md';
import styled from 'styled-components';
import useOnClickOutside from 'use-onclickoutside';
import { DropdownMenu } from 'client/dropdown';

const StyledArticleFooter = styled.footer`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.gray700};
`;

const OverflowDropdown = styled.nav`
  display: flex;
  align-items: center;
  align-self: flex-end;
  position: relative;
`;

const OverflowToggle = styled.button`
  padding: ${({ theme }) => theme.spacingSm}
  border: none;
  background: transparent;
`;

OverflowToggle.displayName = 'OverflowToggle';

/** The footer of a self-contained, user-generated composition. */
const ArticleFooter = ({ contentId, deleteContent }) => {
  const [overflowOpen, setOverflowOpen] = useState(false);

  const overflowEl = useRef();
  useOnClickOutside(overflowEl, () => setOverflowOpen(false));

  const overflowToggleIconAttrs = {
    title: 'More actions',
    viewBox: '0 0 24 24',
    focusable: false,
  };

  const overflowMenuId = `overflow-menu-${contentId}`;

  const overflowMenuItems = [
    {
      onClick: deleteContent,
      icon: MdDelete,
      text: 'Delete',
    },
  ];

  return (
    <StyledArticleFooter>
      <OverflowDropdown ref={overflowEl}>
        <OverflowToggle
          type="button"
          aria-haspopup="true"
          aria-expanded={overflowOpen}
          aria-controls={overflowMenuId}
          onClick={() => setOverflowOpen(!overflowOpen)}
        >
          <MdMoreVert size="1.5em" attr={overflowToggleIconAttrs} />
        </OverflowToggle>
        {overflowOpen &&
          <DropdownMenu
            id={overflowMenuId}
            items={overflowMenuItems}
            placement="auto"
          />}
      </OverflowDropdown>
    </StyledArticleFooter>
  );
};

ArticleFooter.propTypes = {
  /** The unique id for the content. */
  contentId: PropTypes.string.isRequired,
  /** Deletes the content. */
  deleteContent: PropTypes.func.isRequired,
};

export default ArticleFooter;
