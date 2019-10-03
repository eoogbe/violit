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

import matchActions from '../matchActions';

it('when action in action types matches updater', () => {
  const updater = matchActions(['FOO', 'BAR'], () => () => true);
  const next = updater({ type: 'FOO' })(false);
  expect(next).toBe(true);
});

it('when action not in action types does not match updater', () => {
  const updater = matchActions(['FOO', 'BAR'], () => () => true);
  const next = updater({ type: 'BAZ' })(false);
  expect(next).toBe(false);
});
