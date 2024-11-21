import React, { useState, useCallback, useEffect } from 'react';
import { Card, Col, Container, Row, Form, Button } from 'react-bootstrap';
import BreadCrumb from '../../../Common/BreadCrumb';
import { useFormik } from 'formik';
import { useDropzone } from 'react-dropzone';
import { countryData } from '../../../Common/data/countryState';
import { getCustomerList as onGetCustomerList } from '../../../slices/thunk';
import { getAccount as onGetAccount } from '../../../slices/thunk';
import { addExemptionCertificates as onAddExemptionCertificate } from '../../../slices/thunk';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';

// Define types
interface Customer {
  id: string;
  customer_name: string;
  customer_entity: {
    entity_id: string;
  };
}

interface PrimaryEntity {
  id: string;
  name: string;
  parent_entity_id: string | null;
  created_at: string;
  is_default: boolean;
}

interface CustomerOption {
  value: string;
  label: string;
  entityId: string;
}

interface RegionOption {
  value: string;
  label: string;
}

const regionOptions: RegionOption[] = countryData.USA.map((region) => ({
  value: region,
  label: region,
}));

const exemption_reasonOptions = [
  'Agriculture',
  'Capital Improvement',
  'Charitable/exempt Org',
  'Common Carrier',
  'Direct Mail',
  'Direct Pay',
  'Enterprise Zone',
  'Exempt By Statute',
  'Exporters',
  'Federal Gov',
  'Foreign Diplomat',
  'Industrial Prod/manufacturers',
  'Local Government',
  'Material Purchase',
  'Medical',
  'Non-resident',
  'Other/custom',
  'Prime Contractor',
  'R&D',
  'Religious Org',
  'Religious/educational Org',
  'Resale',
  'State Gov',
  'Tribal Government',
];

const certificateLabelOptions = [
  'Affidavit',
  'Auto-validation No Issues Found',
  'Certexpress Import',
  'Certexpress Public Upload',
  'Certexpress Upload',
  'Certificate Request',
  'Do Not Send To Api',
  'Drop Ship',
  'Ecommerce Upload',
  'Filled Online',
  'Filled Online Retail',
  'Filled Online Webportal',
  'Locked',
  'Multi-jurisdictional',
  'Public Wizard',
  'Retail Upload',
  'Revalidated',
];

const business_typeOptions = [
  'Education and healthcare services',
  'Accommodation and food services',
  'Retail trade',
  'Manufacturing',
  'Information technology',
  'Finance and insurance',
  'Construction',
  'Wholesale trade',
  'Transportation and warehousing',
  'Real estate and rental and leasing',
  'Professional, scientific, and technical services',
  'Administrative and support services',
  'Arts, entertainment, and recreation',
  'Agriculture, forestry, fishing, and hunting',
  'Mining, quarrying, and oil and gas extraction',
  'Utilities',
  'Public administration',
  'Other services (except public administration)',
];

const statesRequiringBusinessType = [
  'Arkansas',
  'Georgia',
  'Kansas',
  'Indiana',
  'Kentucky',
  'Michigan',
  'Minnesota',
  'Nebraska',
  'Nevada',
  'New Jersey',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Rhode Island',
  'South Dakota',
  'Tennessee',
  'Vermont',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
];

const AddCertificate = () => {
  document.title = 'Certificate | Dashboard';

  const [showPurchaseOrder, setShowPurchaseOrder] = useState(false);
  const [showOtherCustom, setShowOtherCustom] = useState(false);
  const [showBusinessType, setShowBusinessType] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [showIdFields, setShowIdFields] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [isCustomerPreSelected, setIsCustomerPreSelected] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const location = useLocation();
  const { customerId, customerName } = location.state || {};
  const [fileError, setFileError] = useState('');
  const [accountId, setAccountId] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [primaryEntity, setPrimaryEntity] = useState<PrimaryEntity | null>(
    null
  );
  const selectCustomerList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      customerList: invoices.customerList,
    })
  );

  const { customerList } = useSelector(selectCustomerList);

  const selectEntitiesList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      entitiesList: invoices.entitiesList,
    })
  );

  const { entitiesList } = useSelector(selectEntitiesList);
  // Set the primary entity based on the entities list
  useEffect(() => {
    if (entitiesList && entitiesList.length > 0) {
      const defaultEntity = entitiesList.find(
        (entity: any) => entity.is_default
      );
      if (defaultEntity) {
        setPrimaryEntity(defaultEntity);
      } else {
        setPrimaryEntity(entitiesList[0]);
      }
    } else {
      setPrimaryEntity(null);
    }
  }, [entitiesList]);

  // Filter customers based on the primary entity
  useEffect(() => {
    if (customerList && primaryEntity) {
      const filteredCustomers = customerList.filter(
        (customer: Customer) =>
          customer.customer_entity?.entity_id === primaryEntity.id
      );
      setCustomers(filteredCustomers);
      setIsLoading(false);
    } else {
      setCustomers([]);
      setIsLoading(false);
    }
  }, [customerList, primaryEntity]);

  // Fetch the account api data
  useEffect(() => {
    dispatch(onGetAccount() as any).then((accountResponse: any) => {
      const accountData = accountResponse.payload[0];
      setAccountId(accountData.id);
      formik.setFieldValue('account_id', accountData.id);
    });
  }, [dispatch]);

  useEffect(() => {
    if (customerId && customerName) {
      formik.setFieldValue('certificate_customer_name', customerName);
      setSelectedCustomerId(customerId);
      setIsCustomerPreSelected(true);
    }
  }, [customerId, customerName]);

  useEffect(() => {
    dispatch(onGetCustomerList() as any);
  }, [dispatch]);

  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);
  useEffect(() => {
    if (customers.length > 0) {
      const options = customers.map((customer: Customer) => ({
        value: customer.id,
        label: customer.customer_name,
        entityId: customer.customer_entity?.entity_id,
      }));
      setCustomerOptions(options);
    }
  }, [customers]);

  //   const customerOptions: CustomerOption[] = customerList
  //     ? customerList.map((customer: Customer) => ({
  //         value: customer.id,
  //         label: customer.customer_name,
  //          entityId: customer.customer_entity?.entity_id,
  //       }))
  //     : [];

  const formik = useFormik({
    initialValues: {
      certificate_customer_name: '',
      entity_id: '',
      customer_id: '',
      account_id: '',
      file: null,
      description: '',
      tax_type: '',
      tax_type_id: '',
      comment: '',
      is_valid: 'valid',
      effective_date: '',
      expiration_date: '',
      exemption_reason: '',
      certificate_labels: [],
      exemption_limit: false,
      state: [],
      purchase_order_number: '',
      business_type: '',
    },
    validationSchema: Yup.object({
      certificate_customer_name: Yup.string().required(
        'Customer name is required'
      ),
      file: Yup.mixed().required('Certificate file is required'),
    }),

    onSubmit: (values: any) => {
      const exemption_certificate = new FormData();
      exemption_certificate.append(
        'exemption_certificate[certificate_customer_name]',
        values.certificate_customer_name
      );
      exemption_certificate.append(
        'exemption_certificate[description]',
        values.description
      );
      exemption_certificate.append(
        'exemption_certificate[business_type]',
        values.business_type
      );
      exemption_certificate.append(
        'exemption_certificate[tax_type]',
        values.tax_type
      );
      exemption_certificate.append(
        'exemption_certificate[entity_id]',
        values.entity_id
      );
      exemption_certificate.append(
        'exemption_certificate[account_id]',
        accountId
      );
      if (values.file) {
        exemption_certificate.append(
          'exemption_certificate[file][file]',
          values.file.file
        );
        exemption_certificate.append(
          'exemption_certificate[file][name]',
          values.file.name
        );
        exemption_certificate.append(
          'exemption_certificate[file][size]',
          values.file.size
        );
        exemption_certificate.append(
          'exemption_certificate[file][type]',
          values.file.type
        );
        exemption_certificate.append(
          'exemption_certificate[file][content]',
          values.file.content
        );
      }
      exemption_certificate.append(
        'exemption_certificate[tax_type_id]',
        values.tax_type_id
      );
      exemption_certificate.append(
        'exemption_certificate[comment]',
        values.comment
      );
      exemption_certificate.append(
        'exemption_certificate[is_valid]',
        values.is_valid
      );
      exemption_certificate.append(
        'exemption_certificate[certificate_labels]',
        values.certificate_labels.map((label: any) => label.value).join(',')
      );
      exemption_certificate.append(
        'exemption_certificate[purchase_order_number]',
        values.purchase_order_number
      );
      exemption_certificate.append(
        'exemption_certificate[exemption_limit]',
        values.exemption_limit
      );
      exemption_certificate.append(
        'exemption_certificate[expiration_date]',
        values.expiration_date
      );
      exemption_certificate.append(
        'exemption_certificate[tax_exemption][customer_id]',
        selectedCustomerId
      );
      exemption_certificate.append(
        'exemption_certificate[tax_exemption][effective_date]',
        values.effective_date
      );
      exemption_certificate.append(
        'exemption_certificate[tax_exemption][exemption_reason]',
        values.exemption_reason
      );
      exemption_certificate.append(
        'exemption_certificate[external_address][state]',
        values.state.join(',')
      );
      dispatch(onAddExemptionCertificate(exemption_certificate));
      navigate('/certificates');
      formik.resetForm();
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const { name, size, type } = file;

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result?.toString().split(',')[1]; // Extract base64 content
          const fileData = {
            file,
            name,
            size,
            type,
            content: base64Data, // Add the base64 content here
          };
          formik.setFieldValue('file', fileData);
          setPreviewUrl(reader.result as string); // For previewing images
        };
        reader.readAsDataURL(file); // Read file as data URL (base64)
      }
    },
    [formik]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
    },
  });

  const handleRemoveFile = () => {
    formik.setFieldValue('file', null);
    setPreviewUrl(null);
  };

  const handleSaveValid = () => {
    formik.setFieldValue('is_valid', 'valid');
    formik.handleSubmit();
  };

  const handleSaveInvalid = () => {
    formik.setFieldValue('is_valid', 'invalid');
    formik.handleSubmit();
  };

  const handleClose = () => {
    navigate('/certificates');
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Certificate" title="Add Certificate" />
          <Row>
            <Col xl={12}>
              <Card>
                <Card.Body>
                  <Form onSubmit={formik.handleSubmit}>
                    <Row className="mt-3">
                      <Col md="6">
                        <Form.Group controlId="certificate_customer_name">
                          <Form.Label>Customers</Form.Label>
                          {isCustomerPreSelected ? (
                            <Form.Control
                              type="text"
                              value={formik.values.certificate_customer_name}
                              disabled
                            />
                          ) : (
                            <Select
                              options={customerOptions}
                              name="certificate_customer_name"
                              onChange={(
                                selectedOption: CustomerOption | null
                              ) => {
                                if (selectedOption) {
                                  formik.setFieldValue(
                                    'certificate_customer_name',
                                    selectedOption.label
                                  );
                                  setSelectedCustomerId(selectedOption.value);
                                  formik.setFieldValue(
                                    'entity_id',
                                    selectedOption.entityId
                                  );
                                } else {
                                  formik.setFieldValue(
                                    'certificate_customer_name',
                                    ''
                                  );
                                  formik.setFieldValue('entity_id', '');
                                  setSelectedCustomerId('');
                                }
                              }}
                              value={customerOptions.find(
                                (option: CustomerOption) =>
                                  option.label ===
                                  formik.values.certificate_customer_name
                              )}
                              placeholder="Search customers..."
                            />
                          )}
                        </Form.Group>
                      </Col>
                      <Col md="6">
                        {!formik.values.file ? (
                          <div
                            {...getRootProps()}
                            style={{
                              border: '2px dashed #cccccc',
                              padding: '20px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              backgroundColor: isDragActive
                                ? '#e9f7fe'
                                : '#f8f9fa',
                            }}
                          >
                            <input {...getInputProps()} />
                            {isDragActive ? (
                              <h1>Drop the certificate here...</h1>
                            ) : (
                              <p>
                                <h2>Drag and drop certificate here</h2>
                                <br />
                                Supported file formats include .pdf, .gif,
                                .jpeg, and .png
                                <br />
                                <strong>or click to select file</strong>
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="mt-3">
                            <p>Selected file: {formik.values.file.name}</p>
                            {previewUrl &&
                              formik.values.file.type.startsWith('image/') && (
                                <img
                                  src={previewUrl}
                                  alt="Preview"
                                  style={{
                                    maxWidth: '100%',
                                    maxHeight: '200px',
                                  }}
                                />
                              )}
                            <Button variant="link" onClick={handleRemoveFile}>
                              Remove file
                            </Button>
                          </div>
                        )}
                        {formik.touched.file && formik.errors.file && (
                          <div className="text-danger mt-2">
                            {formik.errors.file}
                          </div>
                        )}
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col md="6">
                        <Form.Label htmlFor="state">
                          Regions covered by this certificate
                        </Form.Label>
                        <Select<RegionOption, true>
                          className="basic-multi-select"
                          classNamePrefix="select"
                          id="state"
                          name="state"
                          options={regionOptions}
                          isMulti
                          onChange={(newValue: any, actionMeta: any) => {
                            const selectedValues = newValue.map(
                              (option: RegionOption) => option.value
                            );
                            formik.setFieldValue('state', selectedValues);
                            setSelectedRegion(selectedValues);
                            const requiresBusinessType = selectedValues.some(
                              (state: string) =>
                                statesRequiringBusinessType.includes(state)
                            );
                            setShowBusinessType(requiresBusinessType);
                          }}
                          value={formik.values.state.map((value: string) =>
                            regionOptions.find(
                              (option: RegionOption) => option.value === value
                            )
                          )}
                        />
                      </Col>

                      <Col md={6}>
                        <Form.Label htmlFor="exemption_reason">
                          Reason for the exemption
                        </Form.Label>
                        <Form.Control
                          className="form-select"
                          as="select"
                          id="exemption_reason"
                          name="exemption_reason"
                          onChange={(e) => {
                            formik.handleChange(e);
                            setShowIdFields(e.target.value !== '');
                            setShowOtherCustom(
                              e.target.value === 'Other/custom'
                            );
                          }}
                          value={formik.values.exemption_reason}
                        >
                          <option value="">Select</option>
                          {exemption_reasonOptions.map((reason) => (
                            <option key={reason} value={reason}>
                              {reason}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                    {showOtherCustom && (
                      <Row className="mt-3">
                        <Col md="6">
                          <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                              type="text"
                              id="description"
                              name="description"
                              onChange={formik.handleChange}
                              value={formik.values.description}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    )}
                    {showBusinessType && (
                      <Row className="mt-3">
                        <Col md="6">
                          <Form.Group controlId="business_type">
                            <Form.Label>Business type</Form.Label>
                            <Form.Control
                              className="form-select"
                              as="select"
                              id="business_type"
                              name="business_type"
                              onChange={formik.handleChange}
                              value={formik.values.business_type}
                            >
                              <option value="">Select</option>
                              {business_typeOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </Form.Control>
                          </Form.Group>
                        </Col>
                      </Row>
                    )}

                    {formik.values.exemption_reason && (
                      <>
                        {Array.isArray(selectedRegion) &&
                          selectedRegion.length > 0 && (
                            <Row className="mt-3">
                              {selectedRegion.map(
                                (region: string, index: number) => (
                                  <Col md="6" key={index}>
                                    <div
                                      style={{
                                        border: '2px dashed #cccccc',
                                        padding: '20px',
                                        textAlign: 'center',
                                        backgroundColor: isDragActive
                                          ? '#e9f7fe'
                                          : '#f8f9fa',
                                      }}
                                    >
                                      <Row className="mb-3">
                                        <Col>
                                          <strong>{region}</strong>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col md="6">
                                          <div>
                                            <Form.Label htmlFor="tax_type">
                                              Type of ID
                                            </Form.Label>
                                            <Form.Control
                                              as="select"
                                              id="tax_type"
                                              name="tax_type"
                                              className="form-select"
                                              onChange={formik.handleChange}
                                              onBlur={formik.handleBlur}
                                              value={formik.values.tax_type}
                                            >
                                              <option value="Tax ID Number">
                                                Tax ID Number
                                              </option>
                                              <option value="Driver’s license">
                                                Driver’s license
                                              </option>
                                              <option value="FEIN">FEIN</option>
                                              <option value="Foreign diplomat number">
                                                Foreign diplomat number
                                              </option>
                                            </Form.Control>
                                          </div>
                                        </Col>

                                        <Col md="6">
                                          <Form.Label htmlFor="tax_type_id">
                                            State-issued ID number
                                          </Form.Label>
                                          <Form.Control
                                            type="text"
                                            id="tax_type_id"
                                            name="tax_type_id"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.tax_type_id}
                                          />
                                        </Col>
                                      </Row>
                                      <div className="mt-3">
                                        <button
                                          id={`validate-tax-id-btn-${index}`}
                                          title="Validate Tax ID"
                                          className="link inline font-semibold"
                                          style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'blue',
                                          }}
                                        >
                                          <span className="md-left-sm">
                                            Verify taxpayer ID
                                          </span>
                                        </button>
                                      </div>
                                      <Row>
                                        <Col md="6">
                                          <Form.Group controlId="expiration_date">
                                            <Form.Label>
                                              Expiration Date
                                            </Form.Label>
                                            <Form.Control
                                              type="date"
                                              name="expiration_date"
                                              onChange={formik.handleChange}
                                              value={
                                                formik.values.expiration_date
                                              }
                                            />
                                          </Form.Group>
                                        </Col>
                                      </Row>
                                    </div>
                                  </Col>
                                )
                              )}
                            </Row>
                          )}
                      </>
                    )}

                    <Row className="mt-4">
                      <Col md="12">
                        <Form.Group controlId="exemption_limit">
                          <Form.Check
                            type="checkbox"
                            label="Limit this exemption to one document or purchase order"
                            name="exemption_limit"
                            onChange={(e) => {
                              formik.handleChange(e);
                              setShowPurchaseOrder(e.target.checked);
                            }}
                            checked={formik.values.exemption_limit}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    {showPurchaseOrder && (
                      <Row className="mt-3">
                        <Col md="6">
                          <Form.Group controlId="purchase_order_number">
                            <Form.Label>
                              Purchase order or invoice number
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="purchase_order_number"
                              onChange={formik.handleChange}
                              value={formik.values.purchase_order_number}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    )}

                    <Row className="mt-4">
                      <Col md="12">
                        <Form.Group controlId="comment">
                          <Form.Label onClick={() => setShowComment(true)}>
                            <span style={{ color: 'blue', cursor: 'pointer' }}>
                              + Add a comment
                            </span>
                          </Form.Label>
                          {showComment && (
                            <Form.Control
                              as="textarea"
                              name="comment"
                              onChange={formik.handleChange}
                              value={formik.values.comment}
                            />
                          )}
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mt-4">
                      <Col md={6}>
                        <Form.Label htmlFor="certificate_labels">
                          Certificate labels
                        </Form.Label>
                        <Select
                          className="basic-multi-select"
                          classNamePrefix="select"
                          id="certificate_labels"
                          name="certificate_labels"
                          isMulti
                          options={certificateLabelOptions.map((label) => ({
                            value: label,
                            label: label,
                          }))}
                          onChange={(selectedOptions: any) =>
                            formik.setFieldValue(
                              'certificate_labels',
                              selectedOptions
                            )
                          }
                          value={formik.values.certificate_labels}
                        />
                      </Col>

                      <Col md="6">
                        <Form.Group controlId="effective_date">
                          <Form.Label>Effective</Form.Label>
                          <Form.Control
                            type="date"
                            name="effective_date"
                            onChange={formik.handleChange}
                            value={formik.values.effective_date}
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <hr />
                    <Row className="mt-4">
                      <Col md="2">
                        <Button type="button" onClick={handleSaveValid}>
                          Save valid
                        </Button>
                      </Col>
                      <Col md="2">
                        <Button type="button" onClick={handleSaveInvalid}>
                          Save invalid
                        </Button>
                      </Col>
                      <Col md="2">
                        <Button
                          className="btn btn-light ml-2"
                          onClick={handleClose}
                        >
                          Close
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddCertificate;
