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
import { MdArrowDropDown, MdExitToApp } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import useOnClickOutside from 'use-onclickoutside';
import { actions as authActions, select as authSelect } from 'client/auth';
import { DropdownMenu } from 'client/dropdown';

const StyledUserDropdown = styled.nav`
  justify-self: end;
  position: relative;
`;

const Toggle = styled.button`
  font-size: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacingSm} ${({ theme }) => theme.spacingMd};
  border: 1px solid ${({ theme }) => theme.gray200};
  border-radius: ${({ theme }) => theme.borderRadius};
  background: transparent;
`;

Toggle.displayName = 'Toggle';

/** Dropdown navigation related to the current user. */
const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const username = useSelector(authSelect.getUsername);
  const dispatch = useDispatch();

  const ref = useRef();
  useOnClickOutside(ref, () => setOpen(false));

  const menuItems = [
    {
      onClick: () => dispatch(authActions.logoutTriggered()),
      icon: MdExitToApp,
      text: 'Log out',
    },
  ];

  return (
    <StyledUserDropdown ref={ref}>
      <Toggle
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="dropdown-menu-user"
        onClick={() => setOpen(!open)}
      >
        {username}
        <MdArrowDropDown
          size="1.25em"
          attr={{ focusable: 'false', viewBox: '0 0 24 24' }}
        />
      </Toggle>
      {open && <DropdownMenu id="dropdown-menu-user" items={menuItems} />}
    </StyledUserDropdown>
  );
};

export default UserDropdown;
