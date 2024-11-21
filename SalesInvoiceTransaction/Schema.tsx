import * as yup from 'yup';
import {
  Countries,
  EntityUseCodes,
  USA_States,
  DocumentType,
  Currencies,
  Attributes,
  OverrideType,
} from '../FormBuilder/StaticData';
export const form1Schema = yup
  .object()
  .shape({
    docuType: yup
      .mixed()
      .test(
        'is-valid',
        'Invalid Document Type',
        (value: any) =>
          (Object.keys(DocumentType) as string[]).includes(value) ||
          (Object.values(DocumentType) as string[]).includes(value)
      )
      .required('Document type is required'),
    docuCode: yup
      .string()
      .test('is-valid', 'Document Code must be alphanumeric', (value: any) => {
        return /^[a-zA-Z0-9]*$/.test(value);
      })
      .required('Document Code is required'),
    docuDate: yup.string().required('date is required'),
    custCode: yup
      .string()
      .test('is-valid', 'Customer Code must be alphanumeric', (value: any) => {
        return /^[a-zA-Z0-9]*$/.test(value);
      })
      .required('customer code is required'),
    vendorCode: yup
      .string()
      .test('is-valid', 'Vendor Code must be alphanumeric', (value: any) => {
        return /^[a-zA-Z0-9]*$/.test(value);
      })
      .required('Vendor code is required'),
  })
  .required();

export const form2Schema = yup.object().shape({
  discount: yup.string().test('is-valid', 'Must be a number', (value: any) => {
    return /^[0-9]*$/.test(value);
  }),
  locCode: yup
    .string()
    .test('is-valid', 'Location Code must be alphanumeric', (value: any) => {
      return /^[a-zA-Z0-9]*$/.test(value);
    }),
  ntityCode: yup
    .string()
    .test('is-valid', 'Invalid Document Type', (value: any) =>
      (Object.keys(EntityUseCodes) as string[]).includes(value)
    ),
  custExNum: yup.string().test('is-valid', 'Must be a number', (value: any) => {
    return /^[0-9]*$/.test(value);
  }),
  custVatNo: yup.string().test('is-valid', 'Must be a number', (value: any) => {
    return /^[0-9]*$/.test(value);
  }),
  description: yup.string(),
});

export const form6Schema = yup.object().shape({
  salesPersonCode: yup
    .string()
    .test(
      'is-valid',
      'sales Person Code must be alphanumeric',
      (value: any) => {
        return /^^[a-zA-Z0-9]*$/.test(value);
      }
    ),
  referenceCode: yup
    .string()
    .test('is-valid', 'Reference Code must be alphanumeric', (value: any) => {
      return /^[a-zA-Z0-9]*$/.test(value);
    }),
});

export const form7Schema = yup.object().shape({
  purchaseOrder: yup
    .string()
    .test('is-valid', 'Purchase Code must be alphanumeric', (value: any) => {
      return /^[a-zA-Z0-9]*$/.test(value);
    }),
  currency: yup
    .mixed()
    .test('is-valid', 'Invalid Currency Type', (value: any) =>
      (Object.keys(Currencies) as string[]).includes(value)
    ),
});

export const form8Schema = yup.object().shape({
  attribute: yup
    .string()
    .test('is-valid', 'Invalid attribute type', (value: any) =>
      (Object.keys(Attributes) as string[]).includes(value)
    ),
  value: yup.string(),
  unitOfMeasure: yup
    .string()
    .test('is-valid', 'Invalid unit of measure', (value: any) =>
      (Object.keys(EntityUseCodes) as string[]).includes(value)
    ),
});

export const form10Schema = yup
  .object()
  .shape({
    overrideType: yup
      .mixed()
      .test(
        'is-valid',
        'Invalid ovrride type Type',
        (value: any) =>
          (Object.keys(OverrideType) as string[]).includes(value) ||
          (Object.values(OverrideType) as string[]).includes(value)
      )
      .required('Override type is required'),
    override_tax: yup
      .string()
      .test('is-valid', 'Must be a number', (value: any) => {
        return /^[0-9]*$/.test(value);
      })
      .required('Tax amount is required'),
    override_date: yup.string().required('date is required'),
    override_reason: yup.string().required('Override reason is required'),
  })
  .required();

export const form3Schema = yup.object().shape({
  country: yup
    .string()
    .test('is-valid', 'Invalid Country', (value: any) =>
      (Object.keys(Countries) as string[]).includes(value)
    )
    .required(),
});
export const form4Schema = yup.object().shape({
  city: yup.string().required(),
  state: yup
    .string()
    .test('is-valid', 'Invalid State', (value: any) =>
      (Object.keys(USA_States) as string[]).includes(value)
    )
    .required(),
  zip_code: yup
    .string()
    .test('is-valid', 'Must be a number', (value: any) => {
      return /^[0-9]*$/.test(value);
    })
    .required(),
});
export const form5Schema = yup.object().shape({
  lat: yup.string().required(),
  long: yup.string().required(),
});

export const formLineItemSchema = yup
  .object()
  .shape({
    itemCode: yup
      .string()
      .test('is-valid', 'Item Code must be alphanumeric', (value: any) => {
        return /^[a-zA-Z0-9]*$/.test(value);
      }),
    quantity: yup
      .string()
      .test('is-valid', 'Must be a number', (value: any) => {
        return /^[0-9]*$/.test(value);
      }),
    totalAmount: yup
      .string()
      .test('is-valid', 'Must be a number', (value: any) => {
        return /^[0-9]*$/.test(value);
      })
      .required('Amount is required'),
  })
  .required();
