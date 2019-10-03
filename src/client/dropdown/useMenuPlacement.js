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

import { useEffect } from 'react';

/** Returns the data needed to place the menu vertically. */
export const getMenuVertical = ({
  placement,
  menuRect,
  scrollParentRect,
  viewHeight,
  scrollTop,
}) => {
  const viewSpaceBelow = viewHeight - menuRect.top;
  const scrollSpaceBelow = scrollParentRect.height - scrollTop - menuRect.top;
  const scrollDown = menuRect.bottom - viewHeight + scrollTop;

  if (menuRect.height <= viewSpaceBelow) {
    return { direction: 'top' };
  }

  if (menuRect.height <= scrollSpaceBelow) {
    return { direction: 'top', scrollDown };
  }

  switch (placement) {
    case 'auto':
      return { direction: 'bottom' };
    default:
      return { direction: 'top', scrollDown };
  }
};

/**
 * Places a dropdown menu in relation to the dropdown, scrolling to fit if
 * needed.
 *
 * @param {('bottom'|'auto')} [placement='bottom'] - the intended placement of
 * the menu. `auto` will flip if no space is available below.
 */
export default (ref, placement) => {
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const scrollParent = document.documentElement;
    const { direction, scrollDown } = getMenuVertical({
      placement,
      menuRect: ref.current.getBoundingClientRect(),
      scrollParentRect: scrollParent.getBoundingClientRect(),
      viewHeight: window.innerHeight,
      scrollTop: window.pageYOffset,
    });

    ref.current.style[direction] = 'calc(100% - 1px)';
    if (scrollDown) {
      scrollParent.scrollTo({
        top: scrollDown,
        behavior: 'smooth',
      });
    }
  }, [ref, placement]);
};
