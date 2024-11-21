import { FormBuilder } from '../FormBuilder';
import {
  Countries,
  EntityUseCodes,
  USA_States,
  DocumentType,
  OverrideType,
  Currencies,
  Attributes,
} from '../FormBuilder/StaticData';

const formBuilder31rd = new FormBuilder().addDropdown(
  'country',
  'Country',
  Object.entries(Countries).map(([abbreviation, name]) => ({
    value: abbreviation,
    label: name,
  })),
  true,
  'Select Country'
);

const formBuilder3rd = new FormBuilder().addInput(
  'addr',
  'Address',
  false,
  'Enter Address'
);

const formBuilder4th = new FormBuilder()
  .addInput('city', 'City', false, 'Enter City')
  .addDropdown(
    'state',
    'State',
    Object.entries(USA_States).map(([abbreviation, name]) => ({
      value: abbreviation,
      label: name,
    })),
    false,
    'Select State'
  )

  .addInput('zip_code', 'ZIP/Postal Code', false, 'Enter ZIP/Postal Code');
const formBuilder5th = new FormBuilder()
  .addInput('lat', 'Latitude', false, 'Enter Latitude')
  .addInput('long', 'Longitude', false, 'Enter Longitude');

const formBuilder1st = new FormBuilder()
  .addInput('docuCode', 'Document Code', true, 'Enter Document Code')
  .addDropdown(
    'docuType',
    'Document Type',
    Object.entries(DocumentType).map(([abbreviation, name]) => ({
      value: abbreviation,
      label: name,
    })),
    true
  )
  .addDate('docuDate', 'Document Date', true)
  .addConditionalField((values) => values.docuType !== 'purchase_invoice', {
    type: 'input',
    name: 'custCode',
    label: 'Customer Code',
    required: true,
    placeholder: 'Enter Customer Code',
  })
  .addConditionalField((values) => values.docuType === 'purchase_invoice', {
    type: 'input',
    name: 'vendorCode',
    label: 'Vendor Code',
    required: true,
    placeholder: 'Enter Vendor Code',
  });

export const buildFormElements2nd = (docuType: string) => {
  const formBuilder2nd = new FormBuilder()
    .addInput(
      'discount',
      'Discount',
      false,
      'Enter Discount Amount',
      'If the invoice has been discounted, please enter an amount.'
    )
    .addInput(
      'locCode',
      'Location Code',
      false,
      'Enter Location Code',
      'You can associate a registered business location with this transaction'
    )
    .addDropdown(
      'entityCode',
      'Entity Use Code',
      Object.entries(EntityUseCodes).map(([abbreviation, name]) => ({
        value: abbreviation,
        label: name,
      })),
      false,
      'Choosing an exemption type enables AvaTax to determine exemption based on its tax rules.'
    )
    .addInput(
      'custExNum',
      'Customer Exempt Number',
      false,
      'Enter Customer Exempt Number',
      'Enter an exemption number to exempt this transaction from tax in the US.'
    )
    .addConditionalField(() => docuType === 'purchase_invoice', {
      type: 'input',
      name: 'vendorVatNo',
      label: 'Vendor VAT Number',
      required: true,
      placeholder: 'Enter Vendor VAT Number',
    })
    .addConditionalField(() => docuType !== 'purchase_invoice', {
      type: 'input',
      name: 'custVatNo',
      label: 'Customer VAT Number',
      required: false,
      placeholder: 'Enter Customer VAT Number',
    })
    .addTextarea('description', 'Description', false);

  return formBuilder2nd.build();
};

const formBuilder6th = new FormBuilder()
  .addInput('salesPersonCode', 'Sales Person Code')
  .addInput('referenceCode', 'Reference Code');

const formBuilder7th = new FormBuilder()
  .addInput(
    'purchaseOrder',
    'Purchase Order',
    false,
    '',
    'You can tie a purchase order to a single-use exemption certificate'
  )
  .addDropdown(
    'currency',
    'currency',
    Object.entries(Currencies).map(([abbreviation, name]) => ({
      value: abbreviation,
      label: name,
    }))
  );

export const formBuilder8th = new FormBuilder()
  .addDropdown(
    'attribute',
    'attribute',
    Object.entries(Attributes).map(([abbreviation, name]) => ({
      value: abbreviation,
      label: name,
    })),
    false
  )
  .addInput('value', 'value', true)
  .addInput('unitOfMeasure', 'unit of measure', true);
// .addDropdown('unitOfMeasure', 'unit of measure', [...EntityUseCodes], false)

const formBuilder9th = new FormBuilder().addCheckbox(
  'override',
  'Override the tax amount or specify a tax date that is different from the document date',
  false
);

const formBuilder10th = new FormBuilder()
  .addDropdown(
    'overrideType',
    'Override Type',
    Object.entries(OverrideType).map(([abbreviation, name]) => ({
      value: abbreviation,
      label: name,
    })),
    true
  )
  .addConditionalField((values) => values.overrideType === 'tax_amount', {
    type: 'input',
    name: 'override_tax',
    label: 'Tax Amount',
    required: true,
  })
  .addDate('override_date', 'Document Date', true)
  .addInput('override_reason', 'Override Reason', true);

const formBuilderLineItem = new FormBuilder()
  .addInput('itemCode', 'Item Code')
  .addInput('itemDesc', 'Item Description')
  .addInput('quantity', 'Quantity')
  .addInput('totalAmount', 'Total Amount', true);

const formBuilderLineItem2 = new FormBuilder().addInput(
  'taxCode',
  'Scalar Tax Code',
  false,
  '',
  'If this item has special taxability, you can assign it a tax code to ensure correct tax treatment'
);

const formBuilderLineItem3 = new FormBuilder().addInput(
  'trafficCode',
  'Harmonized tariff code',
  false,
  '',
  'This code is used for custom duty and calculations in the ship to country'
);

const formBuilderLineItemTaxOvrd = new FormBuilder().addCheckbox(
  'discountClc',
  'Include this line item in discount calculations',
  false
);

const formBuilderLineItemTaxOvrd1 = new FormBuilder()
  .addInput('itemCode', 'Item Code')
  .addInput('itemDesc', 'Item Description')
  .addInput('quantity', 'Quantity')
  .addInput('totalAmount', 'Total Amount', true);

const formBuilderLineItemTaxOvrd2 = new FormBuilder().addCheckbox(
  'lineAddress',
  'This line’s addresses are different than the addresses for the overall transaction',
  false
);

const formBuilderLineItemTaxOvrd3 = new FormBuilder().addRadioButton(
  'taxHandling',
  'Tax Handling',
  [
    'No special tax handling',
    'Tax was included',
    'Override the tax amount or specify a tax date that is different from the document date',
  ]
);
export const radioButton = (override_tax: number | undefined) => {
  const formBuilderLineItemTaxOvrd3 = new FormBuilder().addRadioButton(
    'taxHandling',
    'Tax Handling',
    override_tax
      ? ['No special tax handling', 'Tax was included']
      : [
          'No special tax handling',
          'Tax was included',
          'Override the tax amount or specify a tax date that is different from the document date',
        ]
  );
  return formBuilderLineItemTaxOvrd3.build();
};
const formBuilderLineItemTaxOvrd4 = new FormBuilder()
  .addInput('revenueAcc', 'Revenue Account')
  .addInput('refCode1', 'Reference Code 1')
  .addInput('refCode2', 'Reference Code 2');

const formBuilderLineItemTaxOvrd5 = new FormBuilder()
  .addDropdown(
    'custExempType',
    'Customer Exemption Type',
    Object.entries(EntityUseCodes).map(([abbreviation, name]) => ({
      value: abbreviation,
      label: name,
    })),
    false,
    '',
    'Choosing an exemption reason enables AvaTax to determine exemption based on its tax rules'
  )
  .addInput(
    'custExNum',
    'Customer Exempt Number',
    false,
    'Enter Customer Exempt Number',
    'Enter an exemption number to exempt this transaction from tax in the US.'
  )
  .addInput('custVatNo', 'Customer VAT Number', false);

export const formElements1st = formBuilder1st.build();

export const formElements3rd = formBuilder3rd.build();
export const formElements31rd = formBuilder31rd.build();

export const formElements4th = formBuilder4th.build();

export const formElements5th = formBuilder5th.build();

export const formElements6th = formBuilder6th.build();

export const formElements7th = formBuilder7th.build();

export const formElements9th = formBuilder9th.build();

export const formElements10th = formBuilder10th.build();

export const formElementsLineItem = formBuilderLineItem.build();

export const formElementsLineItem2 = formBuilderLineItem2.build();

export const formElementsLineItem3 = formBuilderLineItem3.build();

export const formElementsLineItemTaxOvrd = formBuilderLineItemTaxOvrd.build();

export const formElementsLineItemTaxOvrd1 = formBuilderLineItemTaxOvrd1.build();

export const formElementsLineItemTaxOvrd2 = formBuilderLineItemTaxOvrd2.build();

export const formElementsLineItemTaxOvrd3 = formBuilderLineItemTaxOvrd3.build();

export const formElementsLineItemTaxOvrd4 = formBuilderLineItemTaxOvrd4.build();

export const formElementsLineItemTaxOvrd5 = formBuilderLineItemTaxOvrd5.build();
