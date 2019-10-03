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
import getSingleBodyObject from './getSingleBodyObject';
import sendPost from './sendPost';

/** Sends an object to the server to be created. */
export default async (url, keys, obj) => {
  const response = await sendPost(url, keys, obj);
  const { status, headers, body } = response;
  if (status !== 201) {
    throw new InvalidResponseError({ status, body });
  }

  return {
    body: body && getSingleBodyObject(body),
    location: headers.get('Location'),
  };
}
