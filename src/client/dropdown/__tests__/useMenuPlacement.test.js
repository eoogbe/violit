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

import { getMenuVertical } from '../useMenuPlacement';

it('when menu fits sets the top position', () => {
  const result = getMenuVertical({
    menuRect: {
      top: 10,
      bottom: 20,
      height: 10,
    },
    scrollParentRect: {
      height: 200,
    },
    viewHeight: 100,
    scrollTop: 25,
  });
  expect(result).toEqual({
    direction: 'top',
  });
});

it('when menu can fit with scrolling scrolls down', () => {
  const result = getMenuVertical({
    menuRect: {
      top: 95,
      bottom: 105,
      height: 10,
    },
    scrollParentRect: {
      height: 200,
    },
    viewHeight: 100,
    scrollTop: 25,
  });
  expect(result).toEqual({
    direction: 'top',
    scrollDown: 30,
  });
});

describe('when menu does not fit', () => {
  it('when placement is \'bottom\' scrolls down', () => {
    const result = getMenuVertical({
      placement: 'bottom',
      menuRect: {
        top: 95,
        bottom: 105,
        height: 10,
      },
      scrollParentRect: {
        height: 200,
      },
      viewHeight: 100,
      scrollTop: 100,
    });
    expect(result).toEqual({
      direction: 'top',
      scrollDown: 105,
    });
  });
  it('when placement is \'auto\' flips the menu', () => {
    const result = getMenuVertical({
      placement: 'auto',
      menuRect: {
        top: 95,
        bottom: 105,
        height: 10,
      },
      scrollParentRect: {
        height: 200,
      },
      viewHeight: 100,
      scrollTop: 100,
    });
    expect(result).toEqual({
      direction: 'bottom',
    });
  });
});
