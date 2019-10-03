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
import TimeAgo from 'react-timeago';

/** Formatting function that collapses seconds into one value. */
const formatter = (_value, unit, suffix, _epochMillis, nextFormatter) => {
  if (unit === 'second') {
    return `less than a minute ${suffix}`;
  }

  return nextFormatter();
};

/** A formatter for the date/time relative to now. */
const RelativeDatetime = (props) => (
  <TimeAgo {...props} formatter={formatter} />
);

RelativeDatetime.propTypes = {
  /** The date/time value to format. */
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Date),
  ]).isRequired,
};

export default RelativeDatetime;
