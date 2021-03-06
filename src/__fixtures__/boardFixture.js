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

export const name = 'dance';

export const board = {
  id: 'board1',
  name,
};

export const api = [
  {
    href: 'http://localhost:4000/api/board',
    data: [
      { name: 'id', value: 'board1' },
      { name: 'name', value: name },
    ],
    links: [
      { rel: 'hasPart', href: 'http://localhost:4000/api/threads' },
    ],
  },
];

export const boardFetch = {
  url: 'http://localhost:4000/api/board',
  method: 'GET',
  status: 200,
  body: {
    items: api,
  },
};
