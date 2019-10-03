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
import { CONTENT_TYPE } from './constants';
import getSingleBodyObject from './getSingleBodyObject';
import parseResponseBody from './parseResponseBody';

/** Loads a list of objects from the server. */
export const loadAll = async (url) => {
  const response  = await fetch(url, {
    headers: {
      Accept: CONTENT_TYPE,
    },
    credentials: 'include',
  });
  const body = await parseResponseBody(response);

  if (response.status !== 200) {
    throw new InvalidResponseError({ status: response.status, body });
  }

  if (!body) {
    throw new Error('Response body empty');
  }

  return body;
};

/** Loads a single object from the server. */
export const load = async (url) => {
  const body = await loadAll(url);
  return getSingleBodyObject(body);
};
