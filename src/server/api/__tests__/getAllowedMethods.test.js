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

import getAllowedMethods from '../getAllowedMethods';

it('returns the formatted list of allowed methods', () => {
  const allowedMethods = getAllowedMethods({
    methods: ['post', 'delete', 'patch'],
    policies: {
      post: () => Promise.resolve(true),
      patch: () => Promise.resolve(false),
    },
  });
  return expect(allowedMethods).resolves.toEqual(['DELETE', 'OPTIONS', 'POST']);
});

it('without policies allows all methods', () => {
  const allowedMethods = getAllowedMethods({
    methods: ['post', 'delete', 'patch'],
  });
  return expect(allowedMethods).resolves.toEqual([
    'DELETE',
    'OPTIONS',
    'PATCH',
    'POST',
  ]);
});

it('with GET method allows HEAD', () => {
  const allowedMethods = getAllowedMethods({
    methods: ['post', 'delete', 'get'],
  });
  return expect(allowedMethods).resolves.toEqual([
    'DELETE',
    'GET',
    'HEAD',
    'OPTIONS',
    'POST',
  ]);
});
