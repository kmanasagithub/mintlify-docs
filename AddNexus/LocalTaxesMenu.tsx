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

interface LocalTax {
  id: string;
  juris_name: string;
  juris_type: string;
  nexus_type: string;
  region: string;
  local_taxes?: LocalTax[]; // Optional in case there are no nested taxes
}

interface MenuData {
  [county: string]: LocalTax[]; // Store the full LocalTax data instead of just strings
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

  const dispatch = useDispatch();

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

    // Only update formik field if the selected jurisdictions actually need to change
    const updatedSelections = { ...formik.values.selectedJurisdictions };
    let shouldUpdateFormik = false; // Track if formik should be updated

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
              ?.local_taxes?.some((tax: any) => tax.juris_name === jurisdiction)
        );

        if (originalCount !== updatedSelections[county].length) {
          shouldUpdateFormik = true; // Mark formik update as necessary if count has changed
        }
      }
    });

    // Only update formik if changes were made
    if (shouldUpdateFormik) {
      formik.setFieldValue('selectedJurisdictions', updatedSelections);
    }
  }, [searchTerm, localTaxesArray]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setSelectAll(false);
  };

  const handleToggle = (county: string, event: React.MouseEvent) => {
    // Prevent toggling when clicking on the checkbox
    if ((event.target as HTMLElement).closest('.form-check')) {
      return;
    }
    setExpanded((prevExpanded) => ({
      ...prevExpanded,
      [county]: !prevExpanded[county],
    }));
  };

  const handleJurisdictionChange = (
    county: string,
    jurisdiction: LocalTax, // Change type to LocalTax to store the full tax object
    isChecked: boolean
  ) => {
    const currentSelections = formik.values.selectedJurisdictions[county] || [];
    const updatedSelections = isChecked
      ? [...currentSelections, jurisdiction] // Add the full jurisdiction object
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
      ? countyData.local_taxes // Store the full LocalTax objects
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

    return countyData.local_taxes.every((tax) =>
      county.some((j: LocalTax) => j.juris_name === tax.juris_name)
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      formik.setFieldValue('selectedJurisdictions', {});
      setSelectAll(false);
    } else {
      const allSelections: MenuData = {};
      filteredCounties.forEach((county) => {
        allSelections[county.juris_name] = county.local_taxes || []; // Store full LocalTax objects
      });
      formik.setFieldValue('selectedJurisdictions', allSelections);
      setSelectAll(true);
    }
  };

  const isJurisdictionChecked = (
    countyName: string,
    jurisdictionName: string
  ) => {
    const county = formik.values.selectedJurisdictions[countyName] || [];
    return county.some((j: LocalTax) => j.juris_name === jurisdictionName);
  };

  if (!localTaxesArray) {
    return <div>No data available for {stateName}</div>;
  }

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
                  onChange={handleSearchChange}
                />
              </InputGroup>
              <Link to="#" onClick={handleSelectAll}>
                {selectAll ? 'Deselect all' : 'Select all'}
              </Link>
              {filteredCounties.length > 0 ? (
                <Row>
                  {filteredCounties.map((county) => (
                    <Col md={4} key={county.juris_name} className="mb-3">
                      <Card
                        style={{ boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}
                      >
                        <Card.Header
                          style={{ cursor: 'pointer' }}
                          onClick={(e) => handleToggle(county.juris_name, e)}
                        >
                          <div className="d-flex justify-content-between align-items-center">
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
                              {formik.values.selectedJurisdictions[
                                county.juris_name
                              ]?.length || 0}{' '}
                              selected
                            </div>
                          </div>
                        </Card.Header>
                        <Card.Body
                          className={
                            expanded[county.juris_name] ? '' : 'd-none'
                          }
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
                                />
                              </div>
                            ))}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              ) : (
                <div className="text-center mt-3">
                  <p>
                    No matching jurisdictions found. Please try a different
                    search term.
                  </p>
                </div>
              )}
              {formik.errors.selectedJurisdictions && (
                <div className="text-danger">
                  {formik.errors.selectedJurisdictions}
                </div>
              )}
              <Button
                type="submit"
                variant="primary"
                style={{ marginTop: '10px', marginBottom: '20px' }}
              >
                Submit
              </Button>
              <Button
                className="btn btn-light gap-2"
                style={{
                  marginTop: '10px',
                  marginBottom: '20px',
                  marginLeft: '20px',
                }}
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default LocalTaxMenu;
