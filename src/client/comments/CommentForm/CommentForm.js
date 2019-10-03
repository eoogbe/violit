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
import styled from 'styled-components';
import { Button } from 'client/core';
import { Input, useForm } from 'client/forms';

const StyledCommentForm = styled.form`
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  margin: ${({ theme }) => theme.spacingLg} 0 ${({ theme }) => theme.spacingMd};
`;

const FieldList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const SubmitButton = styled(Button)`
  align-self: flex-end;
`;

/** A form for creating a comment. */
const CommentForm = ({ createComment }) => {
  const [
    values,
    /* errors */,
    /** dirtied */,
    { handleChange, handleSubmit },
    { submitting, isDirty, hasError, reset },
  ] = useForm({
    text: '',
  }, ({ text }) => ({
    text: !text.trimEnd() && 'Must not be blank.',
  }), {
    commitOnChange: true,
  });
  const disabled = !isDirty || hasError || submitting;

  const onSubmit = (input) => {
    createComment(input);
    reset();
  };

  return (
    <StyledCommentForm onSubmit={handleSubmit(onSubmit)}>
      <FieldList>
        <li>
          <Input
            as="textarea"
            name="text"
            placeholder="Write a comment"
            rows={5}
            value={values.text}
            onChange={handleChange}
          />
        </li>
      </FieldList>
      <SubmitButton type="submit" disabled={disabled} loading={submitting}>
        Comment
      </SubmitButton>
    </StyledCommentForm>
  );
};

CommentForm.propTypes = {
  /** Creates a comment. */
  createComment: PropTypes.func.isRequired,
};

export default CommentForm;
