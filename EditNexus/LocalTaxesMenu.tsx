import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Card,
  Col,
  Row,
  Form,
  Button,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { getNexus as onGetNexus } from '../../../slices/thunk';

interface LocalTax {
  id: string;
  juris_name: string;
  juris_type: string;
  nexus_type: string;
  region: string;
  local_taxes?: LocalTax[];
}

interface MenuData {
  [county: string]: LocalTax[];
}

interface LocalTaxesMenuProps {
  onData: (data: MenuData) => void;
  onCancel: () => void;
  stateName: string;
  localTaxesArray: LocalTax[];
}

const LocalTaxMenu: React.FC<LocalTaxesMenuProps> = ({
  onData,
  onCancel,
  stateName,
  localTaxesArray,
}) => {
  const [expanded, setExpanded] = useState<{ [county: string]: boolean }>({});
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCounties, setFilteredCounties] = useState<LocalTax[]>([]);

  const formik = useFormik({
    initialValues: {
      selectedJurisdictions: {} as MenuData,
    },
    validationSchema: Yup.object({
      selectedJurisdictions: Yup.object().test(
        'hasSelected',
        'Select at least one jurisdiction',
        (obj: any) => Object.values(obj).some((val: any) => val.length > 0)
      ),
    }),
    onSubmit: (values: any) => {
      onData(values.selectedJurisdictions);
      onCancel();
    },
  });

  const dispatch = useDispatch();

  const selectLocationsList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      nexusList: invoices.NexusList,
    })
  );

  const { nexusList } = useSelector(selectLocationsList);

  useEffect(() => {
    dispatch(onGetNexus());
  }, [dispatch]);

  useEffect(() => {
    if (!localTaxesArray) return;

    const filtered = localTaxesArray
      .map((county: any) => ({
        ...county,
        local_taxes: county.local_taxes?.filter(
          (tax: any) =>
            tax.juris_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tax.nexus_type.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      }))
      .filter(
        (county: any) => county.local_taxes && county.local_taxes.length > 0
      );

    setFilteredCounties(filtered);

    const newExpanded: { [county: string]: boolean } = {};
    filtered.forEach((county: any) => {
      newExpanded[county.juris_name] = searchTerm.length > 0;
    });
    setExpanded(newExpanded);

    // Update formik based on filtered results
    const updatedSelections = { ...formik.values.selectedJurisdictions };
    let shouldUpdateFormik = false;

    Object.keys(updatedSelections).forEach((county) => {
      if (!filtered.some((c: any) => c.juris_name === county)) {
        delete updatedSelections[county];
        shouldUpdateFormik = true;
      } else {
        const originalCount = updatedSelections[county].length;
        updatedSelections[county] = updatedSelections[county].filter(
          (jurisdiction: any) =>
            filtered
              .find((c: any) => c.juris_name === county)
              ?.local_taxes?.some(
                (tax: any) => tax.juris_name === jurisdiction.juris_name
              )
        );

        if (originalCount !== updatedSelections[county].length) {
          shouldUpdateFormik = true;
        }
      }
    });

    if (shouldUpdateFormik) {
      formik.setFieldValue('selectedJurisdictions', updatedSelections);
    }
  }, [searchTerm, localTaxesArray]);

  // Handle checking jurisdictions from nexusList by default
  const isDefaultJurisdiction = (juris_name: string) => {
    return nexusList.some((nexus: LocalTax) => nexus.juris_name === juris_name);
  };

  const handleJurisdictionChange = (
    county: string,
    jurisdiction: LocalTax,
    isChecked: boolean
  ) => {
    if (isDefaultJurisdiction(jurisdiction.juris_name)) return; // Prevent changes for default jurisdictions

    const currentSelections = formik.values.selectedJurisdictions[county] || [];
    const updatedSelections = isChecked
      ? [...currentSelections, jurisdiction]
      : currentSelections.filter(
          (j: LocalTax) => j.juris_name !== jurisdiction.juris_name
        );

    formik.setFieldValue(`selectedJurisdictions.${county}`, updatedSelections);
  };

  const handleCountyChange = (
    county: string,
    isChecked: boolean,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.stopPropagation();
    const countyData = filteredCounties.find((c) => c.juris_name === county);
    if (!countyData || !countyData.local_taxes) return;

    const updatedCountySelections = isChecked
      ? countyData.local_taxes.filter(
          (tax) => !isDefaultJurisdiction(tax.juris_name)
        ) // Exclude default
      : [];

    formik.setFieldValue(
      `selectedJurisdictions.${county}`,
      updatedCountySelections
    );
  };

  const isCountyChecked = (countyName: string) => {
    const county = formik.values.selectedJurisdictions[countyName] || [];
    const countyData = filteredCounties.find(
      (c) => c.juris_name === countyName
    );
    if (!countyData || !countyData.local_taxes) return false;

    return countyData.local_taxes.every(
      (tax) =>
        county.some((j: LocalTax) => j.juris_name === tax.juris_name) ||
        isDefaultJurisdiction(tax.juris_name)
    );
  };

  const countSelectedJurisdictions = (countyName: string) => {
    const county = filteredCounties.find((c) => c.juris_name === countyName);
    if (!county || !county.local_taxes) return 0;

    // Count jurisdictions from formik and add the default checked ones
    const selectedFromFormik =
      formik.values.selectedJurisdictions[countyName] || [];
    const defaultSelected = county.local_taxes.filter((tax) =>
      isDefaultJurisdiction(tax.juris_name)
    );

    return selectedFromFormik.length + defaultSelected.length;
  };

  const isJurisdictionChecked = (
    countyName: string,
    jurisdictionName: string
  ) => {
    const county = formik.values.selectedJurisdictions[countyName] || [];
    return (
      county.some((j: LocalTax) => j.juris_name === jurisdictionName) ||
      isDefaultJurisdiction(jurisdictionName)
    );
  };

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <Card.Body>
            <Form onSubmit={formik.handleSubmit}>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Search taxes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Link to="#" onClick={() => setSelectAll(!selectAll)}>
                {selectAll ? 'Deselect all' : 'Select all'}
              </Link>
              <Row>
                {filteredCounties.map((county) => (
                  <Col md={4} key={county.juris_name}>
                    <Card style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                      <Card.Header
                        style={{ cursor: 'pointer' }}
                        onClick={(e) =>
                          setExpanded((prev) => ({
                            ...prev,
                            [county.juris_name]: !prev[county.juris_name],
                          }))
                        }
                      >
                        <div className="d-flex justify-content-between">
                          <Form.Check
                            type="checkbox"
                            label={`${county.juris_name} (${county.juris_type})`}
                            checked={isCountyChecked(county.juris_name)}
                            onChange={(e) =>
                              handleCountyChange(
                                county.juris_name,
                                e.target.checked,
                                e
                              )
                            }
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="text-muted">
                            {countSelectedJurisdictions(county.juris_name)}{' '}
                            selected {/* Updated count */}
                          </div>
                        </div>
                      </Card.Header>

                      <Card.Body
                        className={expanded[county.juris_name] ? '' : 'd-none'}
                      >
                        {expanded[county.juris_name] &&
                          county.local_taxes?.map((tax) => (
                            <div
                              key={`${tax.juris_name}-${tax.juris_type}`}
                              className="mb-2"
                            >
                              {tax.juris_name}({tax.juris_type})
                              <Form.Check
                                type="checkbox"
                                label={`${tax.nexus_type}`}
                                checked={isJurisdictionChecked(
                                  county.juris_name,
                                  tax.juris_name
                                )}
                                onChange={(e) =>
                                  handleJurisdictionChange(
                                    county.juris_name,
                                    tax,
                                    e.target.checked
                                  )
                                }
                                disabled={isDefaultJurisdiction(tax.juris_name)} // Disable if default
                              />
                            </div>
                          ))}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <div className="mt-3">
                <Button
                  variant="outline-primary"
                  style={{
                    marginTop: '10px',
                    marginBottom: '20px',
                    marginLeft: '20px',
                  }}
                  type="submit"
                  disabled={!formik.isValid}
                >
                  Submit
                </Button>
                <Button
                  variant="outline-primary"
                  style={{
                    marginTop: '10px',
                    marginBottom: '20px',
                    marginLeft: '20px',
                  }}
                  className="ml-2"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default LocalTaxMenu;
