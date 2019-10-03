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

/** Constructs a dummy response object. */
const mockResponse = (response) => {
  const status = response.status || 200;
  const headers = response.headers || {};
  const collection = response.body;
  return {
    status,
    ok: status >= 200 && status < 300,
    headers: {
      get: (name) => {
        if (name === 'Content-Type' && collection) {
          return 'application/vnd.collection+json';
        }

        return headers[name];
      },
    },
    json: () => {
      if (!collection) {
        throw new Error('Trying to get body of empty response.');
      }
      return Promise.resolve({ collection });
    },
  };
};

/** Mocks out the global fetch object. */
export default (responses) => {
  window.fetch = (url, options) => {
    const method = options.method || 'GET';
    const response = responses.find((res) =>
      res.url === url && res.method.toUpperCase() === method);
    if (!response) {
      throw new Error(`No response set for ${method} ${url}`);
    }

    return Promise.resolve(mockResponse(response));
  };
};
