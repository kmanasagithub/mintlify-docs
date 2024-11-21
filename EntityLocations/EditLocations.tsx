import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import {
  Card,
  Col,
  Container,
  Row,
  Button,
  Form,
  Modal,
} from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import BreadCrumb from '../../../Common/BreadCrumb';
import { editEntitiesLocations as oneditEntitiesLocations } from '../../../slices/thunk';
import { countryData } from '../../../Common/data/countryState';
import { attributeData } from '../../../Common/data/location';
type CountryStateData = {
  USA: string[];
  Canada: string[];
  Australia: string[];
};

const countryStateData = {
  USA: countryData.USA,
  Canada: countryData.Canada,
  Australia: countryData.Australia,
  // Add more countries and regions here
};

interface locationEditProps {
  onCancel: () => void;
  edit: any;
}

interface AttributeOption {
  name: string;
  values: string[];
  unitOfMeasure?: string[];
}

const attributeOptions: AttributeOption[] = attributeData;

interface Attribute {
  attribute_name: string;
  attribute_value: string;
  attribute_unit_of_measure: string;
}
const EditLocations = ({ onCancel, edit }: locationEditProps) => {
  const [states, setStates] = React.useState<string[]>([]);
  const [isMarketPlaceSelect, setIsMarketPlaceSelect] = useState(false);
  const [isEntitySellOutsideUsa, setIsEntitySellOutsideUsa] = useState(false);
  const [location, setlocation] = useState<any>();
  const [isSalesPerson, setIsSalesPerson] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    location_code: Yup.string().required('Required'),
    address_type_id: Yup.string().required('Required'),
    address_category_id: Yup.string().test({
      name: 'addressCategoryIdRequired',
      test: (value: any, context: any) => {
        const { address_type_id } = context.parent;
        if (address_type_id === 'marketplace') {
          return true;
        }
        if (address_type_id === 'salesperson') {
          return value === 'salesperson';
        }
        return value !== undefined && value.trim().length > 0;
      },
      message: 'address_category_id is required for this type',
    }),
    country: Yup.string().test({
      name: 'countryRequired',
      test: (value: any, context: any) => {
        return (
          context.parent.address_type_id === 'marketplace' ||
          (value !== undefined && value.length > 0)
        );
      },
      message: 'Required',
    }),
    line1: Yup.string().test({
      name: 'addressRequired',
      test: (value: any, context: any) => {
        return (
          context.parent.address_type_id === 'marketplace' ||
          (value !== undefined && value.length > 0)
        );
      },
      message: 'Required',
    }),
    city: Yup.string().test({
      name: 'cityRequired',
      test: (value: any, context: any) => {
        return (
          context.parent.address_type_id === 'marketplace' ||
          (value !== undefined && value.length > 0)
        );
      },
      message: 'Required',
    }),
    region: Yup.string().test({
      name: 'regionRequired',
      test: (value: any, context: any) => {
        return (
          context.parent.address_type_id === 'marketplace' ||
          (value !== undefined && value.length > 0)
        );
      },
      message: 'Required',
    }),
    postal_code: Yup.string().test({
      name: 'postalCodeRequired',
      test: (value: any, context: any) => {
        return (
          context.parent.address_type_id === 'marketplace' ||
          (value !== undefined && value.length > 0)
        );
      },
      message: 'Required',
    }),
    start_date: Yup.string().required('Required'),
    end_date: Yup.string(),
    is_marketplace_remit_tax: Yup.string(),
    location_attributes: Yup.array().of(
      Yup.object().shape({
        attribute_name: Yup.string(),
        attribute_value: Yup.string().test({
          name: 'attributeValueRequired',
          test: function (value: any) {
            const { attribute_name } = this.parent;
            return !attribute_name || (value && value.length > 0);
          },
          message: 'Attribute value is required if attribute name is provided',
        }),
        attribute_unit_of_measure: Yup.string().test({
          name: 'attributeUnitOfMeasureRequired',
          test: function (value: any) {
            const { attribute_name } = this.parent;
            return (
              attribute_name !== 'Number of units for rent' ||
              (value && value.length > 0)
            );
          },
          message: 'Unit of Measure is required ',
        }),
      })
    ),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (edit && edit.id) || '',
      location_code: (edit && edit.location_code) || '',
      friendly_name: (edit && edit.friendly_name) || '',
      address_type_id: (edit && edit.address_type_id) || '',
      address_category_id: (edit && edit.address_category_id) || '',
      isPrimaryAddress: (edit && edit.isPrimaryAddress) || '',
      country: (edit && edit.country) || '',
      line1: (edit && edit.line1) || '',
      city: (edit && edit.city) || '',
      region: (edit && edit.region) || '',
      postal_code: (edit && edit.postal_code) || '',
      start_date: (edit && edit.start_date) || '',
      end_date: (edit && edit.end_date) || '',
      is_marketplace_outside_usa:
        (edit && edit.is_marketplace_outside_usa) || '',
      is_marketplace_remit_tax: (edit && edit.is_marketplace_remit_tax) || '',
      location_attributes: (edit && edit.location_attributes) || [
        {
          attribute_name: '',
          attribute_value: '',
          attribute_unit_of_measure: '',
        },
      ],
    },
    validationSchema,

    onSubmit: async (values: any) => {
      try {
        // await validationSchema.validate(values, { abortEarly: false });
        const transformedValues = {
          location: values, // Directly use the form values
        };

        dispatch(oneditEntitiesLocations(transformedValues));
        onCancel();
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors: { [key: string]: string } = {};
          err.inner.forEach((error: any) => {
            if (error.path) {
              errors[error.path] = error.message;
              console.log(error.message);
            }
          });
          formik.setErrors(errors);
        }
      }
    },
  });
  useEffect(() => {
    if (formik.values.address_type_id === 'marketplace') {
      setIsMarketPlaceSelect(true);

      setIsSalesPerson(false);
    } else if (formik.values.address_type_id === 'salesperson') {
      setIsMarketPlaceSelect(false);
      setIsSalesPerson(true);
    } else {
      setIsMarketPlaceSelect(false);
      setIsSalesPerson(false);
    }
  }, [formik.values.address_type_id]);

  useEffect(() => {
    if (formik.values.country) {
      setStates(
        countryStateData[formik.values.country as keyof CountryStateData] || []
      );
    }
  }, [formik.values.country]);

  const handleCountryChange = (event: React.ChangeEvent<HTMLElement>) => {
    const target = event.target as HTMLSelectElement;
    const selectedCountry = target.value as keyof CountryStateData;
    formik.handleChange(event);
    setStates(countryStateData[selectedCountry] || []);
    formik.setFieldValue('region', '');
  };

  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedType = event.target.value as string;
    formik.handleChange(event);

    if (selectedType === 'salesperson') {
      formik.setFieldValue('address_category_id', 'salesperson');
      setIsMarketPlaceSelect(false);
      setIsSalesPerson(true);
    } else if (selectedType === 'marketplace') {
      formik.setFieldValue('address_category_id', 'other');
      setIsMarketPlaceSelect(true);
      setIsSalesPerson(false);

      // Preserve these values instead of resetting them
      // formik.setFieldValue('country', '');
      // formik.setFieldValue('line1', '');
      // formik.setFieldValue('city', '');
      // formik.setFieldValue('region', '');
      // formik.setFieldValue('postal_code', '');
    } else {
      setIsMarketPlaceSelect(false);
      setIsSalesPerson(false);
    }
  };

  const handleAddAttribute = () => {
    formik.setFieldValue('location_attributes', [
      ...formik.values.location_attributes,
      {
        attribute_name: '',
        attribute_value: '',
        attribute_unit_of_measure: '',
      },
    ]);
  };

  const handleAttributeChange = (
    index: number,
    field: keyof Attribute,
    value: string
  ) => {
    const newAttributes = formik.values.location_attributes.map(
      (attr: any, i: any) => {
        if (i === index) {
          // Create a new object with the updated field
          return { ...attr, [field]: value };
        }
        return attr;
      }
    );
    formik.setFieldValue('location_attributes', newAttributes);
  };

  const handleRemoveAttribute = (index: number) => {
    const newAttributes = formik.values.location_attributes.filter(
      (_: any, i: any) => i !== index
    );
    formik.setFieldValue('location_attributes', newAttributes);
  };

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body>
              <Form onSubmit={formik.handleSubmit}>
                <div className="flex items-center space-x-4"></div>
                <br />

                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label htmlFor="location_code">
                        Location Code
                      </Form.Label>
                      <Form.Control
                        id="location_code"
                        name="location_code"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.location_code}
                        isInvalid={
                          formik.touched.location_code &&
                          !!formik.errors.location_code
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.location_code}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label htmlFor="friendly_name">
                        Friendly Name
                      </Form.Label>
                      <Form.Control
                        id="friendly_name"
                        name="friendly_name"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.friendly_name}
                        isInvalid={
                          formik.touched.friendly_name &&
                          !!formik.errors.friendly_name
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.friendly_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label htmlFor="address_type_id">Type</Form.Label>
                      <Form.Control
                        className="form-select"
                        as="select"
                        id="address_type_id"
                        name="address_type_id"
                        onChange={handleTypeChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.address_type_id}
                        isInvalid={
                          formik.touched.address_type_id &&
                          !!formik.errors.address_type_id
                        }
                      >
                        <option value="location">Location</option>
                        <option value="salesperson">Salesperson</option>
                        <option value="marketplace">Marketplace</option>
                        {/* <option value="Marketplace">Marketplace</option> */}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.address_type_id}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                {!isMarketPlaceSelect ? (
                  <>
                    {!isSalesPerson && (
                      <>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label htmlFor="address_category_id">
                              Category
                            </Form.Label>
                            <Form.Control
                              className="form-select"
                              as="select"
                              id="address_category_id"
                              name="address_category_id"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.address_category_id}
                              isInvalid={
                                formik.touched.address_category_id &&
                                !!formik.errors.address_category_id
                              }
                            >
                              <option value="">Select category</option>
                              <option value="storefront">Storefront</option>
                              <option value="main_office">Main office</option>
                              <option value="warehouse">Warehouse</option>
                              <option value="other">Other</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.address_category_id}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </>
                    )}

                    <hr />
                    <Row className="mt-4">
                      <h3>Address</h3>
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label htmlFor="country">
                            Country / Territory
                          </Form.Label>
                          <Form.Control
                            as="select"
                            id="country"
                            name="country"
                            onChange={handleCountryChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.country}
                            isInvalid={
                              formik.touched.country && !!formik.errors.country
                            }
                          >
                            <option value="">Select country</option>
                            {Object.keys(countryStateData).map((country) => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.country}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label htmlFor="line1">Address</Form.Label>
                          <Form.Control
                            id="line1"
                            name="line1"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.line1}
                            isInvalid={
                              formik.touched.line1 && !!formik.errors.line1
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.line1}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label htmlFor="city">City</Form.Label>
                          <Form.Control
                            id="city"
                            name="city"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.city}
                            isInvalid={
                              formik.touched.city && !!formik.errors.city
                            }
                          />
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.city}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group>
                          <Form.Label htmlFor="region">
                            State OR Territory
                          </Form.Label>
                          <Form.Control
                            className="form-select"
                            as="select"
                            id="region"
                            name="region"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.region}
                            isInvalid={
                              formik.touched.region && !!formik.errors.region
                            }
                          >
                            <option value="">Select state or territory</option>
                            {states.map((region) => (
                              <option key={region} value={region}>
                                {region}
                              </option>
                            ))}
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.region}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mt-3">
                      <Form.Label htmlFor="postal_code">
                        Zip/Postal Code
                      </Form.Label>
                      <Form.Control
                        id="postal_code"
                        name="postal_code"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.postal_code}
                        isInvalid={
                          formik.touched.postal_code &&
                          !!formik.errors.postal_code
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.postal_code}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <br />

                    <Button className="btn btn-light" type="button">
                      Validate address
                    </Button>
                  </>
                ) : (
                  <>
                    <hr />
                    <h1>Marketplace</h1>
                    <div className="mt-4">
                      <Form.Group className="mt-3">
                        <Form.Check
                          name="is_marketplace_outside_usa"
                          type="checkbox"
                          onChange={(e) => {
                            formik.setFieldValue(
                              'is_marketplace_outside_usa',
                              e.target.checked ? 'true' : 'false'
                            );
                            setIsEntitySellOutsideUsa(e.target.checked);
                          }}
                          checked={
                            formik.values.is_marketplace_outside_usa === 'true'
                          }
                          label="This entity sells exclusively outside the U.S. and Canada."
                        />
                      </Form.Group>

                      {!isEntitySellOutsideUsa && (
                        <div style={{ paddingLeft: '0px' }}>
                          <div className="mb-3 mt-4">
                            {/* {formik.touched.parent_entity_id && formik.errors.parent_entity_id ? (
                                                                    // <div className="text-danger">{formik.errors.parent_entity_id}</div>
                                                                ) : null} */}
                          </div>

                          <div>
                            <h3>Marketplace transactions</h3>
                          </div>

                          <p style={{ paddingLeft: '0' }}>
                            This location is an online marketplace. Use the
                            location code when you import marketplace
                            transactions, or when you set up a rule for the
                            marketplace.
                          </p>
                          <div className="form-check">
                            <div className="mb-3 mt-4">
                              <h3>Returns for this location</h3>
                              <h5>
                                Select how this marketplace handles sales tax
                              </h5>
                              <div className="form-check mt-3">
                                <input
                                  type="radio"
                                  name="is_marketplace_remit_tax"
                                  value="true"
                                  className="form-check-input"
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.is_marketplace_remit_tax ===
                                    'true'
                                  }
                                />
                                <Form.Label style={{ color: 'gray' }}>
                                  As the seller, we remit tax on sales
                                </Form.Label>
                              </div>
                              <div className="form-check">
                                <input
                                  type="radio"
                                  name="is_marketplace_remit_tax"
                                  value="false"
                                  className="form-check-input"
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.is_marketplace_remit_tax ===
                                    'false'
                                  }
                                />
                                <Form.Label style={{ color: 'gray' }}>
                                  The marketplace remits sales tax
                                </Form.Label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <hr />
                <h4>Business activity at this location</h4>

                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label htmlFor="start_date">Effective</Form.Label>
                      <Form.Control
                        id="start_date"
                        name="start_date"
                        type="date"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.start_date}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label htmlFor="end_date">Expiration</Form.Label>
                      <Form.Control
                        id="end_date"
                        name="end_date"
                        type="date"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.end_date}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h4 className="mt-3">Attributes</h4>
                {formik.values.location_attributes.map(
                  (attribute: any, index: any) => (
                    <Row key={index} className="mb-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Control
                            as="select"
                            name={`location_attributes[${index}].attribute_name`}
                            value={attribute.attribute_name}
                            onChange={(e) =>
                              handleAttributeChange(
                                index,
                                'attribute_name',
                                e.target.value
                              )
                            }
                            isInvalid={
                              formik.touched.location_attributes?.[index]
                                ?.attribute_name &&
                              formik.errors.location_attributes?.[index]
                                ?.attribute_name
                            }
                          >
                            <option value="">Select an attribute</option>
                            {attributeOptions.map((option) => (
                              <option key={option.name} value={option.name}>
                                {option.name}
                              </option>
                            ))}
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {
                              formik.errors.location_attributes?.[index]
                                ?.attribute_name
                            }
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          {attribute.attribute_name ===
                            'Number of units for rent' ||
                          attribute.attribute_name === 'Iossregno' ? (
                            <Form.Control
                              type="text"
                              name={`location_attributes[${index}].attribute_value`}
                              value={attribute.attribute_value}
                              onChange={(e) =>
                                handleAttributeChange(
                                  index,
                                  'attribute_value',
                                  e.target.value
                                )
                              }
                              isInvalid={
                                formik.touched.location_attributes?.[index]
                                  ?.attribute_value &&
                                formik.errors.location_attributes?.[index]
                                  ?.attribute_value
                              }
                            />
                          ) : (
                            <Form.Control
                              as="select"
                              name={`location_attributes[${index}].attribute_value`}
                              value={attribute.attribute_value}
                              onChange={(e) =>
                                handleAttributeChange(
                                  index,
                                  'attribute_value',
                                  e.target.value
                                )
                              }
                              isInvalid={
                                formik.touched.location_attributes?.[index]
                                  ?.attribute_value &&
                                formik.errors.location_attributes?.[index]
                                  ?.attribute_value
                              }
                            >
                              <option value="">Select a value</option>
                              {attributeOptions
                                .find(
                                  (option) =>
                                    option.name === attribute.attribute_name
                                )
                                ?.values.map((value) => (
                                  <option key={value} value={value}>
                                    {value}
                                  </option>
                                ))}
                            </Form.Control>
                          )}
                          <Form.Control.Feedback type="invalid">
                            {
                              formik.errors.location_attributes?.[index]
                                ?.attribute_value
                            }
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          {attributeOptions.find(
                            (option) => option.name === attribute.attribute_name
                          )?.unitOfMeasure && (
                            <>
                              <Form.Control
                                as="select"
                                name={`location_attributes[${index}].attribute_unit_of_measure`}
                                value={attribute.attribute_unit_of_measure}
                                onChange={(e) =>
                                  handleAttributeChange(
                                    index,
                                    'attribute_unit_of_measure',
                                    e.target.value
                                  )
                                }
                                isInvalid={
                                  formik.touched.location_attributes?.[index]
                                    ?.attribute_unit_of_measure &&
                                  formik.errors.location_attributes?.[index]
                                    ?.attribute_unit_of_measure
                                }
                              >
                                <option value="">
                                  Select a unit of measure
                                </option>
                                {attributeOptions
                                  .find(
                                    (option) =>
                                      option.name === attribute.attribute_name
                                  )
                                  ?.unitOfMeasure?.map((unit) => (
                                    <option key={unit} value={unit}>
                                      {unit}
                                    </option>
                                  ))}
                              </Form.Control>
                              <Form.Control.Feedback type="invalid">
                                {
                                  formik.errors.location_attributes?.[index]
                                    ?.attribute_unit_of_measure
                                }
                              </Form.Control.Feedback>
                            </>
                          )}
                        </Form.Group>
                        <li
                          className="list-inline-item"
                          onClick={() => handleRemoveAttribute(index)}
                        >
                          <Link
                            to="#"
                            className="btn btn-soft-danger btn-sm d-inline-block"
                          >
                            <i className="bi bi-trash fs-17 align-middle"></i>
                          </Link>
                        </li>
                      </Col>
                    </Row>
                  )
                )}

                <Button
                  type="button"
                  className="btn btn-light"
                  onClick={handleAddAttribute}
                >
                  Add Attribute
                </Button>

                <div className="mt-3">
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      type="button"
                      className="btn btn-light gap-2"
                      onClick={onCancel}
                    >
                      Cancel
                    </Button>

                    <Button type="submit" className="btn btn-success">
                      Save
                    </Button>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default EditLocations;
