interface FormElement {
  type: 'input' | 'date' | 'dropdown' | 'checkbox' | 'textarea' | 'radio';
  name: string;
  label: string;
  options?: Array<string> | Array<{ value: string; label: string }>; // Update this
  required: boolean;
  placeholder?: string;
  subLabel?: string;
  errorName?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  condition?: (formValues: any) => boolean;
}

export class FormBuilder {
  private elements: FormElement[];

  constructor() {
    this.elements = [];
  }

  addInput(
    name: string,
    label: string,
    required: boolean = false,
    placeholder: string = '',
    subLabel?: string,
    errorName?: string,
    condition?: (formValues: any) => boolean
  ): FormBuilder {
    this.elements.push({
      type: 'input',
      name,
      label,
      required,
      placeholder,
      subLabel,
      errorName,
      condition,
    });
    return this;
  }

  addConditionalField(
    condition: (formValues: any) => boolean,
    field: FormElement
  ): FormBuilder {
    this.elements.push({
      ...field,
      condition,
    });
    return this;
  }

  addDate(
    name: string,
    label: string,
    required: boolean = false,
    placeholder: string = '',
    subLabel?: string
  ): FormBuilder {
    this.elements.push({
      type: 'date',
      name,
      label,
      required,
      placeholder,
      subLabel,
    });
    return this;
  }

  addDropdown(
    name: string,
    label: string,
    options: Array<{ value: string; label: string }>,
    required: boolean = false,
    placeholder: string = '',
    subLabel?: string,
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  ): FormBuilder {
    this.elements.push({
      type: 'dropdown',
      name,
      label,
      options,
      required,
      placeholder,
      subLabel,
      onChange,
    });
    return this;
  }

  addCheckbox(
    name: string,
    label: string,
    required: boolean = false,
    placeholder: string = '',
    subLabel?: string
  ): FormBuilder {
    this.elements.push({
      type: 'checkbox',
      name,
      label,
      required,
      placeholder,
      subLabel,
    });
    return this;
  }

  addTextarea(
    name: string,
    label: string,
    required: boolean = false,
    placeholder: string = '',
    subLabel?: string
  ): FormBuilder {
    this.elements.push({
      type: 'textarea',
      name,
      label,
      required,
      placeholder,
      subLabel,
    });
    return this;
  }

  addRadioButton(
    name: string,
    label: string,
    options: string[], // radio buttons need options
    required: boolean = false,
    subLabel?: string
  ): FormBuilder {
    this.elements.push({
      type: 'radio',
      name,
      label,
      options,
      required,
      subLabel,
    });
    return this;
  }

  build(): FormElement[] {
    return this.elements;
  }
}
