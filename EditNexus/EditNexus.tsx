import React, { useState, useEffect } from 'react';
import {
  Card,
  Col,
  Container,
  Row,
  Button,
  Form,
  Modal,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { editNexus as onEditNexus } from '../../../slices/thunk';
import StateUI from './StateUI';

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
  end_date: string;
  effective_date: string;
  nexus_type_id: string;
  recommendation_items: string[];
}
interface LocalJurisdictionData {
  local_taxes: any;
}
interface StateWithLocalJurisdictionData extends StateData {
  localJurisdictionData: LocalJurisdictionData;
}

interface nexusEditProps {
  onCancel: () => void;
  edit: any;
}

const EditNexus = ({ onCancel, edit }: nexusEditProps) => {
  const dispatch = useDispatch();
  const [statesData, setStatesData] = useState<{
    [key: string]: StateWithLocalJurisdictionData;
  }>({});

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
  const handleCancel = () => {
    onCancel();
  };

  const handleSubmitStates = () => {
    let stateDataObject: any = null;
    const localTaxEntriesArray: any = [];

    Object.values(statesData).forEach((state) => {
      // Base state data without local taxes
      const stateDataWithoutLocalTaxes = {
        id: edit.id,
        entity_id: state.entity_id,
        country: state.country,
        region: state.region,
        juris_type_id: state.juris_type_id,
        jurisdiction_type_id: state.jurisdiction_type_id,
        juris_name: state.juris_name,
        short_name: state.juris_name,
        effective_date: state.effective_date,
        end_date: state.end_date,
        nexus_type_id: state.nexus_type_id,
        // Initialize the `nexuses` array
        nexuses: [],
      };

      // Extract local taxes and ensure default empty object if undefined
      const localTaxes = state.localJurisdictionData?.local_taxes || {};

      // Check if localTaxes.selectedTaxes exists and is not empty
      if (localTaxes.selectedTaxes && localTaxes.selectedTaxes.length > 0) {
        const localTaxEntries = localTaxes.selectedTaxes.map((tax: any) => {
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
              jurisTypeId = 'UNKNOWN';
          }

          return {
            entity_id: state.entity_id,
            country: state.country,
            region: tax.region || state.region,
            juris_type_id: jurisTypeId,
            jurisdiction_type_id: tax.juris_type,
            juris_name: tax.juris_name,
            short_name: tax.juris_name,
            nexus_type_id: state.nexus_type_id,
          };
        });

        // Add the local tax entries to the nexuses array in `stateDataWithoutLocalTaxes`
        stateDataWithoutLocalTaxes.nexuses = localTaxEntries;
      }
      // Store the state data object with local taxes as nexuses
      stateDataObject = stateDataWithoutLocalTaxes;
    });

    // Dispatch the state-level data with nexuses
    if (stateDataObject) {
      dispatch(onEditNexus(stateDataObject));
    }

    onCancel();
  };

  return (
    <React.Fragment>
      <Container fluid>
        <Row>
          <Col xl={12}>
            <Card>
              <Card.Body>
                <>
                  <StateUI
                    key={edit.juris_name}
                    edit={edit}
                    stateName={edit.juris_name}
                    uiType={stateUITypeMap[edit.juris_name] || 'typeA'}
                    onStateDataChange={handleStateDataChange}
                  />

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
                    variant="danger"
                    style={{
                      marginTop: '10px',
                      marginBottom: '20px',
                      marginLeft: '20px',
                    }}
                  >
                    Cancel
                  </Button>
                </>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};

export default EditNexus;
