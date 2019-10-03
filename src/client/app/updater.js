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

import { combine, constantState, decorate, match } from 'redux-fp';
import * as auth from 'client/auth';

/** Updater indicating that the app has an error. */
const setError =
  decorate(
    match(({ type }) => () => type.endsWith('_FAILED')),
    constantState(true)
  );

/** The root updater. */
export default combine({
  [auth.constants.NAME]: auth.updater,
  error: setError,
});
