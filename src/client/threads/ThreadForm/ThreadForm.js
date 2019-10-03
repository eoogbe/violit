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

import React, { useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Alert, Button, useTitle } from 'client/core';
import { FormError, Input, useForm } from 'client/forms';
import { useLoad } from 'client/loading';
import * as api from '../api';

const StyledThreadForm = styled.form`
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacingMd};
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

/** The screen for creating a thread. */
const ThreadForm = () => {
  const history = useHistory();
  const [unknownError, setUnknownError] = useState(false);

  const [
    loading,
    loadError,
    canCreateThread,
  ] = useLoad(api.checkCanCreateThread);

  useTitle('New thread');

  const [
    values,
    errors,
    dirtied,
    { handleChange, handleSubmit },
    { submitting, isDirty, hasError: formError },
  ] = useForm({
    headline: '',
    articleBody: '',
  }, ({ headline }) => {
    setUnknownError(false);
    return {
      headline: !headline.trimEnd() && 'Must not be blank.',
    };
  }, {
    commitOnChange: true,
  });
  const disabled = !isDirty || formError || submitting;

  const onSubmit = async (input) => {
    setUnknownError(false);
    try {
      const thread = await api.sendCreateThread(input);
      if (thread.error) {
        return {
          form: thread.error,
        };
      } else {
        history.replace(`/threads/${thread.slug}`);
      }
    } catch (err) {
      setUnknownError(true);
    }
  };

  const showAlert = loadError || unknownError;

  if (!loading && !loadError && !canCreateThread) {
    return <Redirect to="/login" />;
  }

  return (
    <StyledThreadForm onSubmit={handleSubmit(onSubmit)}>
      <Heading>New thread</Heading>
      {errors.form && <FormError>{errors.form}</FormError>}
      <FieldList>
        <li>
          <label htmlFor="headline">Title</label>
          <Input
            id="headline"
            type="text"
            name="headline"
            aria-required="true"
            value={values.headline}
            onChange={handleChange}
            autoFocus
          />
          {dirtied.headline && errors.headline &&
            <FormError aria-describedby="headline">
              {errors.headline}
            </FormError>}
        </li>
        <li>
          <label htmlFor="article-body">Body</label>
          <Input
            as="textarea"
            id="article-body"
            name="article-body"
            rows={5}
            value={values.articleBody}
            onChange={handleChange}
          />
        </li>
      </FieldList>
      <SubmitButton type="submit" disabled={disabled} loading={submitting}>
        Post
      </SubmitButton>
      {showAlert && <Alert />}
    </StyledThreadForm>
  );
};

export default ThreadForm;
