import React, { useEffect, useState } from 'react';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Col, Container, Form, Row, Button } from 'react-bootstrap';
import BreadCrumb from '../../../Common/BreadCrumb';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import {
  getEntities as onGetEntities,
  deleteEntities as onDeleteEntities,
} from '../../../slices/thunk';
import * as Yup from 'yup';
import ValidateAddress from './ValidateAddress';

const ManageEntity = () => {
  document.title = 'ADD ENTITY  | Dashboard';

  const [step, setStep] = useState('manage');
  const [isParentCompany, setIsParentCompany] = useState(false);
  const [attributes, setAttributes] = useState([{ attribute: '', value: '' }]);
  const [entityData, setEntityData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { entitiesList } = useSelector((state: any) => state.Invoice);

  useEffect(() => {
    dispatch(onGetEntities());
  }, [dispatch]);

  interface Entity {
    id: any;
    name: string;
    parent_entity_id: string | null;
  }

  const selectEntitiesList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      entitiesList: invoices.entitiesList,
    })
  );

  // const { entitiesList } = useSelector(selectEntitiesList);

  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedCompanyName, setSelectedCompanyName] = useState<string>('');

  useEffect(() => {
    dispatch(onGetEntities());
  }, [dispatch]);

  useEffect(() => {
    if (entitiesList) {
      setEntities(entitiesList);
    }
  }, [entitiesList]);

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      tax_id: '',
      doBusinessInEU: false,
      attributes: [],
      companyType: 'standalone',
      is_online_marketplace: 'false',
      parent_entity_id: null,
      taxCollection: false,
      taxCollectionSeparate: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Entity name is required'),
      phone: Yup.string().required('Phone number is required'),
      tax_id: Yup.string().required('Taxpayer ID is required'),
      companyType: Yup.string().required('Entity type is required'),
      // parent_entity_id: Yup.string().when('isParentCompany', {
      //     is: true,
      //     then: Yup.string().required('Parent entity is required'),
      // }),
    }),
    onSubmit: (values: any) => {
      const entityData = {
        ...values,
        attributes,
      };
      setEntityData(entityData);
      setStep('validate');
    },
  });

  const handleAddAttribute = () => {
    setAttributes([...attributes, { attribute: '', value: '' }]);
  };

  const handleRemoveAttribute = (index: any) => {
    const newAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(newAttributes);
  };

  const handleAttributeChange = (index: any, field: any, value: any) => {
    const newAttributes = attributes.map((attribute, i) =>
      i === index ? { ...attribute, [field]: value } : attribute
    );
    setAttributes(newAttributes);
  };

  const handleFinalSubmit = (addressData: any) => {
    const finalData = {
      ...formik.values,
      attributes,
      address: addressData,
    };
    // console.log('Final Entity Data:', finalData);
    // // Here you would typically dispatch an action to save the data
    // // For now, we'll just navigate back to the entity list
    // navigate('/entities');
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCompanyId(event.target.value as string);
    console.log(event.target.value as string);
    formik.setFieldValue('parent_entity_id', event.target.value as string);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Add entity " title="Add entity " />
          {step === 'manage' ? (
            <Row>
              <Col xl={12}>
                <Card>
                  <Card.Body>
                    <div className="p-2">
                      <h1>
                        To get started, please provide some key information
                        about your business.
                      </h1>
                      <Form onSubmit={formik.handleSubmit}>
                        <div className="mb-3 mt-4">
                          <Form.Label htmlFor="name">
                            Entity Name
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            className="form-control"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                          />
                          {formik.touched.name && formik.errors.name ? (
                            <div className="text-danger">
                              {formik.errors.name}
                            </div>
                          ) : null}
                        </div>

                        <div className="mb-3 mt-4">
                          <Form.Label htmlFor="phone">
                            Phone Number
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <input
                            id="phone"
                            name="phone"
                            type="text"
                            className="form-control"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.phone}
                          />
                          {formik.touched.phone && formik.errors.phone ? (
                            <div className="text-danger">
                              {formik.errors.phone}
                            </div>
                          ) : null}
                        </div>

                        <div className="mb-3 mt-4">
                          <Form.Label htmlFor="tax_id">
                            Taxpayer ID (EIN)
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <input
                            id="tax_id"
                            name="tax_id"
                            type="text"
                            className="form-control"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.tax_id}
                          />
                          {formik.touched.tax_id && formik.errors.tax_id ? (
                            <div className="text-danger">
                              {formik.errors.tax_id}
                            </div>
                          ) : null}
                        </div>

                        <div className="mt-4">
                          <h3>
                            To configure tax settings, please confirm if this
                            entity is standalone or under a parent entity.
                          </h3>

                          <Form.Group className="mt-3">
                            <Form.Check
                              name="isParentCompany"
                              type="checkbox"
                              onChange={() =>
                                setIsParentCompany(!isParentCompany)
                              }
                              checked={isParentCompany}
                              label="Organize this entity under a parent entity"
                            />
                          </Form.Group>

                          {isParentCompany && (
                            <div style={{ paddingLeft: '60px' }}>
                              <div className="mb-3 mt-4">
                                <Form.Label>Parent Entity</Form.Label>
                                <Form.Control
                                  as="select"
                                  onChange={handleChange}
                                  value={selectedCompanyId}
                                >
                                  <option value="">Select a entity...</option>
                                  {entitiesList.map((company: Entity) => (
                                    <option key={company.id} value={company.id}>
                                      {company.name}
                                    </option>
                                  ))}
                                </Form.Control>
                                {formik.touched.parent_entity_id &&
                                formik.errors.parent_entity_id ? (
                                  <div className="text-danger">
                                    {formik.errors.parent_entity_id}
                                  </div>
                                ) : null}
                              </div>
                              <hr />
                              <div>
                                <h3>Inherit the tax collection settings?</h3>
                              </div>

                              <p style={{ paddingLeft: '0' }}>
                                This entity can inherit the tax collection
                                settings of its parent entity. We recommend that
                                entities that file taxes together share tax
                                collection settings.
                              </p>
                              <div className="form-check">
                                <input
                                  type="checkbox"
                                  name="taxCollection"
                                  className="form-check-input"
                                  onChange={(e) => {
                                    formik.setFieldValue(
                                      'taxCollection',
                                      e.target.checked
                                    );
                                  }}
                                  checked={formik.values.taxCollection}
                                />
                                <Form.Label
                                  htmlFor="form-check-label"
                                  style={{ color: 'gray' }}
                                >
                                  Use the tax collection settings of the parent
                                  entity{' '}
                                  <span
                                    style={{
                                      color: 'red',
                                      paddingLeft: '10px',
                                    }}
                                  >
                                    Recommended
                                  </span>
                                </Form.Label>
                              </div>
                              <div className="mt-3">
                                <h3>
                                  Does this entity file returns on its own?
                                </h3>
                              </div>
                              <div className="form-check mt-3">
                                <input
                                  type="checkbox"
                                  name="taxCollectionSeparate"
                                  className="form-check-input"
                                  onChange={(e) => {
                                    formik.setFieldValue(
                                      'taxCollectionSeparate',
                                      e.target.checked
                                    );
                                  }}
                                  checked={formik.values.taxCollectionSeparate}
                                />
                                <Form.Label style={{ color: 'gray' }}>
                                  This is a separate reporting entity
                                </Form.Label>
                              </div>
                            </div>
                          )}
                        </div>
                        <hr />
                        <div className="mb-3 mt-4">
                          <h3>Is this an online marketplace?</h3>
                          <div className="form-check mt-3">
                            <input
                              type="radio"
                              name="is_online_marketplace"
                              value="true"
                              className="form-check-input"
                              onChange={formik.handleChange}
                              checked={
                                formik.values.is_online_marketplace === 'true'
                              }
                            />
                            <Form.Label style={{ color: 'gray' }}>
                              Yes, this entity is an online marketplace
                            </Form.Label>
                          </div>
                          <div className="form-check">
                            <input
                              type="radio"
                              name="is_online_marketplace"
                              value="false"
                              className="form-check-input"
                              onChange={formik.handleChange}
                              checked={
                                formik.values.is_online_marketplace === 'false'
                              }
                            />
                            <Form.Label style={{ color: 'gray' }}>
                              No, this entity is not an online marketplace
                            </Form.Label>
                          </div>
                        </div>
                        <hr />
                        <div className="hstack gap-2 justify-content-end">
                          <Button type="submit" className="btn btn-primary">
                            Next
                          </Button>
                        </div>
                      </Form>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ) : (
            <ValidateAddress
              onSubmit={handleFinalSubmit}
              entityData={entityData}
            />
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ManageEntity;
