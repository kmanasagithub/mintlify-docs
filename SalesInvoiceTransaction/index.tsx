import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';
import { Form, Button } from 'react-bootstrap';
import { LuChevronDownCircle } from 'react-icons/lu';
import BreadCrumb from '../../../Common/BreadCrumb';
import './index.css';
import {
  formElements1st,
  buildFormElements2nd,
  formElements6th,
  formElements7th,
  formBuilder8th,
  formElements9th,
  formElements10th,
} from './FormBuilds';
import { CustomForm } from '../FormBuilder';
import { Address } from './Helper';
import { IconText, GetAddressTemplate } from './Helper';
import {
  form1Schema,
  form2Schema,
  form6Schema,
  form7Schema,
  form8Schema,
  form10Schema,
} from './Schema';
import { Provider, useSelector } from 'react-redux';
import { store } from './index.redux';
import { Link } from 'react-router-dom';
import LineIndex from './index.lineItem';
import { Attribute, LineItem, Data } from './interfaces';

type Props = {
  name: string;
};

function CIndex({ name = 'New Sales Invoice | Scalarhub' }: Props) {
  document.title = name;
  const defaultAdress = {
    address: '',
    city: 'Long Beach',
    state: 'CA',
    country: 'USA',
    zip_code: '90802',
  };

  const defaultTaxOvveride = {
    overrideType: 'Tax Ammount',
  };

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

  const address = useSelector((state: any) => state.address.Addresses);
  const [docuType, setDocuType] = useState<string>('sales_invoice');
  const [error, setError] = useState<String>();
  const [data, setData] = useState<Data | null>(null);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [formValues1st, setFormValues1st] = useState({
    docuCode: '',
    docuType: 'Sales Invoice',
    docuDate: '',
    custCode: '',
    vendorCode: '',
  });

  const [defaultValues, setDefaultValues] = useState({
    docDetails: {
      docuCode: '',
      docuType: 'Sales Invoice',
      docuDate: '',
      custCode: '',
      vendorCode: '',
    },
    CustmerDetails: {
      discount: '',
      locCode: '',
      entityCode: '',
      custExNum: '',
      custVatNo: '',
      vendorVatNo: '',
      description: '',
    },
    salesPersonDetais: {
      salesPersonCode: '',
      referenceCode: '',
    },
    orderDetails: {
      purchaseOrder: '',
      currency: '',
    },
    attributes: {
      attributes: [
        {
          attribute: '',
          value: '',
          unitOfMeasure: '',
        },
      ],
    },
    override: {
      override: false,
    },
    overrideDetails: {
      overrideType: '',
      override_tax: 0,
      override_date: '',
      override_reason: '',
    },
    address: {
      defaultAddress: {
        address: '5678 main avenue',
        city: 'Long Beach',
        state: 'CA',
        country: 'USA',
        zip_code: '90802',
        additionalAddresses: [
          {
            addr: '',
          },
        ],
      },
      'Ship From': {
        address: '5678 main avenue',
        city: 'Nevada',
        state: 'NV',
        country: 'USA',
        zip_code: '67890',
      },
      'Ship To': {
        address: '5678 main avenue',
        city: 'Long Beach',
        state: 'CA',
        country: 'USA',
        zip_code: '90802',
      },
    },
  });

  const [showLineItems, setShowLineItems] = useState(false);
  const form1Ref: any = React.useRef<any>();
  const form2Ref: any = React.useRef<any>();
  const form6Ref: any = React.useRef<any>();
  const form7Ref: any = React.useRef<any>();
  const form8Ref: any = React.useRef<any>();
  const form9Ref: any = React.useRef<any>();
  const form10Ref: any = React.useRef<any>();

  const [refs, setRefs] = React.useState<any>({
    form1Ref: null,
    form2Ref: null,
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
      form6Ref: form6Ref,
      form7Ref: form7Ref,
      form8Ref: form8Ref,
      form9Ref: form9Ref,
      form10Ref: form10Ref,
    });
  }, []);

  const handleCombinedSubmit = async () => {
    for (const ref in refs) {
      const formValid = await refs[ref]?.current?.triggerValidation();
      // if (!formValid) {
      //   return;
      // }
    }
    let combinedData: any = {};

    for (const ref in refs) {
      const formData = await refs[ref]?.current?.getValues();
      combinedData = { ...combinedData, ...formData, address, lineItems };
    }
    if (
      !combinedData.docuType ||
      !combinedData.docuCode ||
      !combinedData.docuDate ||
      (!combinedData.custCode && !combinedData.vendorCode) ||
      (combinedData.override &&
        ((combinedData.overrideType === 'Tax Amount' &&
          !combinedData.override_tax) ||
          !combinedData.override_reason))
    ) {
      setError('Required Data Is Missing');
      return;
    }
    setDefaultValues((prevValues) => ({
      ...prevValues,
      docDetails: {
        ...prevValues.docDetails,
        docuType: combinedData.docuType || prevValues.docDetails.docuType, // Update docuType
        docuCode: combinedData.docuCode || prevValues.docDetails.docuCode, // Update docuCode
        docuDate: combinedData.docuDate || prevValues.docDetails.docuDate, // Update docuDate
        custCode: combinedData.custCode || prevValues.docDetails.custCode,
        vendorCode: combinedData.vendorCode || prevValues.docDetails.vendorCode,
      },
      CustmerDetails: {
        ...prevValues.CustmerDetails,
        discount: combinedData.discount || prevValues.CustmerDetails.discount,
        locCode: combinedData.locCode || prevValues.CustmerDetails.locCode,
        entityCode:
          combinedData.entityCode || prevValues.CustmerDetails.entityCode,
        custExNum:
          combinedData.custExNum || prevValues.CustmerDetails.custExNum,
        custVatNo:
          combinedData.custVatNo || prevValues.CustmerDetails.custVatNo,
        vendorVatNo:
          combinedData.vendorVatNo || prevValues.CustmerDetails.vendorVatNo,
        description:
          combinedData.description || prevValues.CustmerDetails.description,
      },
      salesPersonDetais: {
        ...prevValues.salesPersonDetais,
        salesPersonCode:
          combinedData.salesPersonCode ||
          prevValues.salesPersonDetais.salesPersonCode,
        referenceCode:
          combinedData.referenceCode ||
          prevValues.salesPersonDetais.referenceCode,
      },
      orderDetails: {
        ...prevValues.orderDetails,
        purchaseOrder:
          combinedData.purchaseOrder || prevValues.orderDetails.purchaseOrder,
        currency: combinedData.currency || prevValues.orderDetails.currency,
      },
      attributes: {
        ...prevValues.attributes,
        attributes: combinedData.attributes || prevValues.attributes.attributes,
      },
      override: {
        ...prevValues.override,
        override: combinedData.override || prevValues.override.override,
      },
      overrideDetails: {
        ...prevValues.overrideDetails,
        overrideType:
          combinedData.overrideType || prevValues.overrideDetails.overrideType,
        override_tax:
          combinedData.override_tax || prevValues.overrideDetails.override_tax,
        override_date:
          combinedData.override_date ||
          prevValues.overrideDetails.override_date,
        override_reason:
          combinedData.override_reason ||
          prevValues.overrideDetails.override_reason,
      },
      address: {
        ...prevValues.address,
        defaultAddress: {
          ...prevValues.address.defaultAddress,
          address:
            combinedData.defaultAddress?.address ||
            prevValues.address.defaultAddress.address,
          city:
            combinedData.defaultAddress?.city ||
            prevValues.address.defaultAddress.city,
          state:
            combinedData.defaultAddress?.state ||
            prevValues.address.defaultAddress.state,
          country:
            combinedData.defaultAddress?.country ||
            prevValues.address.defaultAddress.country,
          zip_code:
            combinedData.defaultAddress?.zip_code ||
            prevValues.address.defaultAddress.zip_code,
        },
        'Ship From': {
          ...prevValues.address['Ship From'],
          address:
            combinedData['Ship From']?.address ||
            prevValues.address['Ship From'].address,
          city:
            combinedData['Ship From']?.city ||
            prevValues.address['Ship From'].city,
          state:
            combinedData['Ship From']?.state ||
            prevValues.address['Ship From'].state,
          country:
            combinedData['Ship From']?.country ||
            prevValues.address['Ship From'].country,
          zip_code:
            combinedData['Ship From']?.zip_code ||
            prevValues.address['Ship From'].zip_code,
        },
        'Ship To': {
          ...prevValues.address['Ship To'],
          address:
            combinedData['Ship To']?.address ||
            prevValues.address['Ship To'].address,
          city:
            combinedData['Ship To']?.city || prevValues.address['Ship To'].city,
          state:
            combinedData['Ship To']?.state ||
            prevValues.address['Ship To'].state,
          country:
            combinedData['Ship To']?.country ||
            prevValues.address['Ship To'].country,
          zip_code:
            combinedData['Ship To']?.zip_code ||
            prevValues.address['Ship To'].zip_code,
        },
      },
    }));
    setData(combinedData);
    setShowLineItems(true);
  };

  const [showForm, setShowForm] = useState(false); // State to track form visibility
  const [showAttributesForm, setShowAttributesForm] = useState(false); // State to track form visibility

  // Function to toggle form visibility
  const toggleForm = () => {
    setShowForm(!showForm); // Toggle form visibility on click
  };
  const toggleAttributesForm = () => {
    setShowAttributesForm(!showAttributesForm); // Toggle form visibility on click
  };

  const [attributes, setAttributes] = useState<Attribute[]>([]);

  // State to manage the list of attribute forms

  const addAttributeForm = () => {
    // Add a new empty attribute form to the array
    setAttributes([
      ...attributes,
      { attribute: '', value: '', unitOfMeasure: '' },
    ]);
  };

  // Function to delete a specific attribute form
  const deleteAttributeForm = (index: number) => {
    setAttributes(attributes.filter((_, i: any) => i !== index));
  };

  // Function to cancel all attribute forms
  const cancelAllAttributes = () => {
    setAttributes([]); // Clear the array
  };

  // Function to save all attributes
  const saveAttributes = () => {};

  const handleCancelLineItems = () => {
    setShowLineItems(false);
    setLineItems(data?.lineItems ? [...data.lineItems] : []);
  };

  const handleForm1Change = (updatedValues: any) => {
    setFormValues1st(updatedValues);
    setDocuType(updatedValues.docuType);
  };

  const [formValues, setFormValues] = useState({ override: false });
  const handleFormChange = (values: any) => {
    setFormValues(values); // Update state with new form values
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Transaction" title="New Sales Invoice" />
          <Row className="pb-4 gy-3"></Row>
          <Row>
            <Col xl="12">
              {!showLineItems ? (
                <Card>
                  <Card.Body>
                    <div className="container-inv">
                      <CustomForm
                        ref={form1Ref}
                        elements={formElements1st}
                        dir="row"
                        wid="24%"
                        schema={form1Schema}
                        defaultValues={defaultValues.docDetails}
                        onChange={handleForm1Change}
                      />
                      <br />
                      <br />
                      {/* Form 2 */}
                      <CustomForm
                        ref={form2Ref}
                        elements={buildFormElements2nd(docuType)} // Pass docuType to dynamically build Form 2
                        dir="column"
                        wid="50%"
                        schema={form2Schema}
                        defaultValues={defaultValues.CustmerDetails}
                      />

                      <hr />
                      <Link to="#" onClick={toggleForm}>
                        {' '}
                        {/* Click to toggle form */}
                        <IconText icon={<LuChevronDownCircle />}>
                          Add additional information and tax overrides
                        </IconText>
                      </Link>
                      {/* Conditionally render the form below the link */}
                      {showForm && (
                        <>
                          <div className="container-inv">
                            <CustomForm
                              ref={form6Ref}
                              elements={formElements6th}
                              dir="row"
                              wid="24%"
                              schema={form6Schema}
                              defaultValues={defaultValues.salesPersonDetais}
                            />
                          </div>
                          <div className="container-inv">
                            <CustomForm
                              ref={form7Ref}
                              elements={formElements7th}
                              dir="column"
                              wid="50%"
                              schema={form7Schema}
                              defaultValues={defaultValues.orderDetails}
                            />
                          </div>

                          <Link to="#" onClick={toggleAttributesForm}>
                            {' '}
                            {/* Click to toggle form */}
                            <IconText icon={<LuChevronDownCircle />}>
                              Document header attributes
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
                                                  ref={form8Ref}
                                                  elements={formBuilder8th.build()} // Use formBuilder to generate the form
                                                  dir="row"
                                                  wid="24%"
                                                  schema={form8Schema}
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

                          <CustomForm
                            ref={form9Ref}
                            elements={formElements9th}
                            dir="column"
                            wid="100%"
                            onChange={handleFormChange}
                            defaultValues={defaultValues.override}
                          />

                          {/* Conditionally render the second CustomForm based on checkbox value */}
                          {formValues.override && (
                            <CustomForm
                              ref={form10Ref}
                              elements={formElements10th} // Use formBuilder to generate the form
                              dir="column"
                              wid="100%"
                              defaultValues={defaultValues.overrideDetails}
                              schema={form10Schema}
                            />
                          )}
                          <hr />
                        </>
                      )}
                      <div className="sales-inv-address-grid">
                        <GetAddressTemplate
                          header="Ship From"
                          selAddr="DEFAULT"
                          defaultAdress={defaultValues.address['Ship From']}
                        />
                        <GetAddressTemplate
                          header="Ship To"
                          selAddr="OTHER"
                          defaultAdress={defaultValues.address['Ship To']}
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
                                defaultAdress={defaultAdress}
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
                      <hr />
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          width: '25%',
                        }}
                      >
                        <Button
                          className="btn btn-primary"
                          onClick={() => handleCombinedSubmit()}
                          size="sm"
                        >
                          Save and add line detail
                        </Button>
                        <Button className="btn btn-light" size="sm">
                          Cancel
                        </Button>
                      </div>
                      {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                  </Card.Body>
                </Card>
              ) : (
                <div>
                  <div>
                    {data ? (
                      <LineIndex data={data} onCancel={handleCancelLineItems} />
                    ) : (
                      <p>Loading or no data available</p>
                    )}
                  </div>
                </div>
              )}

              <Card>
                <Card.Body>
                  <div style={{ width: '60%' }}>
                    <h2>Document Status</h2>
                    <p>
                      Only committed transactions are included on tax returns.
                      Transactions become locked and can’t be edited once
                      they’ve been reported on a filed return.
                    </p>
                    <h3>Document Status</h3>
                    <div className="dropdown" style={{ width: '200px' }}>
                      <Form.Select>
                        <option value="option1">Committed</option>
                        <option value="option2">Uncommitted</option>
                      </Form.Select>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '23%',
                        marginTop: '20px',
                      }}
                    >
                      <Row>
                        <Col md="6">
                          {' '}
                          <Button
                            size="sm"
                            className="btn btn-primary"
                            disabled={true}
                          >
                            Save
                          </Button>
                        </Col>
                        <Col md="6">
                          <Link to="/transaction-list">
                            <Button className="btn btn-light" size="sm">
                              Cancel
                            </Button>
                          </Link>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

function Index() {
  return (
    <Provider store={store}>
      <CIndex name="New Sales Invoice | Scalarhub" />
    </Provider>
  );
}

export default Index;
