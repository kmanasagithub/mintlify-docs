import React, { useMemo, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import BreadCrumb from '../../../Common/BreadCrumb';
import MultiStepForm from './MultiStepForm';

const ImportTransaction = () => {
  document.title = 'Import Transaction | Scalarhub';
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle="Import Transaction"
            title="Import Transaction"
          />
          <Row className="pb-4 gy-3"></Row>
          <Row>
            <Col xl="12">
              <Card>
                <Card.Body>
                  <MultiStepForm />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ImportTransaction;
