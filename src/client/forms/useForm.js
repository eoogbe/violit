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

import camelCase from 'camel-case';
import * as R from 'ramda';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/** Hook that adds state for a form with controlled components. */
export default (initialValues, validate, options) => {
  const { commitOnChange } = options || {};

  const prevValues = useRef(initialValues);
  const preventDoubleSubmit = useRef(false);
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [dirtied, setDirtied] = useState(R.map(R.F, initialValues));
  const [submitting, setSubmitting] = useState(false);

  const unmounted = useRef(false);
  useEffect(() => () => {
    unmounted.current = true;
  }, []);

  const isDirty = useMemo(() => {
    return Object.values(dirtied).includes(true);
  }, [dirtied]);

  const hasError = useMemo(() => {
    return Object.values(errors).some((error) => !!error);
  }, [errors]);

  const validateFields = useCallback(async () => {
    if (!validate) {
      return {};
    }

    const errors = await validate(values) || {};
    if (!unmounted.current) {
      setErrors(errors);
    }

    return errors;
  }, [validate, values]);

  useEffect(() => {
    if (values === prevValues.current) {
      return;
    }

    validateFields();
    prevValues.current = values;
  }, [values, validateFields]);

  const reset = useCallback(() => {
    if (unmounted.current) {
      return;
    }

    prevValues.current = initialValues;
    preventDoubleSubmit.current = false;
    setValues(initialValues);
    setErrors({});
    setDirtied(R.map(R.F, initialValues));
    setSubmitting(false);
  }, [initialValues]);

  const handleInput = useCallback(({ target }) => {
    const { name, value } = target;
    setValues(R.assoc(camelCase(name), value));
  }, []);

  const handleCommit = useCallback(({ target }) => {
    const { value } = target;
    const name = camelCase(target.name);
    setValues(R.assoc(name, value));
    setDirtied(R.assoc(name, true));
  }, []);

  const handleChange = useCallback((event) => {
    handleInput(event);
    if (commitOnChange) {
      handleCommit(event);
    }
  }, [handleInput, handleCommit, commitOnChange]);

  const handleSubmit = useCallback((onSubmit) => async (event) => {
    event.preventDefault();

    if (preventDoubleSubmit.current) {
      return;
    }

    if (!unmounted.current) {
      preventDoubleSubmit.current = true;
      setSubmitting(true);
    }

    const fieldErrors = await validateFields();
    if (Object.values(fieldErrors).every((error) => !error)) {
      const submitErrors = await onSubmit(values) || {};
      if (!unmounted.current) {
        setErrors(submitErrors);
      }
    }

    if (!unmounted.current) {
      preventDoubleSubmit.current = false;
      setSubmitting(false);
    }
  }, [validateFields, values]);

  const eventHandlers = {
    handleChange,
    handleBlur: handleCommit,
    handleSubmit,
  };

  return [
    values,
    errors,
    dirtied,
    eventHandlers,
    { submitting, isDirty, hasError, reset, validateFields },
  ];
};
