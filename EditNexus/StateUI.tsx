import React, { useState, useEffect } from 'react';
import { Form, Card, Button, Modal, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import EditLocalTax from './EditLocalTaxes';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { getLocalTaxes as onGetLocalTaxes } from '../../../slices/thunk';
import { useFormik } from 'formik';

interface StateData {
  entity_id: string;
  country: string;
  region: string;
  juris_type_id: string;
  jurisdiction_type_id: string;
  juris_name: string;
  short_name: string;
  end_date: string;
  effective_date: string;
  nexus_type_id: string;
  recommendation_items: string[];
}
interface LocalJurisdictionData {
  local_taxes: any;
}

interface LocalTax {
  id: string;
  juris_name: string;
  juris_type: string;
  nexus_type: string;
  region: string;
  local_taxes?: LocalTax[]; // Optional, to handle nested taxes
}

interface CommonStateUIProps {
  edit: any;
  stateName: string;
  uiType: 'typeA' | 'typeB' | 'typeC' | 'typeD' | 'typeE' | 'typeF' | 'typeG';
  onStateDataChange: (
    stateData: StateData,
    localJurisductionData: LocalJurisdictionData
  ) => void;
}

interface PrimaryEntity {
  id: any;
  name: string;
}

const StateUI: React.FC<CommonStateUIProps> = ({
  edit,
  stateName,
  uiType,
  onStateDataChange,
}) => {
  const [showLocalTaxUI, setShowLocalTaxUI] = useState(false);
  const [showGetRecommendation, setShowGetRecommendation] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [alertShow, setAlertShow] = useState(true);
  const [gridData, setGridData] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [selectedTaxType, setSelectedTaxType] = useState('');
  const [stateData, setStateData] = useState<LocalTax>();

  const checkboxItems = [
    'Retail Location',
    'Office',
    'Distribution Center',
    'Warehouse',
    'Salesperson',
    'None of the above',
  ];

  const [primaryEntity, setPrimaryEntity] = useState<PrimaryEntity | null>(
    null
  );

  const dispatch = useDispatch();

  const selectEntitiesList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      entitiesList: invoices.entitiesList,
    })
  );

  const { entitiesList } = useSelector(selectEntitiesList);

  useEffect(() => {
    dispatch(onGetLocalTaxes());
  }, [dispatch]);

  const selectLocalTaxesList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      localTaxesList: invoices.localTaxesList,
    })
  );

  const { localTaxesList } = useSelector(selectLocalTaxesList);

  const [localTaxesArray, setLocalTaxesArray] = useState<LocalTax[]>([]);

  useEffect(() => {
    if (
      localTaxesList &&
      localTaxesList.data &&
      Array.isArray(localTaxesList.data)
    ) {
      const stateData = localTaxesList.data.find(
        (item: LocalTax) => item.juris_name === stateName
      );
      setStateData(stateData);

      if (stateData && stateData.local_taxes) {
        setLocalTaxesArray(stateData.local_taxes);
      }
    }
  }, [localTaxesList, stateName]);

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

  useEffect(() => {
    setSelectedTaxType(edit.nexus_type_id);
  }, [edit]);

  const formik = useFormik({
    initialValues: {
      effective_date: edit.effective_date,
      end_date: edit.end_date,
    },
  });

  useEffect(() => {
    onStateDataChange(
      {
        entity_id: (primaryEntity && primaryEntity.id) || '',
        country: 'us',
        region: stateData ? stateData.region : '',
        juris_type_id: stateData ? stateData.juris_type : '',
        jurisdiction_type_id: stateData ? stateData.juris_type : '',
        juris_name: stateName,
        short_name: stateName,
        end_date: formik.values.end_date,
        effective_date: formik.values.effective_date,
        nexus_type_id: selectedTaxType ? selectedTaxType : 'sales and use',
        recommendation_items: selectedItems,
      },
      {
        local_taxes: gridData || menuData,
      }
    );
  }, [
    selectedTaxType,
    selectedItems,
    gridData,
    menuData,
    primaryEntity,
    stateName,
    formik.values.effective_date,
    formik.values.end_date,
  ]);

  const handleAddLocalTaxesClick = () => {
    setShowLocalTaxUI(true);
  };

  const handleModalSubmit = () => {
    setShowGetRecommendation(false);
  };

  const handleCheckboxChange = (item: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedItems((prev) => [...prev, item]);
    } else {
      setSelectedItems((prev) => prev.filter((i) => i !== item));
    }
  };

  const handleCancel = () => {
    setShowLocalTaxUI(false);
  };

  const handleGridData = (data: any) => {
    setGridData(data);
  };
  const handleMenuData = (data: any) => {
    // Flatten the object into an array of jurisdictions
    const flattenedData = Object.values(data).flat();

    const transformedData: any = {
      selectedTaxes: flattenedData,
    };
    // Set the flattened data to your state
    setMenuData(transformedData);
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedTaxType(event.target.value);
  };
  const renderUIType = () => {
    const checkboxStyle = {
      color: '#b3b3b3',
      cursor: 'not-allowed',
    };
    switch (uiType) {
      case 'typeA':
        return (
          <div>
            <h4>
              Which types of tax are you registered to report in {stateName}?
            </h4>
            <Form.Check
              type="checkbox"
              label="Sales and use"
              checked
              disabled
              style={checkboxStyle}
            />
            <p style={checkboxStyle}>1 state tax added</p>
            <h4>How should sales and use tax be calculated in this state?</h4>
            <p>
              If you are not sure,{' '}
              <Link
                to="#"
                onClick={(e) => {
                  setShowGetRecommendation(true);
                }}
              >
                get a recommendation
              </Link>
            </p>
            {stateName === 'Texas' ? (
              <Form.Check
                type="radio"
                name={`${stateName}-tax-calculation`}
                value="Single local use tax on all sales"
                checked={
                  selectedTaxType === 'Single local use tax on all sales'
                }
                label={
                  <>
                    Single local use tax on all sales
                    <ul style={{ marginLeft: '20px' }}>
                      <li>
                        <strong>Recommended for</strong> Out-of-state businesses
                        that report the single local use tax
                      </li>
                      <li>
                        The state tax rate plus a 1.75% single local use tax on
                        all sales shipped from outside of the state
                      </li>
                    </ul>
                  </>
                }
                onChange={handleRadioChange}
              />
            ) : (
              <Form.Check
                type="radio"
                name={`${stateName}-tax-calculation`}
                value="simplified sellers use tax"
                checked={selectedTaxType === 'simplified sellers use tax'}
                label={
                  <>
                    Simplified sellers use tax on all sales
                    <ul style={{ marginLeft: '20px' }}>
                      <li>
                        <strong>Recommended for</strong> out of state businesses
                        with an AL account number starting with SSU
                      </li>
                      <li>
                        Flat 8% tax on all sales shipped from outside of the
                        state
                      </li>
                    </ul>
                  </>
                }
                onChange={handleRadioChange}
              />
            )}

            <Form.Check
              type="radio"
              name={`${stateName}-tax-calculation`}
              value="sellers use tax"
              checked={selectedTaxType === 'sellers use tax'}
              label={
                <>
                  Sellers use tax on sales shipped from outside of the state
                  <ul style={{ marginLeft: '20px' }}>
                    {stateName === 'Texas' ? (
                      <li>
                        <strong>Recommended for</strong> out of state businesses
                      </li>
                    ) : (
                      <li>
                        <strong>Recommended for</strong> out of state businesses
                        with an AL account number starting with SLU
                      </li>
                    )}

                    <li>
                      Sales tax is calculated for in-state sales when applicable
                    </li>
                  </ul>
                </>
              }
              onChange={handleRadioChange}
            />
            <Form.Check
              type="radio"
              name={`${stateName}-tax-calculation`}
              value="sales tax on all sales"
              checked={selectedTaxType === 'sales tax on all sales'}
              label={
                <>
                  Sales tax on all sales
                  <ul style={{ marginLeft: '20px' }}>
                    <li>
                      <strong>Recommended for</strong> In-state businesses
                    </li>
                    <li>
                      Sales tax is calculated even if sales are shipped from
                      outside of the state
                    </li>
                  </ul>
                </>
              }
              onChange={handleRadioChange}
            />
            <h4>Local Taxes</h4>
            <Button
              variant="outline-primary"
              style={{ marginTop: '10px', marginBottom: '20px' }}
              onClick={handleAddLocalTaxesClick}
            >
              Add Local Taxes
            </Button>
          </div>
        );
      case 'typeB':
        return (
          <div>
            <h4>
              Which types of tax are you registered to report in {stateName}?
            </h4>
            <Form.Check
              type="checkbox"
              label="Sales and use"
              checked
              disabled
              style={checkboxStyle}
            />
            <p style={checkboxStyle}>1 state tax added</p>
            <h4>How should sales and use tax be calculated in this state?</h4>
            <p>
              If you are not sure,{' '}
              <Link
                to="#"
                onClick={(e) => {
                  setShowGetRecommendation(true);
                }}
              >
                get a recommendation
              </Link>
            </p>
            <Form.Check
              type="radio"
              name={`${stateName}-tax-calculation`}
              value="as a remote seller"
              label={
                <>
                  As a remote seller
                  <ul style={{ marginLeft: '20px' }}>
                    <li>
                      <strong>Recommended for</strong> out-of-state businesses
                      that have met economic nexus requirements in Louisiana
                    </li>
                    <li>
                      State and local sales tax is calculated on all sales
                    </li>
                  </ul>
                </>
              }
              onChange={handleRadioChange}
              checked={selectedTaxType === 'as a remote seller'}
            />
            <Form.Check
              type="radio"
              name={`${stateName}-tax-calculation`}
              value="as a direct marketer"
              label={
                <>
                  As a direct marketer
                  <ul style={{ marginLeft: '20px' }}>
                    <li>
                      <strong>Recommended for</strong> Businesses that file the
                      R-1031 direct marketers sales returns (generally, this is
                      out-of-state businesses that have not met economic nexus
                      requirements in Louisiana)
                    </li>
                    <li>A flat 8.45% rate is calculated on all sales</li>
                  </ul>
                </>
              }
              onChange={handleRadioChange}
            />
            <Form.Check
              type="radio"
              name={`${stateName}-tax-calculation`}
              value="as a dealer"
              label={
                <>
                  As a dealer
                  <ul style={{ marginLeft: '20px' }}>
                    <li>
                      <strong>Recommended for</strong> Businesses that file the
                      R-1029 sales tax return (generally, this is in-state
                      businesses)
                    </li>
                    <li>
                      Sales tax is calculated on all sales. Local sales tax is
                      calculated only where you're registered
                    </li>
                  </ul>
                </>
              }
              onChange={handleRadioChange}
            />
          </div>
        );
      case 'typeC':
        return (
          <div>
            <h5>Ready to calculate tax in new {stateName}.</h5>
            <p>
              Sales tax for in-state sales, sellers use tax for out-of-state
              sales.
            </p>
            {stateName === 'California' && (
              <>
                <h4>Local Taxes</h4>

                <Button
                  variant="outline-primary"
                  style={{ marginTop: '10px', marginBottom: '20px' }}
                  onClick={handleAddLocalTaxesClick}
                >
                  Add Local Taxes
                </Button>
              </>
            )}
          </div>
        );
      case 'typeD':
        return (
          <div>
            <h5>Ready to calculate tax in {stateName}.</h5>
            <p>Sales tax on all sales.</p>
          </div>
        );
      case 'typeE':
        return (
          <div>
            <h4>
              Which types of tax are you registered to report in {stateName}?
            </h4>
            <Form.Check
              type="checkbox"
              label="Sales and use"
              checked
              disabled
              style={checkboxStyle}
            />
            <p style={checkboxStyle}>1 state tax added</p>
            <h4>How should sales and use tax be calculated in this state?</h4>
            <p>
              If you are not sure,{' '}
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowGetRecommendation(true);
                }}
              >
                get a recommendation
              </Link>
            </p>
            <Form.Check
              type="radio"
              name={`${stateName}-tax-calculation`}
              value="sales tax on all sales"
              label={
                <>
                  {['Oklahoma', 'Virginia'].includes(stateName)
                    ? 'Sellers use tax on sales shipped from outside of the state'
                    : 'Sales tax on all Sales'}
                  <ul style={{ marginLeft: '20px' }}>
                    {['Arizona', 'Colorado'].includes(stateName) ? (
                      <>
                        <li>
                          <strong>Recommended for</strong> Most businesses
                        </li>
                        <li>
                          Sales tax is calculated even if sales are shipped from
                          outside of the state
                        </li>
                      </>
                    ) : stateName === 'Illinois' ? (
                      <>
                        <li>
                          <strong>Recommended for</strong> out-of-state
                          businesses
                        </li>
                        <li>
                          Sales tax is calculated even if sales are shipped from
                          outside of the state
                        </li>
                      </>
                    ) : stateName === 'Mississippi' ? (
                      <>
                        <li>
                          <strong>Recommended for</strong> in-state businesses
                        </li>
                        <li>
                          Sales tax is calculated even if sales are shipped from
                          outside of the state
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <strong>Recommended for</strong> out-of-state
                          businesses
                        </li>
                        <li>
                          Sales tax is calculated for in-state sales when
                          applicable
                        </li>
                      </>
                    )}
                  </ul>
                </>
              }
              onChange={handleRadioChange}
              checked={selectedTaxType === 'sales tax on all sales'}
            />
            <Form.Check
              type="radio"
              name={`${stateName}-tax-calculation`}
              value="sellers use tax"
              label={
                <>
                  {stateName === 'Illinois'
                    ? 'Sales tax on in-state sales, sellers use tax on sales shipped from out of state'
                    : stateName == 'Mississippi'
                      ? 'Calculate tax based on where the transaction originates'
                      : ['Oklahoma', 'Virginia'].includes(stateName)
                        ? ' Sales tax on all Sales'
                        : 'Sellers use tax on sales shipped from outside of the state'}
                  <ul style={{ marginLeft: '20px' }}>
                    {['Arizona', 'Colorado'].includes(stateName) ? (
                      <>
                        <li>Uncommon for most buisness</li>
                        <li>
                          Sales tax is calculated for in-state sales when
                          applicable
                        </li>
                      </>
                    ) : stateName == 'Mississippi' ? (
                      <>
                        <li>
                          <strong>Recommended for</strong> out-of-state
                          businesses
                        </li>
                        <li>
                          Sales tax is calculated for in-state sales when
                          applicable
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          <strong>Recommended for</strong> In-state businesses
                        </li>
                        <li>
                          Sales tax is calculated even if sales are shipped from
                          outside of the state
                        </li>
                      </>
                    )}
                  </ul>
                </>
              }
              onChange={handleRadioChange}
            />
            {['Colorado'].includes(stateName) && (
              <>
                <h4>Local Taxes</h4>

                <Button
                  variant="outline-primary"
                  style={{ marginTop: '10px', marginBottom: '20px' }}
                  onClick={handleAddLocalTaxesClick}
                >
                  Add Local Taxes
                </Button>
              </>
            )}
          </div>
        );
      case 'typeF':
        return (
          <div>
            {stateName === 'Alaska' && (
              <Alert
                variant="info"
                onClose={() => setAlertShow(false)}
                dismissible
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <i
                    className="las la-info-circle"
                    style={{
                      fontSize: '24px',
                      marginRight: '10px',
                      color: '#17a2b8',
                    }}
                  ></i>
                  <div>
                    <Alert.Heading></Alert.Heading>
                    <p>
                      Alaska doesn't have statewide taxes, but many Alaskan
                      boroughs and cities have local taxes. Add local taxes to
                      calculate them in this state. Otherwise, Alaska won't be
                      saved.
                    </p>
                  </div>
                </div>
              </Alert>
            )}

            <h4>
              Which types of tax are you registered to report in {stateName}?
            </h4>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Form.Check
                type="checkbox"
                label="Sales and use"
                checked
                disabled
                style={checkboxStyle}
              />
              {stateName === 'Alaska' && (
                <p
                  style={{
                    backgroundColor: '#e6f7ff',
                    padding: '5px',
                    borderRadius: '4px',
                    marginLeft: '10px',
                  }}
                >
                  NO STATE TAX
                </p>
              )}
            </div>

            {/* Conditionally render the "1 state tax added" text for states other than Alaska */}
            {stateName !== 'Alaska' && (
              <p style={checkboxStyle}>1 state tax added</p>
            )}
            {['New Jersey', 'Wisconsin'].includes(stateName) && (
              <>
                <h4>You collect:</h4>
                <p>Sales on all sales</p>
              </>
            )}

            <h4>Local Taxes</h4>

            <Button
              variant="outline-primary"
              style={{ marginTop: '10px', marginBottom: '20px' }}
              onClick={handleAddLocalTaxesClick} // Add onClick handler to show the AddLocalTax component
            >
              Add Local Taxes
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card
      className="mb-10"
      style={{
        backgroundColor: '#f8f9fa',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Card.Header style={{ backgroundColor: '#e9ecef' }}>
        <h5>{stateName}</h5>
      </Card.Header>
      <Card.Body>
        {renderUIType()}
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col md={4}>
              <Form.Group>
                <Form.Label htmlFor="effective_date">Effective date</Form.Label>
                <Form.Control
                  id="effective_date"
                  name="effective_date"
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.effective_date}
                  isInvalid={
                    formik.touched.effective_date &&
                    !!formik.errors.effective_date
                  }
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group>
                <Form.Label htmlFor="end_date">Expiration date</Form.Label>
                <Form.Control
                  id="end_date"
                  name="end_date"
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.end_date}
                  isInvalid={
                    formik.touched.end_date && !!formik.errors.end_date
                  }
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
        <div className="mt-3">
          {showLocalTaxUI && (
            <EditLocalTax
              stateName={stateName}
              localTaxesArray={localTaxesArray}
              onGridData={handleGridData}
              onMenuData={handleMenuData}
              onCancel={handleCancel}
            />
          )}{' '}
          {/* Conditionally render AddLocalTax */}
        </div>
        <Modal
          show={showGetRecommendation}
          onHide={() => setShowGetRecommendation(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Do you have any of these in {stateName}?</Modal.Title>
          </Modal.Header>
          <hr />
          <Modal.Body>
            <Row>
              <Col xs={6}>
                {checkboxItems
                  .slice(0, Math.ceil(checkboxItems.length / 2))
                  .map((item) => (
                    <Form.Check
                      key={item}
                      type="checkbox"
                      label={item}
                      onChange={(e) =>
                        handleCheckboxChange(item, e.target.checked)
                      }
                    />
                  ))}
              </Col>
              <Col xs={6}>
                {checkboxItems
                  .slice(Math.ceil(checkboxItems.length / 2))
                  .map((item) => (
                    <Form.Check
                      key={item}
                      type="checkbox"
                      label={item}
                      onChange={(e) =>
                        handleCheckboxChange(item, e.target.checked)
                      }
                    />
                  ))}
              </Col>
            </Row>
          </Modal.Body>
          <hr />
          <Modal.Footer className="justify-content-start">
            <Button
              variant="outline-primary"
              style={{ marginTop: '2px', marginBottom: '2px' }}
              onClick={() => setShowGetRecommendation(false)}
            >
              Cancel
            </Button>
            <Button
              variant="outline-primary"
              style={{ marginTop: '2px', marginBottom: '2px' }}
              onClick={handleModalSubmit}
            >
              Submit
            </Button>
          </Modal.Footer>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default StateUI;
