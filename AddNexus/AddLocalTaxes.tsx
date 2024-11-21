import React, { useState } from 'react';
import LocalTaxGrid from './LocalTaxesGrid';
import LocalTaxMenu from './LocalTaxesMenu';
import { Link } from 'react-router-dom';
import { Card, Col, Container, Row, Form, Button } from 'react-bootstrap';

interface LocalTax {
  id: string;
  juris_name: string;
  juris_type: string;
  nexus_type: string;
  region: string;
  local_taxes?: LocalTax[]; // Optional in case there are no nested taxes
}

interface GridData {
  selectedTaxes: LocalTax[]; // Ensure this matches the type used in LocalTaxGrid
}

interface MenuData {
  [county: string]: LocalTax[]; // Store the full LocalTax data instead of just strings
}
// Define the props interface
interface AddLocalTaxProps {
  stateName: string;
  localTaxesArray: LocalTax[];
  onGridData: (data: GridData) => void; // Callback function to send data from LocalTaxGrid
  onMenuData: (data: MenuData) => void; // Callback function to send data from LocalTaxMenu
  onCancel: () => void; // Callback for cancel action
}

const AddLocalTax: React.FC<AddLocalTaxProps> = ({
  stateName,
  localTaxesArray,
  onGridData,
  onMenuData,
  onCancel,
}) => {
  const [showLocalTaxGrid, setShowLocalTaxGrid] = useState<boolean>(true);
  const [showLocalTaxMenu, setShowLocalTaxMenu] = useState<boolean>(true);

  const handleCancel = () => {
    if (onCancel) {
      onCancel(); // Optionally notify parent about the cancel action
    }
  };

  return (
    <React.Fragment>
      <div>
        <Container fluid>
          <Row>
            <Col xl={12}>
              <Card>
                <Card.Body>
                  <h5>Add taxes you are registered to report in {stateName}</h5>
                  {stateName === 'Alaska' && (
                    <p>
                      Add local taxes for any boroughs or cities where you are
                      registered to report tax.
                    </p>
                  )}
                  {stateName === 'Colorado' && (
                    <p>
                      Some "home rule" cities in Colorado administer their own
                      local sales and use taxes.if you file any local taxes
                      returns separately from the state tax return, add the
                      local taxes that you are registerd to report.
                    </p>
                  )}
                  {stateName === 'Wisconsin' && (
                    <p>
                      Businesses that make in-person sales in certain Wisconsin
                      cities must also register to collect and file a premier
                      resort area tax. Add any city where you’re registered to
                      collect this tax. For more information about the premier
                      resort area tax, refer to the{' '}
                      <span>
                        <Link to="#">
                          Wisconsin Department of Revenue website.
                        </Link>
                      </span>
                    </p>
                  )}
                  {stateName === 'Wyoming' && (
                    <p>
                      Businesses that make in-person sales in certain “resort
                      districts” must also collect additional local tax in those
                      districts. Add any city or district where you collect the
                      additional local tax.
                    </p>
                  )}
                  {stateName === 'California' && (
                    <p>
                      Some taxes in this state are unique to a local
                      jurisdiction, such as a county or city. Add any local
                      taxes that you're registered to report.
                    </p>
                  )}
                  {stateName === 'Idaho' && (
                    <p>
                      Some Idaho cities have a “local option” sales tax, which
                      require separate registrations and are filed on separate
                      tax returns. Add the local taxes that you’re registered to
                      report if you file any local returns separately from the
                      state return.
                    </p>
                  )}
                  {stateName === 'New Jersey' && (
                    <p>
                      Some local jurisdictions in New Jersey collect additional
                      tax on in-person sales. Add local taxes that you’re
                      registered to report on separate tax returns.
                    </p>
                  )}
                  {stateName === 'Alabama' && (
                    <p>
                      Some cities and counties collect their own taxes. Add
                      local taxes for all jurisdictions administered by the AL
                      Department of Revenue and any other local taxes that
                      you’re registered to report.
                    </p>
                  )}

                  {stateName === 'New Jersey' || stateName === 'Alabama' ? (
                    <div>
                      {showLocalTaxGrid && (
                        <LocalTaxGrid
                          onData={onGridData}
                          onCancel={handleCancel}
                          stateName={stateName}
                          localTaxesArray={localTaxesArray}
                        />
                      )}
                    </div>
                  ) : (
                    showLocalTaxMenu && (
                      <LocalTaxMenu
                        onData={onMenuData}
                        onCancel={handleCancel}
                        stateName={stateName}
                        localTaxesArray={localTaxesArray}
                      />
                    )
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddLocalTax;
