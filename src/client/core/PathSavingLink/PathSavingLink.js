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
import { Link } from 'react-router-dom';

/**
 * Link that saves the current pathname.
 *
 * Used to allow the next page to Post-Redirect-Get.
 */
const PathSavingLink = ({ to, ...props }) => {
  const nextLocation = ({ pathname }) => ({
    pathname: to,
    state: { from: pathname },
  });

  return <Link {...props} to={nextLocation} />;
};

PathSavingLink.propTypes = {
  /** The path the link navigates to. */
  to: PropTypes.string.isRequired,
};

export default PathSavingLink;
