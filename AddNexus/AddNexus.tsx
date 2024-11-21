import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Card,
  Col,
  Container,
  Row,
  Button,
  Form,
  Modal,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BreadCrumb from '../../../Common/BreadCrumb';
import { useDispatch, useSelector } from 'react-redux';
import { addNexus as onAddNexus } from '../../../slices/thunk';
import { Link } from 'react-router-dom';
import { statesData, disabledStatesData } from '../../../Common/data/nexus';
import StateUI from './StateUI';
import { createSelector } from 'reselect';
import { getNexus as onGetNexus } from '../../../slices/thunk';
import { getLocalTaxes as onGetLocalTaxes } from '../../../slices/thunk';

const stateOptions = statesData;
const disabledStates = disabledStatesData;

// Define the state types for each category
const typeAStates = ['Alabama', 'Texas'];
const typeBStates = ['Louisiana'];
const typeCStates = ['California', 'New Mexico', 'Ohio', 'Pennsylvania'];
const typeDStates = [
  'Connecticut',
  'Georgia',
  'Guam',
  'Hawaii',
  'Indiana',
  'Kentucky',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Minnesota',
  'Nebraska',
  'Nevada',
  'New York',
  'North Carolina',
  'North Dakota',
  'Puerto Rico',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Vermont',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming',
  'Utah',
  'Florida',
  'Tennessee',
  'District of Columbia',
];
const typeEStates = [
  'Arkansas',
  'Arizona',
  'Colorado',
  'Illinois',
  'Iowa',
  'Kansas',
  'Michigan',
  'Mississippi',
  'Missouri',
  'Oklahoma',
  'Virginia',
];
const typeFStates = ['Alaska', 'Wyoming', 'Idaho', 'New Jersey', 'Wisconsin'];

// Create a mapping from state to UI type
const stateUITypeMap: Record<
  string,
  'typeA' | 'typeB' | 'typeC' | 'typeD' | 'typeE' | 'typeF'
> = {
  ...Object.fromEntries(typeAStates.map((state) => [state, 'typeA'])),
  ...Object.fromEntries(typeBStates.map((state) => [state, 'typeB'])),
  ...Object.fromEntries(typeCStates.map((state) => [state, 'typeC'])),
  ...Object.fromEntries(typeDStates.map((state) => [state, 'typeD'])),
  ...Object.fromEntries(typeEStates.map((state) => [state, 'typeE'])),
  ...Object.fromEntries(typeFStates.map((state) => [state, 'typeF'])),
};

interface StateData {
  entity_id: string;
  country: string;
  region: string;
  juris_type_id: string;
  jurisdiction_type_id: string;
  juris_name: string;
  short_name: string;
  nexus_type_id: string;
  recommendation_items: string[];
}
interface LocalJurisdictionData {
  local_taxes: any;
}
interface StateWithLocalJurisdictionData extends StateData {
  localJurisdictionData: LocalJurisdictionData;
}

interface LocalTax {
  id: string;
  juris_name: string;
  juris_type: string;
  nexus_type: string;
  region: string;
  local_taxes?: LocalTax[]; // Optional, to handle nested taxes
}

const AddNexus = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [showStateUI, setShowStateUI] = useState(false);
  const [showIsRegisterModel, setShowIsRegisterModel] = useState(false);
  const [newlySelectedStates, setNewlySelectedStates] = useState<string[]>([]);
  const [statesData, setStatesData] = useState<{
    [key: string]: StateWithLocalJurisdictionData;
  }>({});
  const [stateOptions, setStateOptions] = useState<string[]>([]);

  const selectLocationsList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      nexusList: invoices.NexusList,
    })
  );

  const { nexusList } = useSelector(selectLocationsList);
  const jurisNames =
    nexusList && Array.isArray(nexusList)
      ? nexusList.map((item: any) => item.juris_name)
      : [];

  useEffect(() => {
    dispatch(onGetNexus());
  }, [dispatch]);

  const handleStateDataChange = (
    stateData: StateData,
    localJurisdictionData: LocalJurisdictionData
  ) => {
    setStatesData((prev) => ({
      ...prev,
      [stateData.juris_name]: {
        ...stateData,
        localJurisdictionData,
      },
    }));
  };

  const formik = useFormik({
    initialValues: {
      selectedStates: stateOptions.filter((state) =>
        jurisNames.includes(state)
      ),
      stateSearch: '',
    },
    validationSchema: Yup.object({
      selectedStates: Yup.array().min(1, 'Select at least one state'),
    }),

    onSubmit: (values: any) => {
      const newStates = values.selectedStates.filter(
        (state: string) => !jurisNames.includes(state)
      );
      setNewlySelectedStates(newStates);
      if (newStates.length > 0) {
        setShowIsRegisterModel(true);
      } else {
        // If no new states were selected, don't show the modal or StateUI
        setShowStateUI(false);
      }
    },
  });

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
      const stateDataArray = localTaxesList.data.filter(
        (item: LocalTax) => item.juris_type.toLowerCase() === 'state'
      );

      if (stateDataArray.length > 0) {
        const stateNames = stateDataArray.map(
          (item: LocalTax) => item.juris_name
        );
        setStateOptions(stateNames);
      }
    }
  }, [localTaxesList]);

  const handleSearch = (e: any) => {
    const searchTerm = e.target.value.toLowerCase();
    formik.setFieldValue('stateSearch', searchTerm);
  };

  const handleSelectAll = () => {
    const selectableStates = stateOptions.filter(
      (state) => !disabledStatesData.includes(state)
    );
    if (isAllSelected) {
      formik.setFieldValue(
        'selectedStates',
        jurisNames.filter((name) => selectableStates.includes(name))
      );
    } else {
      // Use Array.from instead of spread operator with Set
      formik.setFieldValue(
        'selectedStates',
        Array.from(new Set([...selectableStates, ...jurisNames]))
      );
    }
    setIsAllSelected(!isAllSelected);
  };
  const handleRemoveState = (stateName: string) => {
    const updatedStates = formik.values.selectedStates.filter(
      (state: string) => state !== stateName
    );

    formik.setFieldValue('selectedStates', updatedStates);

    // Remove the state from statesData if it exists
    setStatesData((prevData) => {
      const newData = { ...prevData };
      delete newData[stateName];
      return newData;
    });

    // Check if all newly added states (not in jurisNames) have been removed
    const remainingNewStates = updatedStates.filter(
      (state: any) => !jurisNames.includes(state)
    );

    if (remainingNewStates.length === 0) {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setShowStateUI(false);
    setIsAllSelected(false);

    // Reset form but keep pre-selected states
    formik.setFieldValue('selectedStates', jurisNames);
    formik.setFieldValue('stateSearch', '');

    // Clear any added state data
    setStatesData({});
  };

  const handleSubmitStates = () => {
    const statesDataArray = Object.values(statesData).flatMap((state) => {
      // Base state data without local taxes
      const stateDataWithoutLocalTaxes = {
        entity_id: state.entity_id,
        country: state.country,
        region: state.region,
        juris_type_id: state.juris_type_id,
        jurisdiction_type_id: state.jurisdiction_type_id,
        juris_name: state.juris_name,
        short_name: state.short_name,
        nexus_type_id: state.nexus_type_id,
        // recommendation_items: state.recommendation_items,
      };

      // Extract local taxes and ensure default empty object if undefined
      const localTaxes = state.localJurisdictionData?.local_taxes || {};

      // Check if localTaxes.selectedTaxes exists and is not empty
      if (localTaxes.selectedTaxes && localTaxes.selectedTaxes.length > 0) {
        // Map local taxes to include state-level properties
        const localTaxEntries = localTaxes.selectedTaxes.map((tax: any) => {
          // Determine the juris_type_id based on the juris_type
          let jurisTypeId = '';
          switch (tax.juris_type) {
            case 'City':
              jurisTypeId = 'CIT';
              break;
            case 'Special':
              jurisTypeId = 'STJ';
              break;
            case 'County':
              jurisTypeId = 'CTY';
              break;
            default:
              jurisTypeId = 'UNKNOWN'; // Handle cases where juris_type is unrecognized
          }

          // Return the mapped tax object
          return {
            entity_id: state.entity_id,
            country: state.country,
            region: tax.region || state.region, // Use region from tax or default to state region
            juris_type_id: jurisTypeId, // Set the appropriate juris_type_id based on `juris_type`
            jurisdiction_type_id: tax.juris_type, // Use the `juris_type` directly for jurisdiction_type_id
            juris_name: tax.juris_name, // Use the `juris_name` directly
            short_name: tax.juris_name, // Use `juris_name` as `short_name`
            nexus_type_id: state.nexus_type_id, // Use the state's `nexus_type_id`
            // recommendation_items: state.recommendation_items (Uncomment if needed)
          };
        });

        // Return both state data and local tax entries
        return [stateDataWithoutLocalTaxes, ...localTaxEntries];
      } else {
        // If no local taxes, return only the state data
        return [stateDataWithoutLocalTaxes];
      }
    });

    const data = {
      nexuses: statesDataArray,
    };
    dispatch(onAddNexus(data));
    navigate('/nexus');
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Where you collect tax" title="Add State" />
          <Row>
            <Col xl={12}>
              <Card>
                <Card.Body>
                  {!showStateUI ? (
                    <>
                      <Form onSubmit={formik.handleSubmit}>
                        <h5>
                          Select states where you're registered to report tax
                        </h5>
                        <p>
                          Be sure to select any state where you’re already
                          registered. If you’re not sure about a particular
                          state, check your registration documents or check with
                          the state’s tax department.
                        </p>
                        <p>
                          {formik.values.selectedStates.length} states selected
                        </p>

                        <Link to="#" onClick={handleSelectAll}>
                          {isAllSelected
                            ? 'Deselect all states'
                            : 'Select all states'}
                        </Link>
                        <div className="search-box mt-3 mb-3">
                          <Form.Control
                            type="text"
                            id="searchMemberList"
                            placeholder="Search for Result"
                            onChange={handleSearch}
                          />
                          <i className="las la-search search-icon"></i>
                        </div>

                        <Form.Group>
                          <Row>
                            {stateOptions
                              .filter((state) =>
                                state
                                  .toLowerCase()
                                  .includes(formik.values.stateSearch || '')
                              )
                              .map((state) => (
                                <Col key={state} md={4} className="mb-3">
                                  <div
                                    className="p-2"
                                    style={{
                                      border: '1px solid #ddd',
                                      borderRadius: '4px',
                                      backgroundColor: disabledStates.includes(
                                        state
                                      )
                                        ? '#f0f0f0'
                                        : '#f8f9fa',
                                      textAlign: 'center',
                                      cursor: disabledStates.includes(state)
                                        ? 'not-allowed'
                                        : 'pointer',
                                      color: disabledStates.includes(state)
                                        ? '#ccc'
                                        : '#000',
                                    }}
                                  >
                                    <Form.Check
                                      type="checkbox"
                                      id={state}
                                      label={state}
                                      name="selectedStates"
                                      value={state}
                                      onChange={formik.handleChange}
                                      checked={
                                        formik.values.selectedStates.includes(
                                          state
                                        ) || jurisNames.includes(state)
                                      }
                                      disabled={
                                        disabledStates.includes(state) ||
                                        jurisNames.includes(state)
                                      }
                                    />
                                  </div>
                                </Col>
                              ))}
                          </Row>
                        </Form.Group>

                        {formik.touched.selectedStates &&
                        formik.errors.selectedStates ? (
                          <div className="text-danger">
                            {formik.errors.selectedStates}
                          </div>
                        ) : null}

                        <Button
                          type="submit"
                          className="btn btn-light gap-2 mt-3"
                        >
                          Next
                        </Button>
                      </Form>
                      <Modal
                        show={showIsRegisterModel}
                        onHide={() => setShowIsRegisterModel(false)}
                        centered
                      >
                        <Modal.Header closeButton>
                          <Modal.Title>
                            Are you registered to report tax in this state?
                          </Modal.Title>
                        </Modal.Header>

                        <hr />

                        <Modal.Body>
                          {' '}
                          {/* Centering the text */}
                          <p>
                            You’ve indicated that you’re registered and intend
                            to file tax returns with 1 state. If you aren’t sure
                            if you’re registered to report taxes in a state,
                            consider removing it for now. You can always add
                            more states later. If you need help figuring out
                            where you should be registered, consult a tax
                            advisor or{' '}
                            <span>
                              <Link to="#">
                                ScalarHub Professional Services.
                              </Link>
                            </span>
                          </p>
                        </Modal.Body>

                        <hr />

                        <Modal.Footer className="justify-content-start">
                          {' '}
                          {/* Aligning buttons to the left */}
                          <Button
                            variant="outline-primary"
                            onClick={() => {
                              setShowStateUI(true);
                              setShowIsRegisterModel(false);
                            }}
                            className="mt-3"
                          >
                            Yes, I'm Registered
                          </Button>
                          <Button
                            variant="outline-primary"
                            onClick={() => setShowIsRegisterModel(false)}
                            className="mt-3"
                          >
                            Back
                          </Button>
                        </Modal.Footer>
                      </Modal>
                    </>
                  ) : (
                    <>
                      {newlySelectedStates.map((state: string) => (
                        <StateUI
                          key={state}
                          stateName={state}
                          uiType={stateUITypeMap[state] || 'typeA'}
                          onRemove={handleRemoveState}
                          onStateDataChange={handleStateDataChange}
                          localTaxesList={localTaxesList}
                        />
                      ))}
                      <Button
                        onClick={handleSubmitStates}
                        type="submit"
                        variant="primary"
                        style={{ marginTop: '10px', marginBottom: '20px' }}
                      >
                        Submit
                      </Button>
                      <Button
                        onClick={handleCancel}
                        type="submit"
                        className="btn btn-light gap-2"
                        style={{
                          marginTop: '10px',
                          marginBottom: '20px',
                          marginLeft: '20px',
                        }}
                      >
                        Cancel
                      </Button>
                    </>
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

export default AddNexus;
