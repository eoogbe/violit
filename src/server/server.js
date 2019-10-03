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

const compression = require('compression');
const cookieParser = require('cookie-parser');
const errorhandler = require('errorhandler');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const apiRouter = require('./api');

const app = express();

app.use(morgan('dev'));
app.use(compression());
app.use(helmet());
app.use(cookieParser());
app.use('/api', apiRouter());

if (process.env.NODE_ENV === 'development') {
  app.use(errorhandler());
}

module.exports = app;
