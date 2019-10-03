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
import { mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import PathSavingLink from '../PathSavingLink';

it('saves the current pathname', () => {
  let location;
  const wrapper = mount(
    <MemoryRouter initialEntries={['/prev']}>
      <PathSavingLink to="/next" />
      <Route
        path="*"
        render={(props) => {
          location = props.location;
          return null;
        }}
      />
    </MemoryRouter>
  );

  wrapper.find('a').simulate('click', { button: 0 });

  expect(location).toHaveProperty('pathname', '/next');
  expect(location).toHaveProperty('state.from', '/prev');
});
