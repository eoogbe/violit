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

import * as R from 'ramda';
import InvalidResponseError from './InvalidResponseError';
import { CONTENT_TYPE } from './constants';
import createRequestBody from './createRequestBody';
import parseResponseBody from './parseResponseBody';

/** Constructs the options to pass into the fetch API. */
const getFetchOptions = (args) => {
  const options = {
    method: 'POST',
    headers: {
      Accept: CONTENT_TYPE,
    },
    credentials: 'include',
  };
  if (!args.length) {
    return options;
  }

  return R.mergeDeepRight(options, {
    headers: {
      'Content-Type': CONTENT_TYPE,
    },
    body: createRequestBody(...args),
  });
};

/** Posts an object to the server. */
export default async (url, ...args) => {
  const response = await fetch(url, getFetchOptions(args));
  const { status } = response;
  const body = await parseResponseBody(response);

  if (!response.ok) {
    throw new InvalidResponseError({ status, body });
  }

  return {
    status,
    headers: response.headers,
    body,
  };
}
