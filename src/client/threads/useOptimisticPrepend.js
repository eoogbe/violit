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
import { useCallback, useState } from 'react';
import uuid from 'uuid/v4';

/**
 * Hook that optimistically prepends an item to a list of items.
 *
 * Updates the created item to be the response for the server on success.
 * Restores the original state on error.
 */
export default (optimisticCreate, sendCreate, options) => {
  const { onPrepend } = options || {};

  const [pending, setPending] = useState(false);
  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);

  const onCreate = useCallback(async (input) => {
    if (pending) {
      return;
    }

    const id = uuid();
    const item = optimisticCreate(id, input);
    setItems(R.prepend(item));
    if (onPrepend) {
      onPrepend(item);
    }

    setError(false);
    setPending(true);

    try {
      const createdItem = await sendCreate(item);
      setItems(R.map((existing) =>
        existing.id === id ? createdItem : existing));
    } catch (e) {
      setError(true);
      setItems(R.reject(R.propEq('id', id)));
    }

    setPending(false);
  }, [pending, optimisticCreate, sendCreate, onPrepend]);

  return [items, error, onCreate];
};
