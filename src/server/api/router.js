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

const cors = require('cors');
const express = require('express');
const createError = require('http-errors');
const auth = require('../auth');
const createRouteHandler = require('./createRouteHandler');
const errorHandler = require('./errorHandler');
const getAllowedMethods = require('./getAllowedMethods');
const routeMap = require('./routeMap');
const routes = require('./routes');
const setModel = require('./setModel');

const CONTENT_TYPE = 'application/vnd.collection+json';

const KNOWN_METHODS = ['HEAD', 'GET', 'POST', 'DELETE', 'OPTIONS'];

/** Creates the API router. */
module.exports = () => {
  const router = express.Router();

  router.use(setModel);

  router.use((req, res, next) => {
    res.locals.routes = routes;
    next();
  });

  router.use((req, res, next) => {
    res.type(CONTENT_TYPE);
    next();
  });

  router.use((req, res, next) => {
    if (!KNOWN_METHODS.includes(req.method)) {
      throw createError(501, 'Request method not recognized', { expose: true });
    }

    next();
  });

  router.use((req, res, next) => {
    const type = req.get('Content-Type');
    if (type && type != CONTENT_TYPE) {
      throw new createError.UnsupportedMediaType();
    }

    next();
  });

  router.use((req, res, next) => {
    if (!req.accepts(CONTENT_TYPE)) {
      throw new createError.NotAcceptable();
    }

    next();
  });

  router.use(express.json({ type: CONTENT_TYPE }));

  router.use((req, res, next) => {
    auth.setCredentials(req, res, next).catch(next);
  });

  routeMap.forEach(({ route, controller, policies }) => {
    router.all(route, (req, res, next) => {
      getAllowedMethods({
        methods: Object.keys(controller),
        policies,
        req,
        res,
      }).then((allowedMethods) => {
        res.locals.allowedMethods = allowedMethods;
        next();
      });
    });
    router.options(route, (req, res, next) => {
      const { allowedMethods } = res.locals;
      res.set('Allow', allowedMethods.join(','));
      res.removeHeader('Content-Type');
      next();
    });
  });

  router.use(cors({
    origin: true,
    methods: KNOWN_METHODS,
    exposedHeaders: ['Allow', 'Location'],
    credentials: true,
  }));

  router.use((req, res, next) => {
    const { allowedMethods } = res.locals;
    if (allowedMethods && !allowedMethods.includes(req.method)) {
      res.set('Allow', allowedMethods.join(','));
      throw new createError.MethodNotAllowed();
    }

    next();
  });

  routeMap.forEach(({ route, controller }) => {
    router.all(route, (req, res, next) => {
      const handler = createRouteHandler(controller);
      handler(req, res).catch(next);
    });
  });

  router.use((req, res) => {
    throw new createError.NotFound();
  });

  router.use(errorHandler);

  return router;
};
