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

import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import useCredentials from '../useCredentials';

/**
 * A route to a component that cannot be reached when the user is authenticated.
 */
const UnauthenticatedRoute = ({ children, ...props }) => {
  const credentials = useCredentials();

  return (
    <Route {...props}>
      {credentials && <Redirect to="/" />}
      {!credentials && children}
    </Route>
  );
};

UnauthenticatedRoute.propTypes = {
  /**
   * Any valid URL path or array of paths that path-to-regexp@^1.7.0
   * understands.
   *
   * Routes without a path always match.
   */
  path: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  /** Component to render when the route matches. */
  children: PropTypes.node.isRequired,
};

export default UnauthenticatedRoute;
