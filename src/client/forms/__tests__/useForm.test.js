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
import { act } from 'react-dom/test-utils';
import { actWait, updateWrapper, wait } from 'testUtils/wait';
import useForm from '../useForm';

const TestComponent = ({ initialValues, validate, options, onSubmit }) => {
  const [
    values,
    errors,
    dirtied,
    { handleChange, handleBlur, handleSubmit },
    { isDirty, hasError }
  ] = useForm(initialValues, validate, options);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        name="foo"
        value={values.foo}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <span className="error">{errors.foo}</span>
      <span className="dirtied">{`${dirtied.foo}`}</span>
      <span className="isDirty">{`${isDirty}`}</span>
      <span className="hasError">{`${hasError}`}</span>
      <button type="submit" />
    </form>
  );
};

const simulateChange = (wrapper, value) => {
  wrapper.find('input').simulate('change', {
    target: {
      name: 'foo',
      value,
    },
  });
};

const simulateBlur = (wrapper, value) => {
  wrapper.find('input').simulate('blur', {
    target: {
      name: 'foo',
      value,
    },
  });
};

const simulateSubmit = async (wrapper, waitFn = wait) => {
  const preventDefault = jest.fn();
  const onSubmit = wrapper.find('form').prop('onSubmit');

  await act(async () => {
    await onSubmit({ preventDefault });
    await waitFn();
  });

  expect(preventDefault).toHaveBeenCalled();
};

const unmountAndSubmit = (wrapper, waitFn = wait) => {
  const onSubmit = wrapper.find('form').prop('onSubmit');
  return act(async () => {
    wrapper.unmount();
    await onSubmit({
      preventDefault: () => {},
    });
    await waitFn();
  });
};

it('constructs the form state from the intiial values', () => {
  const initialValues = {
    foo: 'initialFoo',
  };

  const wrapper = mount(<TestComponent initialValues={initialValues} />);

  expect(wrapper.find('input').prop('value')).toBe('initialFoo');
  expect(wrapper.find('.error').text()).toBe('');
  expect(wrapper.find('.dirtied').text()).toBe('false');
  expect(wrapper.find('.isDirty').text()).toBe('false');
  expect(wrapper.find('.hasError').text()).toBe('false');
});

it('sets the field on change', async () => {
  const initialValues = {
    foo: 'initialFoo',
  };

  const wrapper = mount(<TestComponent initialValues={initialValues} />);
  simulateChange(wrapper, 'newFoo');

  await actWait();

  expect(wrapper.find('input').prop('value')).toBe('newFoo');
  expect(wrapper.find('.error').text()).toBe('');
  expect(wrapper.find('.dirtied').text()).toBe('false');
  expect(wrapper.find('.isDirty').text()).toBe('false');
  expect(wrapper.find('.hasError').text()).toBe('false');
});

it('sets dirty on blur', async () => {
  const initialValues = {
    foo: 'initialFoo',
  };

  const wrapper = mount(<TestComponent initialValues={initialValues} />);
  simulateBlur(wrapper, 'initialFoo');

  await actWait();

  expect(wrapper.find('input').prop('value')).toBe('initialFoo');
  expect(wrapper.find('.error').text()).toBe('');
  expect(wrapper.find('.dirtied').text()).toBe('true');
  expect(wrapper.find('.isDirty').text()).toBe('true');
});

it('when invalid sets error', async () => {
  const initialValues = {
    foo: 'initialFoo',
  };
  const validate = ({ foo }) => {
    if (foo !== 'initialFoo') {
      return {
        foo: 'invalid',
      };
    }
  };

  const wrapper = mount(
    <TestComponent initialValues={initialValues} validate={validate} />
  );
  simulateChange(wrapper, 'badFoo');

  await actWait();

  expect(wrapper.find('.error').text()).toBe('invalid');
  expect(wrapper.find('.hasError').text()).toBe('true');

  simulateChange(wrapper, 'initialFoo');

  await actWait();

  expect(wrapper.find('.error').text()).toBe('');
  expect(wrapper.find('.hasError').text()).toBe('false');

  simulateChange(wrapper, 'badFoo');

  await actWait();

  expect(wrapper.find('.error').text()).toBe('invalid');
  expect(wrapper.find('.hasError').text()).toBe('true');
});

it('with async validation set the error', async () => {
  const initialValues = {
    foo: 'initialFoo',
  };
  const validate = async () => {
    await wait(1);
    return {
      foo: 'invalid',
    };
  };

  const wrapper = mount(
    <TestComponent initialValues={initialValues} validate={validate} />
  );
  simulateChange(wrapper, 'badFoo');

  await actWait(1);

  expect(wrapper.find('.error').text()).toBe('invalid');
  expect(wrapper.find('.hasError').text()).toBe('true');
});

it('with commit on change set dirties on change', async () => {
  const initialValues = {
    foo: 'initialFoo',
  };
  const options = {
    commitOnChange: true,
  };

  const wrapper = mount(
    <TestComponent initialValues={initialValues} options={options} />
  );
  simulateChange(wrapper, 'newFoo');

  await actWait();

  expect(wrapper.find('.dirtied').text()).toBe('true');
  expect(wrapper.find('.isDirty').text()).toBe('true');
});

it('calls the submit callback on submit', async () => {
  const initialValues = {
    foo: 'initialFoo',
  };
  const validate = ({ foo }) => {
    if (foo !== 'goodFoo') {
      return {
        foo: 'invalid',
      };
    }
  };
  const onSubmit = jest.fn();

  const wrapper = mount(
    <TestComponent
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    />
  );
  simulateChange(wrapper, 'badFoo');

  await simulateSubmit(wrapper);

  expect(onSubmit).not.toHaveBeenCalled();

  simulateChange(wrapper, 'goodFoo');

  await simulateSubmit(wrapper);

  expect(onSubmit).toHaveBeenCalledWith({ foo: 'goodFoo' });
});

it('with submit errors sets the error', async () => {
  const initialValues = {
    foo: 'initialFoo',
  };
  const onSubmit = ({ foo }) => {
    if (foo !== 'goodFoo') {
      return {
        foo: 'invalid',
      };
    }
  };

  const wrapper = mount(
    <TestComponent
      initialValues={initialValues}
      onSubmit={onSubmit}
    />
  );
  simulateChange(wrapper, 'badFoo');

  await simulateSubmit(wrapper);

  expect(wrapper.find('.error').text()).toBe('invalid');

  simulateChange(wrapper, 'goodFoo');

  await simulateSubmit(wrapper);

  expect(wrapper.find('.error').text()).toBe('');
});

it('with async submit sets the error', async () => {
  const initialValues = {
    foo: 'initialFoo',
  };
  const onSubmit = async () => {
    await wait(1);
    return {
      foo: 'invalid',
    };
  };

  const wrapper = mount(
    <TestComponent
      initialValues={initialValues}
      onSubmit={onSubmit}
    />
  );
  await simulateSubmit(wrapper, () => wait(1));

  expect(wrapper.find('.error').text()).toBe('invalid');
  expect(wrapper.find('.hasError').text()).toBe('true');
});

it('skips double submit', async () => {
  const initialValues = {
    foo: 'initialFoo',
  };
  const submitCallback = jest.fn(async () => {
    await wait(1);
  });

  const wrapper = mount(
    <TestComponent initialValues={initialValues} onSubmit={submitCallback} />
  );
  const onSubmit = wrapper.find('form').prop('onSubmit');

  await act(async () => {
    onSubmit({
      preventDefault: () => {},
    });
    await onSubmit({
      preventDefault: () => {},
    });
    await wait(1);
  });

  expect(submitCallback).toHaveBeenCalledTimes(1);
});

it('resets the form state', async () => {
  const TestComponent = () => {
    const [
      values,
      errors,
      dirtied,
      { handleChange, handleBlur, handleSubmit },
      { isDirty, hasError, reset },
    ] = useForm({
      foo: 'initialFoo',
    });

    return (
      <form onSubmit={handleSubmit(reset)}>
        <input
          name="foo"
          value={values.foo}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <span className="error">{errors.foo}</span>
        <span className="dirtied">{`${dirtied.foo}`}</span>
        <span className="isDirty">{`${isDirty}`}</span>
        <span className="hasError">{`${hasError}`}</span>
        <button type="submit" />
      </form>
    );
  };

  const wrapper = mount(<TestComponent />);

  simulateChange(wrapper, 'newFoo');
  simulateBlur(wrapper, 'newFoo');

  await simulateSubmit(wrapper, () => updateWrapper(wrapper));

  expect(wrapper.find('.error').text()).toBe('');
  expect(wrapper.find('.dirtied').text()).toBe('false');
  expect(wrapper.find('.isDirty').text()).toBe('false');
  expect(wrapper.find('.hasError').text()).toBe('false');
  expect(wrapper.find('input').prop('value')).toBe('initialFoo');
});

describe('when unmounted', () => {
  it('skips validate update', async () => {
    const setErrors = jest.fn();

    const TestComponent = () => {
      const [
        values,
        errors,
        /* dirtied */,
        { handleChange },
      ] = useForm({
        foo: 'initialFoo',
      }, () => ({
        foo: 'invalid',
      }));
      setErrors(errors);

      return (
        <form>
          <input
            name="foo"
            value={values.foo}
            onChange={handleChange}
          />
          <button type="submit" />
        </form>
      );
    };

    const wrapper = mount(<TestComponent />);
    simulateChange(wrapper, 'newFoo');
    wrapper.unmount();

    expect(setErrors).toHaveProperty('mock.calls', [
      [{}],
      [{}],
    ]);
  });
  it('skips submit update', async () => {
    const setSubmitting = jest.fn();

    const TestComponent = () => {
      const [
        values,
        /* errors */,
        /* dirtied */,
        { handleChange, handleSubmit },
        { submitting }
      ] = useForm({
        foo: 'initialFoo',
      });
      setSubmitting(submitting);
      const onSubmit = () => {};

      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            name="foo"
            value={values.foo}
            onChange={handleChange}
          />
          <button type="submit" />
        </form>
      );
    };

    const wrapper = mount(<TestComponent />);

    await unmountAndSubmit(wrapper);

    expect(setSubmitting).toHaveProperty('mock.calls', [
      [false],
    ]);
  });
  it('does not reset the form state', async () => {
    const setFormState = jest.fn();

    const TestComponent = () => {
      const [
        values,
        errors,
        dirtied,
        { handleChange, handleBlur, handleSubmit },
        { isDirty, hasError, reset },
      ] = useForm({
        foo: 'initialFoo',
      });
      setFormState({
        values,
        errors,
        dirtied,
        isDirty,
        hasError,
      });

      return (
        <form onSubmit={handleSubmit(reset)}>
        <input
        name="foo"
        value={values.foo}
        onChange={handleChange}
        onBlur={handleBlur}
        />
        <button type="submit" />
        </form>
      );
    };

    const wrapper = mount(<TestComponent />);

    simulateChange(wrapper, 'newFoo');
    simulateBlur(wrapper, 'newFoo');

    await unmountAndSubmit(wrapper);

    expect(setFormState).toHaveProperty('mock.calls', [
      [
        {
          values: { foo: 'initialFoo' },
          errors: {},
          dirtied: { foo: false },
          isDirty: false,
          hasError: false,
        },
      ],
      [
        {
          values: { foo: 'newFoo' },
          errors: {},
          dirtied: { foo: false },
          isDirty: false,
          hasError: false,
        },
      ],
      [
        {
          values: { foo: 'newFoo' },
          errors: {},
          dirtied: { foo: true },
          isDirty: true,
          hasError: false,
        },
      ],
    ]);
  });
});
