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

import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createPromiseListener from 'redux-promise-listener';
import createSagaMiddleware from 'redux-saga';
import saga from './saga';
import updater from './updater';

export const promiseListener = createPromiseListener();

/** Configures the Redux store. */
export default () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    (state, action) => updater(action)(state),
    composeWithDevTools(
      applyMiddleware(sagaMiddleware, promiseListener.middleware)
    )
  );
  sagaMiddleware.run(saga);
  return store;
};
