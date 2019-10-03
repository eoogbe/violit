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

import React, { createElement, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import useMenuPlacement from '../useMenuPlacement';

const StyledDropdownMenu = styled.ul`
  font-size: 1rem;
  position: absolute;
  top: calc(100% - 1px);
  right: 0;
  width: 7.5em;
  margin: 0;
  padding: 0;
  border: 1px solid ${({ theme }) => theme.gray200};
  background-color: ${({ theme }) => theme.white};
  box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.1), 0 4px 11px hsla(0, 0%, 0%, 0.1);
  z-index: 1;
  list-style: none;
`;

const MenuItemButton = styled.button`
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => theme.spacingMd};
  border: none;
  background: transparent;
`;

MenuItemButton.displayName = 'MenuItemButton';

/** Renders a single menu item. */
const renderMenuItem = ({ onClick, icon, text }) => {
  const iconProps = {
    size: '1.25em',
    viewBox: '0 0 24 24',
    attr: { 'aria-hidden': 'true', focusable: 'false' },
  };
  return (
    <li key={text} role="menuitem">
      <MenuItemButton type="button" onClick={onClick}>
        {createElement(icon, iconProps)}
        {text}
      </MenuItemButton>
    </li>
  );
};

/** The expandable menu for a dropdown. */
const DropdownMenu = ({ id, items, placement }) => {
  const ref = useRef();
  useMenuPlacement(ref, placement);

  return (
    <StyledDropdownMenu id={id} role="menu" ref={ref}>
      {items.map(renderMenuItem)}
    </StyledDropdownMenu>
  );
};

DropdownMenu.propTypes = {
  /** The unique id for the dropdown menu element. */
  id: PropTypes.string.isRequired,
  /** The menu items. */
  items: PropTypes.arrayOf(PropTypes.shape({
    /** Called when the menu item button is clicked. */
    onClick: PropTypes.func.isRequired,
    /** The icon the menu item shows. */
    icon: PropTypes.elementType.isRequired,
    /** The text the menu item shows. */
    text: PropTypes.string.isRequired,
  })),
  /**
   * The placement of the menu in relation to the dropdown.
   *
   * `auto` will flip if there's no space below. Defaults to `bottom`.
   */
  placement: PropTypes.oneOf(['bottom', 'auto']),
};

export default DropdownMenu;
