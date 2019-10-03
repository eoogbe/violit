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
import * as R from 'ramda';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Button, useTitle } from 'client/core';
import { FormError, Input, useForm } from 'client/forms';
import actions from '../actions';
import {
  validateUsername,
  validatePassword,
  validatePasswordConfirmation,
} from './validation';

const StyledSignup = styled.form`
  font-size: 1rem;
  padding: ${({ theme }) => theme.spacingMd};
  display: flex;
  flex-direction: column;
`;

const Heading = styled.h2`
  font-size: 1.75rem;
  margin: 0;
  margin-bottom: 0.288em;
`;

const FieldList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

FieldList.displayName = 'FieldList';

const SubmitButton = styled(Button)`
  align-self: flex-end;
`;

/** The screen for registering a new user. */
const Signup = ({ createAsyncFunction }) => {
  const history = useHistory();
  const location = useLocation();

  useTitle('Signup');

  const checkHasUserAsyncFunc = createAsyncFunction({
    start: actions.checkHasUserTriggered.type,
    resolve: actions.checkHasUserSucceeded.type,
    reject: actions.checkHasUserFailed.type,
  });
  const [
    values,
    errors,
    dirtied,
    { handleChange, handleBlur, handleSubmit },
    { submitting, isDirty, hasError },
  ] = useForm({
    username: '',
    password: '',
    passwordConfirmation: '',
  }, async (values) => ({
    username: await validateUsername(values, { checkHasUserAsyncFunc }),
    password: await validatePassword(values),
    passwordConfirmation: await validatePasswordConfirmation(values),
  }));
  const disabled = !isDirty || hasError || submitting;

  const signupAsyncFunc = createAsyncFunction({
    start: actions.signupTriggered.type,
    resolve: actions.signupSucceeded.type,
    reject: actions.credentialsInvalid.type,
  });
  const onSubmit = async (values) => {
    const user = R.pick(['username', 'password'], values);
    try  {
      await signupAsyncFunc.asyncFunction({ user });
    } catch (err) {
      return {
        form: err.error,
      };
    }

    const from = R.pathOr('/', ['state', 'from'], location);
    history.replace(from);
  };

  return (
    <StyledSignup onSubmit={handleSubmit(onSubmit)}>
      <Heading>Signup</Heading>
      {errors.form && <FormError>{errors.form}</FormError>}
      <FieldList>
        <li>
          <label htmlFor="username">Username</label>
          <Input
            id="username"
            type="text"
            name="username"
            aria-required="true"
            value={values.username}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
          />
          {dirtied.username && errors.username &&
            <FormError aria-describedby="username">
              {errors.username}
            </FormError>}
        </li>
        <li>
          <label htmlFor="password">Password</label>
          <Input
           id="password"
           type="password"
           name="password"
           aria-required="true"
           value={values.password}
           onChange={handleChange}
           onBlur={handleBlur}
          />
          {dirtied.password && errors.password &&
            <FormError aria-describedby="password">
              {errors.password}
            </FormError>}
        </li>
        <li>
          <label htmlFor="password-confirmation">Password confirmation</label>
          <Input
           id="password-confirmation"
           type="password"
           name="password-confirmation"
           aria-required="true"
           value={values.passwordConfirmation}
           onChange={handleChange}
           onBlur={handleBlur}
          />
          {dirtied.passwordConfirmation && errors.passwordConfirmation &&
            <FormError aria-describedby="password-confirmation">
              {errors.passwordConfirmation}
            </FormError>}
        </li>
      </FieldList>
      <SubmitButton type="submit" disabled={disabled} loading={submitting}>
        Sign up
      </SubmitButton>
    </StyledSignup>
  );
};

Signup.propTypes = {
  /**
   * Creates an object generating a function that returns a promise capable of
   * dispatching a series of async actions.
   */
  createAsyncFunction: PropTypes.func.isRequired,
};

export default Signup;
