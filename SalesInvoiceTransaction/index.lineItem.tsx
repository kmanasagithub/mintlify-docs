import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
} from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';
import { LuChevronDownCircle } from 'react-icons/lu';
import BreadCrumb from '../../../Common/BreadCrumb';
import './index.css';
import {
  formElementsLineItem,
  formElementsLineItem2,
  formElementsLineItem3,
  formElementsLineItemTaxOvrd,
  formElementsLineItemTaxOvrd4,
  formElementsLineItemTaxOvrd5,
  formElementsLineItemTaxOvrd2,
  formElementsLineItemTaxOvrd3,
  formElements10th,
  formBuilder8th,
  radioButton,
} from './FormBuilds';
import { CustomForm } from '../FormBuilder';
import { IconText, GetAddressTemplate } from './Helper';
import { formLineItemSchema } from './Schema';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './index.redux';
import { Link } from 'react-router-dom';
import { Address } from './Helper';
import { calculateTax as onCalculateTax } from '../../../slices/thunk';
import { toast } from 'react-toastify';
import { Attribute, LineItem, Data } from './interfaces';

interface DataProps {
  data: Data | null; // Allow null for data
  onCancel: () => void; // Update onCancel to accept lineItems
}
const LineIndex = ({ data, onCancel }: DataProps) => {
  const address = useSelector((state: any) => state.address.Addresses);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showAttributesForm, setShowAttributesForm] = useState(false);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [showLineItemForm, setshowLineItemForm] = useState(false);
  const [data1, setData] = useState<Data | undefined>(undefined);
  const [error, setError] = useState<String>();
  const form1Ref: any = React.useRef<any>();
  const form2Ref: any = React.useRef<any>();
  const form3Ref: any = React.useRef<any>();
  const form4Ref: any = React.useRef<any>();
  const form5Ref: any = React.useRef<any>();
  const form6Ref: any = React.useRef<any>();
  const form7Ref: any = React.useRef<any>();
  const form8Ref: any = React.useRef<any>();
  const form9Ref: any = React.useRef<any>();
  const form10Ref: any = React.useRef<any>();
  const [refs, setRefs] = React.useState<any>({
    form1Ref: null,
    form2Ref: null,
    form3Ref: null,
    form4Ref: null,
    form5Ref: null,
    form6Ref: null,
    form7Ref: null,
    form8Ref: null,
    form9Ref: null,
    form10Ref: null,
  });
  useEffect(() => {
    setRefs({
      form1Ref: form1Ref,
      form2Ref: form2Ref,
      form3Ref: form3Ref,
      form4Ref: form4Ref,
      form5Ref: form5Ref,
      form6Ref: form6Ref,
      form7Ref: form7Ref,
      form8Ref: form8Ref,
      form9Ref: form9Ref,
      form10Ref: form10Ref,
    });
  }, []);

  const defaultFormData = {
    form7: { lineAddress: true },
    form8: { taxHandling: '' },
  };

  const [formData, setFormData] = useState(defaultFormData);
  const [responseData, setResponseData] = useState<any>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAddresses, setSelectedAddresses] = React.useState<Address[]>([
    {
      id: '1',
      sub: 'Place of order acceptance',
      lab: 'Add a place of order acceptance address',
      view: false,
    },
    {
      id: '2',
      sub: 'Place of order origin',
      lab: 'Add a place of order origin address',
      view: false,
    },
    {
      id: '3',
      sub: 'Import location',
      lab: 'Add an import location address',
      view: false,
    },
    {
      id: '4',
      sub: 'Location of goods & services rendered',
      lab: 'Add a location of goods & services rendered address',
      view: false,
    },
  ]);

  const [defaultValues, setDefaultValues] = useState({
    addressDetails: {
      address: '',
      city: 'Long Beach',
      state: 'CA',
      country: 'USA',
      zip_code: '90802',
    },
    itemDetails: {
      itemCode: '',
      itemDesc: '',
      quantity: '',
      totalAmount: '',
    },
    taxCode: {
      taxCode: '',
    },
    trafficCode: {
      trafficCode: '',
    },
    discountClc: {
      discountClc: true,
    },
    financialDetails: {
      revenueAcc: '',
      refCode1: '',
      refCode2: '',
    },
    customerDetails: {
      custExempType: '',
      custExNum: '',
      custVatNo: '',
    },
    taxHandling: {
      taxHandling: 'No special tax handling',
    },
    additionalInfo: {
      lineAddress: false,
    },
    taxOverride: {
      overrideType: '',
      override_tax: '',
      override_date: '',
      override_reason: '',
    },
    attributes: {
      attribute: '',
      value: '',
      unitOfMeasure: '',
    },
  });

  const toggleForm = () => setShowForm(!showForm);
  const toggleAttributesForm = () => setShowAttributesForm(!showAttributesForm);

  const addAttributeForm = () => {
    setAttributes([
      ...attributes,
      { attribute: '', value: '', unitOfMeasure: '' },
    ]);
  };

  const deleteAttributeForm = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const cancelAllAttributes = () => {
    setAttributes([]);
  };
  const saveAttributes = () => {};

  const handleFormChange = (formId: string, updatedValues: any) => {
    setFormData((prevData) => ({
      ...prevData,
      [formId]: updatedValues,
    }));
  };
  const dispatch = useDispatch();

  const handleSaveLineItem = async () => {
    // Collect form data
    let combinedData: any = {};
    for (const ref in refs) {
      const formData = await refs[ref]?.current?.getValues();
      combinedData = { ...combinedData, ...formData, address };
    }

    // Build the new/edited line item data
    const newLineItem: LineItem = {
      itemCode: combinedData.itemCode,
      itemDesc: combinedData.itemDesc,
      totalAmount: parseFloat(combinedData.totalAmount),
      quantity: parseInt(combinedData.quantity, 10),
      overrideType: combinedData.overrideType,
      override_tax: combinedData.override_tax || '',
      override_date: combinedData.override_date || '',
      override_reason: combinedData.override_reason || '',
      tax_was_included:
        combinedData.taxHandling === 'Tax was included' ? 'true' : 'false',
      discountClc: combinedData.discountClc,
      address: combinedData.address,
      attributes: attributes,
      taxCode: combinedData.taxCode,
      trafficCode: combinedData.trafficCode,
      taxHandling: combinedData.taxHandling,
      revenueAcc: combinedData.revenueAcc,
      refCode1: combinedData.refCode1,
      refCode2: combinedData.refCode2,
      custExempType: combinedData.custExempType,
      custExNum: combinedData.custExNum,
      custVatNo: combinedData.custVatNo,
      lineAddress: combinedData.lineAddress,
    };

    if (editingItem !== null && editingIndex !== null) {
      // Editing an existing item
      const updatedLineItems = [...lineItems];
      updatedLineItems[editingIndex] = newLineItem;
      setLineItems(updatedLineItems);
      if (data) {
        if (data.lineItems) {
          data.lineItems[editingIndex] = newLineItem; // Add only the new line item
        }
      }
      console.log('lineitems', data?.lineItems);
    } else {
      if (
        !combinedData.totalAmount
        // || (combinedData.taxHandling === 'Override the tax amount or specify a tax date that is different from the document date' && (
        //   (combinedData.overrideType === 'Tax Amount' && !combinedData.override_tax) ||
        //   !combinedData.override_reason
        // ))
      ) {
        setError('Required Data Is Missing');
        return;
      }
      setLineItems([...lineItems, newLineItem]);
      if (data) {
        if (data.lineItems) {
          data.lineItems = [...data.lineItems, newLineItem]; // Add only the new line item
        } else {
          data.lineItems = [newLineItem]; // Initialize with the new line item if empty
        }
      }
    }
    console.log('data --', data);
    // Reset form and state
    setFormData(defaultFormData);
    setAttributes([]);
    setShowForm(false);
    setShowAttributesForm(false);
    setEditingItem(null);
    setEditingIndex(null);
    setshowLineItemForm(false);

    setDefaultValues((prevValues) => ({
      ...prevValues,
      addressDetails: {
        ...prevValues.addressDetails,
        address: '',
        city: 'Long Beach',
        state: 'CA',
        country: 'USA',
        zip_code: '90802',
      },
      itemDetails: {
        ...prevValues.itemDetails,
        itemCode: '',
        itemDesc: '',
        quantity: '',
        totalAmount: '',
      },
      taxCode: {
        ...prevValues.taxCode,
        taxCode: '',
        trafficCode: '',
      },
      trafficCode: {
        ...prevValues.trafficCode,
        trafficCode: '',
      },
      discountClc: {
        ...prevValues.discountClc,
        discountClc: true,
      },
      financialDetails: {
        ...prevValues.financialDetails,
        revenueAcc: '',
        refCode1: '',
        refCode2: '',
      },
      customerDetails: {
        ...prevValues.customerDetails,
        custExempType: '',
        custExNum: '',
        custVatNo: '',
      },
      taxHandling: {
        ...prevValues.taxHandling,
        taxHandling: 'No special tax handling',
      },
      additionalInfo: {
        ...prevValues.additionalInfo,
        lineAddress: false,
      },
      taxOverride: {
        ...prevValues.taxOverride,
        overrideType: '',
        override_tax: '',
        override_date: '',
        override_reason: '',
      },
    }));
  };
  const handleDeleteLineItem = (itemCodeToDelete: string) => {
    const updatedLineItems = lineItems.filter(
      (lineItem) => lineItem.itemCode !== itemCodeToDelete
    );
    setLineItems(updatedLineItems);
    if (data && data.lineItems) {
      data.lineItems = data.lineItems.filter(
        (lineItem) => lineItem.itemCode !== itemCodeToDelete
      );
    }
  };

  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleEditLineItem = (itemCode: string) => {
    if (data && data.lineItems) {
      const dataIndex = data.lineItems.findIndex(
        (lineItem) => lineItem.itemCode === itemCode
      );

      if (dataIndex !== -1) {
        const selectedItem = data.lineItems[dataIndex];
        setEditingIndex(dataIndex);
        setEditingItem(selectedItem);
        if (selectedItem) {
          setDefaultValues((prevValues) => ({
            ...prevValues,
            addressDetails: {
              ...prevValues.addressDetails,
              address:
                selectedItem.address?.['Ship To']?.address ||
                '5678 main avenue',
              city: selectedItem.address?.['Ship To']?.city || 'Long Beach', // Default value fallback
              state: selectedItem.address?.['Ship To']?.state || 'CA',
              country: selectedItem.address?.['Ship To']?.country || 'USA',
              zip_code: selectedItem.address?.['Ship To']?.zip_code || '90802',
            },
            itemDetails: {
              ...prevValues.itemDetails,
              itemCode: selectedItem.itemCode || '',
              itemDesc: selectedItem.itemDesc || '',
              quantity: selectedItem.quantity?.toString() || '',
              totalAmount: selectedItem.totalAmount?.toString() || '',
            },
            taxCode: {
              ...prevValues.taxCode,
              taxCode: selectedItem.taxCode,
              trafficCode: selectedItem.trafficCode,
            },
            trafficCode: {
              ...prevValues.trafficCode,
              trafficCode: selectedItem.trafficCode,
            },
            discountClc: {
              ...prevValues.discountClc,
              discountClc: selectedItem.discountClc,
            },
            financialDetails: {
              ...prevValues.financialDetails,
              revenueAcc: selectedItem.revenueAcc || '',
              refCode1: selectedItem.refCode1 || '',
              refCode2: selectedItem.refCode2 || '',
            },
            customerDetails: {
              ...prevValues.customerDetails,
              custExempType: selectedItem.custExempType || '',
              custExNum: selectedItem.custExNum || '',
              custVatNo: selectedItem.custVatNo || '',
            },
            taxHandling: {
              ...prevValues.taxHandling,
              taxHandling:
                selectedItem.taxHandling || 'No special tax handling',
            },
            additionalInfo: {
              ...prevValues.additionalInfo,
              lineAddress: selectedItem.lineAddress || false,
            },
            taxOverride: {
              ...prevValues.taxOverride,
              overrideType: selectedItem.overrideType || '',
              override_tax: selectedItem.override_tax || '',
              override_date: selectedItem.override_date || '',
              override_reason: selectedItem.override_reason || '',
            },
          }));
        } else {
          console.error('No item found with the given itemCode');
        }
      }
    }
  };

  const handleAddNew = () => {
    setEditingIndex(null);
    setEditingItem(null);
    setAttributes([]);
    setshowLineItemForm(true);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditingItem(null);
    setAttributes([]);
    setShowForm(false);
    setShowAttributesForm(false);
    setshowLineItemForm(false);
    setFormData(defaultFormData);
  };

  const handleCancelLineItems = () => {
    onCancel();
  };
  const handleFinish = async () => {
    const finalData = { ...data, items: data?.lineItems };
    try {
      const response = await dispatch(onCalculateTax(finalData));
      if (
        response.payload &&
        typeof response.payload === 'string' &&
        (response.payload.includes('Sorry') ||
          response.payload.includes('Network Error'))
      ) {
        throw new Error(response.payload); // Treat it as an error and throw it
      }
      setResponseData(response.payload);
    } catch (error: any) {
      console.error('Error calculating tax:', error);
      return;
    }
  };

  return (
    <Provider store={store}>
      <Container fluid>
        <Row className="pb-4 gy-3"></Row>

        <>
          <Card>
            <Card.Header>
              <Row>
                <Col md={4}>
                  <h4>Invoice Detail</h4>
                  {data?.docuCode && (
                    <p>
                      <strong>Document Code:</strong> {data.docuCode}
                    </p>
                  )}
                  {data?.docuDate && (
                    <p>
                      <strong>Document Date:</strong> {data.docuDate}
                    </p>
                  )}
                  {data?.docuDate && (
                    <p>
                      <strong>Tax Date:</strong> {data.docuDate}
                    </p>
                  )}
                  {data?.entityCode && (
                    <p>
                      <strong>Entity:</strong> {data.entityCode}
                    </p>
                  )}
                  {data?.description && (
                    <p>
                      <strong>Description:</strong> {data.description}
                    </p>
                  )}
                </Col>

                <Col md={4}>
                  <h4>Additional Info</h4>
                  <p>
                    <strong>Exemption Applied:</strong> No
                  </p>
                  {data?.referenceCode && (
                    <p>
                      <strong>Reference Code:</strong> {data.referenceCode}
                    </p>
                  )}
                  {data?.salesPersonCode && (
                    <p>
                      <strong>Sales Person Code:</strong> {data.salesPersonCode}
                    </p>
                  )}
                  {data?.discount && (
                    <p>
                      <strong>Discount:</strong> {data.discount}
                    </p>
                  )}
                </Col>

                <Col md={4}>
                  <h4>Customer Info</h4>
                  {data?.entityCode && (
                    <p>
                      <strong>Entity Use Code:</strong> {data.entityCode}
                    </p>
                  )}
                  {data?.custCode && (
                    <p>
                      <strong>Customer Code:</strong> {data.custCode}
                    </p>
                  )}
                  {data?.custVatNo && (
                    <p>
                      <strong>Customer Vat No:</strong> {data.custVatNo}
                    </p>
                  )}
                  {data?.vendorCode && (
                    <p>
                      <strong>Vendor Code:</strong> {data.vendorCode}
                    </p>
                  )}
                  {data?.vendorVatNo && (
                    <p>
                      <strong>Vendor Vat No:</strong> {data.vendorVatNo}
                    </p>
                  )}
                </Col>
              </Row>
              <hr />
              <Row>
                {data?.address['Ship From'] && (
                  <p>
                    <strong>Ship From:</strong>{' '}
                    {/* Render main address fields */}
                    {Object.entries(data.address['Ship From'])
                      .filter(
                        ([key]) =>
                          key !== 'additionalAddresses' &&
                          key !== 'city' &&
                          key !== 'country'
                      )
                      .map(([key, value], index, array) => (
                        <span key={index}>
                          {value}
                          {index < array.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    {/* Render additional addresses */}
                    {data.address['Ship From'].additionalAddresses?.map(
                      (addAddr, addrIndex) => {
                        const additionalAddresses =
                          data.address['Ship From'].additionalAddresses;
                        return (
                          <span key={`additional-${addrIndex}`}>
                            {addrIndex === 0 ? ', ' : ''}
                            {addAddr.addr}
                            {additionalAddresses &&
                            addrIndex < additionalAddresses.length - 1
                              ? ', '
                              : ''}
                          </span>
                        );
                      }
                    )}
                    {/* Render city and country at the end */}
                    {data.address['Ship To'].city && (
                      <span>, {data.address['Ship To'].city}</span>
                    )}
                    {data.address['Ship To'].country && (
                      <span>, {data.address['Ship To'].country}</span>
                    )}
                  </p>
                )}

                {data?.address['Ship To'] && (
                  <p>
                    <strong>Ship To:</strong> {/* Render main address fields */}
                    {Object.entries(data.address['Ship To'])
                      .filter(
                        ([key]) =>
                          key !== 'additionalAddresses' &&
                          key !== 'city' &&
                          key !== 'country'
                      )
                      .map(([key, value], index, array) => (
                        <span key={index}>
                          {value}
                          {index < array.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    {/* Render additional addresses */}
                    {data.address['Ship To'].additionalAddresses?.map(
                      (addAddr, addrIndex) => {
                        const additionalAddresses =
                          data.address['Ship To'].additionalAddresses;
                        return (
                          <span key={`additional-${addrIndex}`}>
                            {addrIndex === 0 ? ', ' : ''}
                            {addAddr.addr}
                            {additionalAddresses &&
                            addrIndex < additionalAddresses.length - 1
                              ? ', '
                              : ''}
                          </span>
                        );
                      }
                    )}
                    {/* Render city and country at the end */}
                    {data.address['Ship To'].city && (
                      <span>, {data.address['Ship To'].city}</span>
                    )}
                    {data.address['Ship To'].country && (
                      <span>, {data.address['Ship To'].country}</span>
                    )}
                  </p>
                )}
              </Row>
            </Card.Header>
            <Card.Body>
              <Card>
                <Card.Header>
                  <Row>
                    <Col lg={10}>
                      <Button
                        variant="success"
                        className="btn btn-light"
                        size="sm"
                        onClick={handleAddNew}
                      >
                        Add New Item
                      </Button>
                    </Col>
                    <Col className="text-right">
                      {' '}
                      {/* Keeps button on the right */}
                      {(data?.lineItems?.length ?? 0) > 0 && (
                        <Button
                          variant="success"
                          className="btn btn-light"
                          size="sm"
                          onClick={handleFinish}
                        >
                          Calculate
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card.Header>
                {(data?.lineItems?.length ?? 0) > 0 && (
                  <>
                    <Card.Body>
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Line No</th>
                            <th>Item Code</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                            <th>Discount</th>
                            <th>Not Taxed </th>
                            <th>Taxable </th>
                            <th>Taxes/Fees</th>
                            <th>Total</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data?.lineItems.map((item: any, index: any) => {
                            const taxData =
                              responseData?.overall_tax_breakdown.find(
                                (breakdownItem: any) =>
                                  breakdownItem.itemCode === item.itemCode
                              );

                            return (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.itemCode || '-'}</td>
                                <td>{item.itemDesc || '-'}</td>
                                <td>{item.quantity || '-'}</td>
                                <td>
                                  {taxData ? (
                                    taxData.totalAmount
                                  ) : (
                                    <p>{item.totalAmount || '-'}</p>
                                  )}
                                </td>
                                <td>
                                  {taxData ? taxData.item_discount : <p>-</p>}
                                </td>
                                <td>{'-'}</td>
                                <td>
                                  {taxData ? (
                                    taxData.tax_breakdown.map(
                                      (tax: any, taxIndex: number) => (
                                        <p key={taxIndex}>
                                          {tax.taxable_amount}
                                        </p>
                                      )
                                    )
                                  ) : (
                                    <p>-</p>
                                  )}
                                </td>
                                <td>
                                  {taxData ? (
                                    taxData.tax_breakdown.map(
                                      (tax: any, taxIndex: number) => (
                                        <p key={taxIndex}>{tax.tax_amount}</p>
                                      )
                                    )
                                  ) : (
                                    <p>-</p>
                                  )}
                                </td>
                                <td className="list-inline-item">
                                  {taxData ? (
                                    taxData.item_total_amount_after_tax
                                  ) : (
                                    <p>-</p>
                                  )}
                                </td>

                                {/* Add Edit and Delete buttons */}
                                <td>
                                  <Button
                                    variant="warning"
                                    size="sm"
                                    className="list-inline-item edit btn btn-soft-info btn-sm d-inline-block" // Adds small padding
                                    onClick={() =>
                                      handleEditLineItem(item.itemCode)
                                    }
                                  >
                                    <i className="las la-pen fs-17 align-middle"></i>
                                  </Button>

                                  {'  '}
                                  <Button
                                    className="btn btn-soft-danger btn-sm d-inline-block"
                                    onClick={() =>
                                      handleDeleteLineItem(item.itemCode)
                                    }
                                  >
                                    <i className="bi bi-trash fs-17 align-middle"></i>
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </>
                )}
              </Card>
              <Button
                className="btn btn-light "
                size="sm"
                onClick={handleCancelLineItems}
              >
                Back
              </Button>
              <hr />
              {(showLineItemForm || editingItem) && (
                <div className="container-inv">
                  <CustomForm
                    ref={form1Ref}
                    elements={formElementsLineItem}
                    dir="row"
                    wid="24%"
                    schema={formLineItemSchema}
                    defaultValues={defaultValues.itemDetails}
                  />
                  <Row className="mt-5">
                    <Col md={6}>
                      <CustomForm
                        ref={form2Ref}
                        elements={formElementsLineItem2}
                        dir="column"
                        wid="80%"
                        defaultValues={defaultValues.taxCode}
                      />
                    </Col>
                    <Col md={6} className="border-start border-2">
                      <CustomForm
                        ref={form3Ref}
                        elements={formElementsLineItem3}
                        dir="column"
                        wid="80%"
                        defaultValues={defaultValues.trafficCode}
                      />
                    </Col>
                  </Row>
                  <Link to="#" onClick={toggleForm}>
                    <IconText icon={<LuChevronDownCircle />}>
                      Add additional information and tax overrides
                    </IconText>
                  </Link>
                  {showForm && (
                    <>
                      <div className="container-inv">
                        <CustomForm
                          ref={form4Ref}
                          elements={formElementsLineItemTaxOvrd}
                          dir="column"
                          wid="60%"
                          defaultValues={defaultValues.discountClc}
                        />
                      </div>
                      <div className="container-inv">
                        <CustomForm
                          ref={form5Ref}
                          elements={formElementsLineItemTaxOvrd4}
                          dir="row"
                          wid="24%"
                          defaultValues={defaultValues.financialDetails}
                        />
                      </div>
                      <h4>Line Overrides</h4>
                      <p>This Information affects only this Line of Document</p>
                      <Link to="#" onClick={toggleAttributesForm}>
                        {' '}
                        {/* Click to toggle form */}
                        <IconText icon={<LuChevronDownCircle />}>
                          Document Line attributes
                        </IconText>
                      </Link>
                      {showAttributesForm && (
                        <>
                          <div>
                            <Card>
                              <Card.Body>
                                <Card.Header>
                                  <h1>Attributes</h1>
                                </Card.Header>
                                <Card.Body>
                                  {/* If no attribute forms have been added yet */}
                                  {attributes.length === 0 ? (
                                    <h1>No Attributes Added</h1>
                                  ) : (
                                    // Render all the forms in the array
                                    attributes.map((form, index) => (
                                      <div
                                        className="container-inv"
                                        key={index}
                                      >
                                        <Row>
                                          <Col md={9}>
                                            <CustomForm
                                              ref={form6Ref}
                                              elements={formBuilder8th.build()} // Use formBuilder to generate the form
                                              dir="row"
                                              wid="24%"
                                              defaultValues={
                                                defaultValues.attributes
                                              }
                                            />
                                          </Col>
                                          <Col md={3}>
                                            {/* Delete button for each attribute form */}
                                            <li
                                              className="list-inline-item"
                                              onClick={() =>
                                                deleteAttributeForm(index)
                                              }
                                            >
                                              <Link
                                                to="#"
                                                className="btn btn-soft-danger btn-sm d-inline-block mt-3"
                                              >
                                                <i className="bi bi-trash fs-17 align-middle"></i>
                                              </Link>
                                            </li>
                                          </Col>
                                        </Row>
                                      </div>
                                    ))
                                  )}

                                  {/* Link to add a new attribute form */}
                                  <Link
                                    to="#"
                                    onClick={addAttributeForm}
                                    style={{ marginTop: '10px' }}
                                  >
                                    + Add Attribute
                                  </Link>

                                  {/* Buttons to save or cancel all attributes */}
                                  {attributes.length > 0 && (
                                    <div style={{ marginTop: '20px' }}>
                                      <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={saveAttributes}
                                        style={{ marginRight: '10px' }}
                                      >
                                        Save Attributes
                                      </Button>
                                      <Button
                                        className="btn btn-light"
                                        size="sm"
                                        onClick={cancelAllAttributes}
                                      >
                                        Cancel All
                                      </Button>
                                    </div>
                                  )}
                                </Card.Body>
                              </Card.Body>
                            </Card>
                          </div>
                        </>
                      )}
                      <hr />

                      <CustomForm
                        ref={form7Ref}
                        elements={formElementsLineItemTaxOvrd5}
                        dir="column"
                        wid="50%"
                        defaultValues={defaultValues.customerDetails}
                      />

                      <CustomForm
                        ref={form8Ref}
                        elements={formElementsLineItemTaxOvrd2}
                        dir="column"
                        wid="50%"
                        onChange={(values) => handleFormChange('form7', values)}
                        defaultValues={defaultValues.additionalInfo}
                      />
                      {formData.form7.lineAddress && (
                        <div className="sales-inv-address-grid">
                          <GetAddressTemplate
                            header="Ship From"
                            selAddr="DEFAULT"
                            defaultAdress={defaultValues.addressDetails}
                          />
                          <GetAddressTemplate
                            header="Ship To"
                            selAddr="OTHER"
                            defaultAdress={defaultValues.addressDetails}
                          />
                          {selectedAddresses
                            .filter((val: Address) => val.view === true)
                            .map((item: Address, index: number) => {
                              return (
                                <GetAddressTemplate
                                  header={item.sub}
                                  selAddr="OTHER"
                                  key={index}
                                  req={true}
                                  setSelectedAddresses={setSelectedAddresses}
                                  selectedAddresses={selectedAddresses}
                                  Address={item}
                                  defaultAdress={defaultValues.addressDetails}
                                />
                              );
                            })}
                          {selectedAddresses.filter(
                            (val: Address) => val.view === false
                          ).length > 0 ? (
                            <div className="sales-inv-box sales-inv-end-box">
                              <h2 className="h2_label">More Address Options</h2>
                              {selectedAddresses
                                .filter((val: Address) => val.view === false)
                                .map((item: any, index) => {
                                  return (
                                    <div
                                      style={{ marginBottom: '15px' }}
                                      key={index}
                                    >
                                      <h3 className="h3_label">{item.sub}</h3>
                                      <IconText icon={<FiPlus />}>
                                        <p
                                          className="linkFtext"
                                          onClick={() => {
                                            setSelectedAddresses([
                                              ...selectedAddresses.filter(
                                                (value: Address) =>
                                                  value.id !== item.id
                                              ),
                                              {
                                                id: item.id,
                                                sub: item.sub,
                                                lab: item.lab,
                                                view: true,
                                              },
                                            ]);
                                          }}
                                        >
                                          {item.lab}
                                        </p>
                                      </IconText>
                                    </div>
                                  );
                                })}
                            </div>
                          ) : null}
                        </div>
                      )}
                      <h4>Advanced Tax Handling</h4>

                      <div>
                        <CustomForm
                          ref={form9Ref}
                          elements={radioButton(data?.override_tax)}
                          dir="column"
                          wid="50%"
                          onChange={(values) =>
                            handleFormChange('form8', values)
                          }
                          defaultValues={defaultValues.taxHandling}
                        />

                        {formData.form8.taxHandling ===
                          'Override the tax amount or specify a tax date that is different from the document date' && (
                          <CustomForm
                            ref={form10Ref}
                            elements={formElements10th}
                            dir="column"
                            wid="100%"
                            defaultValues={defaultValues.taxOverride}
                          />
                        )}
                      </div>
                    </>
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleSaveLineItem}
                  >
                    {editingItem !== null ? 'Update Item' : 'Save Item'}
                  </Button>{' '}
                  <Button variant="secondary" size="sm" onClick={handleCancel}>
                    Cancel
                  </Button>
                  {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
              )}
            </Card.Body>
          </Card>
        </>
      </Container>
    </Provider>
  );
};

export default LineIndex;
