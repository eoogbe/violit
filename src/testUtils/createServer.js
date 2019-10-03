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

import cookieParser from 'cookie-parser';
import express from 'express';
import routes from 'server/api/routes';

/** Creates a test server for the specified `router`. */
export default (router, locals) => {
  const app = express();
  app.use(cookieParser());
  app.use(express.json());
  app.use((req, res, next) => {
    Object.assign(res.locals, { routes }, locals);
    next();
  });
  app.use(router());
  app.use((err, req, res, next) => {
    res.status(500).json({ error: err.message });
  });
  return app;
};
