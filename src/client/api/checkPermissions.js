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

import InvalidResponseError from './InvalidResponseError';

/** Checks the allowed methods of a route on the server. */
export default async (url) => {
  const response = await fetch(url, {
    method: 'OPTIONS',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new InvalidResponseError({ status: response.status });
  }

  const allow = response.headers.get('Allow');
  if (!allow) {
    throw new Error('No Allow response header');
  }

  return allow.split(',').map((method) => method.trim());
};
