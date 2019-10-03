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

import { CONTENT_TYPE } from './constants';

/** Converts a Collection+JSON array of links into a link object. */
const linksToObject = (links) =>
  (links || []).reduce((acc, { rel, href }) => ({
    ...acc,
    [rel]: href,
  }), {});

/** Converts a Collection+JSON item into an object. */
const itemToObject = ({ data, links }) => {
  const obj = data.reduce((acc, { name, value }) => ({
    ...acc,
    [name]: value || null,
  }), {});
  return {
    ...obj,
    links: linksToObject(links),
  };
};

/** Parses the response from a Collection+JSON collection. */
export default async (response) => {
  const contentType = response.headers.get('Content-Type');
  if (!contentType || !contentType.includes(CONTENT_TYPE)) {
    return null;
  }

  const { collection } = await response.json();
  const { error, items, links } = collection;
  if (error) {
    return { error };
  }

  return {
    data: items ? items.map(itemToObject) : [],
    links: linksToObject(links),
  };
};
