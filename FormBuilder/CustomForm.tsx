import React, { useEffect, useMemo } from 'react';
import { useForm, Controller, UseFormReturn, Control } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Form, Button } from 'react-bootstrap';
import './index.css';
import { DevTool } from '@hookform/devtools';

interface Element {
  name: string;
  type: string;
  label: string;
  options?: Array<string> | Array<{ value: string; label: string }>; // Update this
  required: boolean;
  placeholder?: string;
  subLabel?: string;
  errorName?: string | undefined;
  onChange?: (e: any) => void;
  condition?: (formValues: any) => boolean;
}

interface CustomFormProps {
  elements: Element[];
  onSubmit?: (data: any) => void;
  dir: 'row' | 'column';
  wid: string;
  submit?: boolean;
  subBtnTxt?: string;
  schema?: undefined;
  defaultValues?: Record<string, any>;
  onChange?: (updatedValues: any) => void;
}

interface CustomFormHandle {
  triggerValidation: () => Promise<boolean>;
  getValues: () => any;
  control: Control<any, any>;
}

const CustomForm = React.forwardRef<CustomFormHandle, CustomFormProps>(
  (
    {
      elements,
      onSubmit,
      dir,
      wid,
      submit,
      subBtnTxt,
      schema = yup.object().shape({}),
      defaultValues = {},
      onChange,
    },
    ref
  ) => {
    const {
      register,
      handleSubmit,
      control,
      trigger,
      formState: { errors },
      setFocus,
      watch,
    } = useForm({
      resolver: yupResolver(schema),
      mode: 'all',
      defaultValues,
    });

    // Watch all form values
    const formValues = watch();

    // Memoize the filtered elements to prevent unnecessary re-renders
    const filteredElements = useMemo(() => {
      return elements.filter(
        (element) => !element.condition || element.condition(formValues)
      );
    }, [elements, formValues]);

    // useEffect(() => {
    //   if (onChange) {
    //     onChange(formValues);
    //   }
    // }, [onChange]);
    const handleSubmitForm = (data: any) => {
      if (onSubmit) {
        onSubmit(data);
      }
    };

    // useEffect(() => {
    //   console.log("Form Errors:", errors);
    // }, [errors]);

    React.useImperativeHandle(ref, () => ({
      triggerValidation: async () => {
        const isValid = await trigger();
        const values = control._formValues;
        return isValid;
      },
      getValues: async () => {
        const isValid = await trigger();
        const values = control._formValues;
        return values;
      },
      control: control,
    }));

    return (
      <>
        <Form onSubmit={handleSubmit(handleSubmitForm)}>
          <div
            className="flex-container "
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: dir,
            }}
          >
            {filteredElements.map((element: Element, index: number) => (
              <Form.Group
                className="mb-3 flex-item"
                controlId={element.name}
                key={index}
                style={{
                  width: wid,
                }}
              >
                <Form.Label
                  className={`${
                    element.required ? 'label-required' : ''
                  } labelF`}
                >
                  {element.label}
                </Form.Label>
                {element.subLabel && (
                  <div className="sub-labelF">{element.subLabel}</div>
                )}
                <Controller
                  name={element.name}
                  control={control}
                  defaultValue={element.type === 'checkbox' ? false : ''}
                  rules={{ required: element.required }}
                  render={({ field }): React.ReactElement => {
                    switch (element.type) {
                      case 'input':
                        return (
                          <Form.Control
                            type="text"
                            className="inputF"
                            placeholder={element.placeholder}
                            {...field}
                          />
                        );
                      case 'date':
                        return (
                          <Form.Control
                            type="date"
                            {...field}
                            className="inputF"
                          />
                        );
                      case 'dropdown':
                        return (
                          <Form.Control
                            as="select"
                            {...field}
                            className="inputF"
                          >
                            {element.options
                              ? Array.isArray(element.options)
                                ? element.options.map((option, i) => {
                                    const optionValue =
                                      typeof option === 'string'
                                        ? option
                                        : option.value;
                                    const optionLabel =
                                      typeof option === 'string'
                                        ? option
                                        : option.label;

                                    return (
                                      <option
                                        key={i}
                                        value={
                                          optionValue === 'Select country'
                                            ? ''
                                            : optionValue
                                        }
                                      >
                                        {optionLabel}
                                      </option>
                                    );
                                  })
                                : Object.entries(
                                    element.options as { [key: string]: string }
                                  ).map(([abbreviation, name], i) => (
                                    <option key={i} value={abbreviation}>
                                      {name}
                                    </option>
                                  ))
                              : null}
                          </Form.Control>
                        );

                      case 'checkbox':
                        return (
                          <Form.Check
                            type="checkbox"
                            {...field}
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                            className="inputF"
                            id={element.name}
                            label={element.label}
                          />
                        );
                      case 'textarea':
                        return (
                          <Form.Control
                            as="textarea"
                            {...field}
                            className="inputF"
                          />
                        );
                      case 'radio':
                        return (
                          <div>
                            {element.options?.map((option, i) => {
                              const optionLabel =
                                typeof option === 'string'
                                  ? option
                                  : option.label;
                              const optionValue =
                                typeof option === 'string'
                                  ? option
                                  : option.value;

                              return (
                                <Form.Check
                                  key={i}
                                  type="radio"
                                  label={optionLabel}
                                  name={field.name}
                                  value={optionValue}
                                  checked={field.value === optionValue}
                                  onChange={(e) =>
                                    field.onChange(e.target.value)
                                  }
                                  className="inputF"
                                  id={`${field.name}-${i}`}
                                />
                              );
                            })}
                          </div>
                        );

                      default:
                        return <></>;
                    }
                  }}
                />
                <div
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    color: 'red',
                  }}
                >
                  {errors[element?.name]?.message?.toString()}
                </div>
              </Form.Group>
            ))}
          </div>
          {submit && (
            <Button type="submit" size="sm">
              {subBtnTxt}
            </Button>
          )}
        </Form>
        <DevTool control={control} />
      </>
    );
  }
);

export default CustomForm;
