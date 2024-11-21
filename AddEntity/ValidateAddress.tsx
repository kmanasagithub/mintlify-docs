import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import BreadCrumb from '../../../Common/BreadCrumb';
import { addEntities as onAddEntities } from '../../../slices/thunk';
import { all } from 'axios';

interface ValidateAddressProps {
  onSubmit: (data: any) => void;
  entityData: any;
}
const ValidateAddress: React.FC<ValidateAddressProps> = ({
  onSubmit,
  entityData,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  // const entityData = location.state?.entityData || {};
  const [addressValidated, setAddressValidated] = useState(false);
  const [country, setCountry] = useState('United States of America');
  const dispatch = useDispatch();
  const states = [
    'Alabama',
    'Alaska',
    'American Samoa',
    // ... (add all states from your list)
  ];

  const formik = useFormik({
    initialValues: {
      location_code: '',
      address_type_id: 'location',
      country: 'United States of America',
      address_line1: '',
      line1: '',
      city: '',
      region: '',
      postal_code: '',
      start_date: '',
    },
    validationSchema: Yup.object({
      country: Yup.string().required('Country is required'),
      line1: Yup.string().required('Address is required'),
      city: Yup.string().required('City is required'),
      region: Yup.string().required('region is required'),
      postal_code: Yup.string().required('ZIP/Postal Code is required'),
    }),
    onSubmit: (values: any) => {
      const allData = {
        ...entityData,
        address: values,
      };
      console.log(allData);
      dispatch(onAddEntities(allData));
      navigate('/entities');
      formik.resetForm();
    },
  });
  //   onSubmit: (values:any) => {
  //     onSubmit(values);
  // },

  // });

  const validateAddress = () => {
    setAddressValidated(true);
    alert('Address validated successfully!');
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col xl={12}>
              <Card>
                <Card.Body>
                  <h2>Primary Business Location</h2>
                  <Form onSubmit={formik.handleSubmit}>
                    <Form.Group>
                      <Form.Label htmlFor="location_code">
                        Location Code <span className="text-danger">*</span>{' '}
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
                    <Form.Group className="mb-3 mt-3">
                      <Form.Label htmlFor="country">
                        Country / Territory
                      </Form.Label>
                      <Form.Control
                        type="text"
                        id="country"
                        name="country"
                        value={country}
                        disabled
                        onChange={(e) => setCountry(e.target.value)}
                      ></Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.country}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="address">Address </Form.Label>
                      <Form.Control
                        id="line1"
                        name="line1"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.line1}
                        isInvalid={
                          !!formik.touched.line1 && !!formik.errors.line1
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.line1}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="city">City</Form.Label>
                      <Form.Control
                        id="city"
                        name="city"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.city}
                        isInvalid={
                          !!formik.touched.city && !!formik.errors.city
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.city}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="region">
                        State or Territory
                      </Form.Label>
                      <Form.Select
                        id="region"
                        name="region"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.region}
                        isInvalid={
                          !!formik.touched.region && !!formik.errors.region
                        }
                      >
                        <option value="">Select state or territory</option>
                        {states.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.region}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="postal_code">
                        ZIP/Postal Code
                      </Form.Label>
                      <Form.Control
                        id="postal_code"
                        name="postal_code"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.postal_code}
                        isInvalid={
                          !!formik.touched.postal_code &&
                          !!formik.errors.postal_code
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.postal_code}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group>
                      <Form.Label htmlFor="start_date">
                        Effective<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        id="start_date"
                        name="start_date"
                        type="date"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.start_date}
                        isInvalid={
                          formik.touched.start_date &&
                          !!formik.errors.start_date
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.start_date}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                      variant="secondary"
                      className="me-2"
                      onClick={() => navigate(-1)}
                    >
                      Back
                    </Button>
                    <Button
                      variant="secondary"
                      className="me-2"
                      onClick={validateAddress}
                    >
                      Validate Address
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!addressValidated}
                    >
                      Submit
                    </Button>
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

export default ValidateAddress;
