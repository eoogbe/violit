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

import createActions from '../createActions';

it('constructs a series of action creators with their types', () => {
  const actions = createActions('foo', [
    'BAR',
    ['FIZZ_BUZZ', ['baz']],
  ]);

  expect(actions).toHaveProperty('bar');
  expect(actions).toHaveProperty('fizzBuzz');

  expect(actions.bar).toHaveProperty('type', 'foo/BAR');
  expect(actions.fizzBuzz).toHaveProperty('type', 'foo/FIZZ_BUZZ');

  expect(actions.bar()).toEqual({
    type: 'foo/BAR',
    payload: {},
  });
  expect(actions.fizzBuzz('qux')).toEqual({
    type: 'foo/FIZZ_BUZZ',
    payload: {
      baz: 'qux',
    },
  });
});

it('when the namespace is not a string throws', () => {
  expect(() => createActions(['FOO'], ['BAR'])).toThrow();
});

it('when the action definitions is not an array throws', () => {
  expect(() => createActions('foo', 'BAR')).toThrow();
});
