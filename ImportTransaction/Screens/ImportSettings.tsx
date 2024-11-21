import React, { forwardRef, useImperativeHandle } from 'react';
import { useFormik } from 'formik';
import {
  defaultEntityUseCodes,
  predefinedColumns,
  defaultDocumentTypes,
  defaultProcessCodes,
} from '../data';
import { Form, Row, Col, Button } from 'react-bootstrap';
import * as Yup from 'yup';

interface Props {
  data: any;
  uploadData: string[][];
  initialValues: any;
  updateData: (data: any) => void;
  updateValues: (values: any) => void;
}
const ImportSettings = forwardRef((props: Props, ref) => {
  const { data, initialValues, uploadData, updateData, updateValues } = props;
  const columnHeaders = uploadData[0] || [];
  const dataRows = uploadData.slice(1);
  const formik = useFormik({
    initialValues: {
      useTemplate: initialValues?.useTemplate ?? false,
      multiCompany: initialValues?.multiCompany ?? false,
      processCode: initialValues?.processCode ?? false,
      docuTypeOption: initialValues?.docuTypeOption ?? 'custom',
      processCodeOption: initialValues?.processCodeOption ?? 'custom',
      entityUseCodeOption: initialValues?.entityUseCodeOption ?? 'custom',
      specialProcessing: initialValues?.specialProcessing ?? false,
      columnMappings: predefinedColumns?.reduce(
        (acc, column) => {
          acc[column] = initialValues?.columnMappings?.[column] ?? ''; // Use nullish coalescing operator (??)
          return acc;
        },
        {} as { [key: string]: string }
      ), // Ensure type assertion is correct
    },

    validationSchema: Yup.object({
      multiCompany: Yup.string().required('multiCompany is required'),
      columnMappings: Yup.object({
        DocType: Yup.string()
          .required('Document type mapping is required')
          .trim()
          .min(1, 'Document type mapping cannot be empty'),
      }).required('Column mappings are required'),
    }),
    onSubmit: (values: any) => {
      // Map the data based on selected column mappings
      const mappedData = dataRows.map((row) => {
        const mappedRow: { [key: string]: any } = {};

        // For each predefined column, map the selected header to actual row data
        Object.keys(values.columnMappings).forEach((predefinedColumn) => {
          const selectedHeader = values.columnMappings[predefinedColumn];
          if (selectedHeader) {
            const headerIndex = columnHeaders.indexOf(selectedHeader);
            mappedRow[predefinedColumn] =
              headerIndex !== -1 ? row[headerIndex] : null;
          }
        });
        return mappedRow;
      });
      updateData(mappedData);
      updateValues(values);
    },
  });
  useImperativeHandle(ref, () => ({
    submit: async () => {
      try {
        // Validate the form
        const errors = await formik.validateForm();

        // If there are validation errors, log them and return false
        if (Object.keys(errors).length > 0) {
          await formik.handleSubmit(formik.values);
          return false;
        }
        // Call the form's onSubmit event handler with the form values
        await formik.handleSubmit(formik.values);

        // If the submission was successful, return true
        return true;
      } catch (error) {
        return false;
      }
    },
  }));

  // Handle checkbox change to show/hide the CompanyCode dropdown
  const handleMultiCompanyChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = event.target;
    formik.setFieldValue('multiCompany', checked); // Update formik state
  };
  const handleSpecialProcessingChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = event.target;
    formik.setFieldValue('specialProcessing', checked);
  };
  const handleProcessCode = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    formik.setFieldValue('processCode', checked);
  };

  return (
    <div className="uploadScreen mt-2">
      <Row>
        <Col>
          <h2>Import Settings</h2>
          <p className="mt-2 custom-paragraph">
            Add your import settings to apply to your import and to future
            imports if you save this import as a template.
          </p>
        </Col>
      </Row>
      <Form onSubmit={formik.handleSubmit}>
        {/* Company Code Section */}
        <Col lg={8}>
          <div className="mt-4">
            <Form.Group controlId="multiCompany">
              <Form.Check
                type="checkbox"
                label="This import contains transactions for more than one of my companies"
                onChange={handleMultiCompanyChange}
                checked={formik.values.multiCompany}
              />
            </Form.Group>

            {formik.values.multiCompany && (
              <Form.Group controlId="CompanyCode">
                <Form.Label>Match Company Code</Form.Label>
                <Form.Control
                  as="select"
                  name="columnMappings.CompanyCode"
                  onChange={formik.handleChange}
                  value={formik.values.columnMappings.CompanyCode || ''}
                >
                  <option value="">Select a column</option>
                  {columnHeaders.map((header, index) => (
                    <option key={index} value={header}>
                      {header}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            )}
          </div>
        </Col>
        {/* Document Type Section */}
        <Col lg={8}>
          <div className="mt-4">
            <Form.Group>
              <h3>Document Type</h3>
              <Form.Check
                type="radio"
                label="Match a column from your template to the Document type column"
                name="docuTypeOption"
                value="custom" // Set the value for the radio button
                onChange={formik.handleChange}
                checked={formik.values.docuTypeOption === 'custom'}
              />
              {formik.values.docuTypeOption === 'custom' && (
                <Form.Control
                  as="select"
                  name="columnMappings.DocType"
                  onChange={formik.handleChange}
                  value={formik.values.columnMappings.DocType || ''}
                  className="mt-2"
                >
                  <option value="">Select a column</option>
                  {columnHeaders.map((header, index) => (
                    <option key={index} value={header}>
                      {header}
                    </option>
                  ))}
                </Form.Control>
              )}
              {formik.errors.columnMappings?.DocType &&
                formik.touched.columnMappings?.DocType && (
                  <div className="error-message">
                    {formik.errors.columnMappings.DocType}
                  </div>
                )}
              <Form.Check
                type="radio"
                label="Assign one document type to all the transactions"
                name="docuTypeOption"
                value="default" // Set the value for the radio button
                onChange={formik.handleChange}
                checked={formik.values.docuTypeOption === 'default'}
                className="mt-2"
              />
              {formik.values.docuTypeOption === 'default' && (
                <Form.Control
                  as="select"
                  name="columnMappings.DocType"
                  onChange={formik.handleChange}
                  value={formik.values.columnMappings.DocType || ''}
                  className="mt-2"
                >
                  <option value="">Select a column</option>
                  {defaultDocumentTypes.map((header, index) => (
                    <option key={index} value={header}>
                      {header}
                    </option>
                  ))}
                </Form.Control>
              )}
            </Form.Group>
          </div>
        </Col>
        {/* Process Code Section */}
        <Col lg={8}>
          <div className="mt-4">
            <Form.Group controlId="processCode">
              <h3>Process Code</h3>
              <Form.Check
                type="checkbox"
                label="Import this field with special processing"
                onChange={handleProcessCode}
                checked={formik.values.processCode}
                className="mt-2"
              />
            </Form.Group>

            {formik.values.processCode && (
              <>
                <Form.Check
                  type="radio"
                  label="Match a column from your template to the Process code column"
                  name="processCodeOption"
                  value="custom"
                  onChange={formik.handleChange}
                  checked={formik.values.processCodeOption === 'custom'}
                  className="mt-2"
                />
                {formik.values.processCodeOption === 'custom' && (
                  <Form.Control
                    as="select"
                    name="columnMappings.ProcessCode"
                    onChange={formik.handleChange}
                    value={formik.values.columnMappings.ProcessCode || ''}
                    className="mt-2"
                  >
                    <option value="">Select a column</option>
                    {columnHeaders.map((header, index) => (
                      <option key={index} value={header}>
                        {header}
                      </option>
                    ))}
                  </Form.Control>
                )}
                <Form.Check
                  type="radio"
                  label="Assign one process code to all the transactions"
                  name="processCodeOption"
                  value="default"
                  onChange={formik.handleChange}
                  checked={formik.values.processCodeOption === 'default'}
                  className="mt-2"
                />
                {formik.values.processCodeOption === 'default' && (
                  <Form.Control
                    as="select"
                    name="columnMappings.ProcessCode"
                    onChange={formik.handleChange}
                    value={formik.values.columnMappings.ProcessCode || ''}
                    className="mt-2"
                  >
                    <option value="">Select a column</option>
                    {defaultProcessCodes.map((header, index) => (
                      <option key={index} value={header}>
                        {header}
                      </option>
                    ))}
                  </Form.Control>
                )}
              </>
            )}
          </div>
        </Col>
        {/* entity use code section */}
        <div className="mt-4">
          <Form.Group controlId="specialProcessing">
            <h3>Entity Use Code</h3>
            <Form.Check
              type="checkbox"
              label="Import this field with special processing"
              name="specialProcessing"
              onChange={handleSpecialProcessingChange}
              checked={formik.values.specialProcessing}
              className="mt-2"
            />
          </Form.Group>

          {formik.values.specialProcessing && (
            <>
              {/* Custom Entity Use Code Option */}
              <Form.Group controlId="entityUseCodeOptionCustom">
                <Form.Check
                  type="radio"
                  label="Match a column from your template to the Entity use code column"
                  name="entityUseCodeOption"
                  value="custom"
                  onChange={formik.handleChange}
                  checked={formik.values.entityUseCodeOption === 'custom'}
                  className="mt-2"
                />
              </Form.Group>

              {formik.values.entityUseCodeOption === 'custom' && (
                <Form.Group
                  as={Row}
                  controlId="columnMappings.entityUseCodeCustom"
                >
                  <Col sm="8">
                    <Form.Control
                      as="select"
                      name="columnMappings.entityUseCode"
                      onChange={formik.handleChange}
                      value={formik.values.columnMappings.entityUseCode || ''}
                      className="mt-2"
                    >
                      <option value="">Select a column</option>
                      {columnHeaders.map((header, index) => (
                        <option key={index} value={header}>
                          {header}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </Form.Group>
              )}

              {/* Default Entity Use Code Option */}
              <Form.Group controlId="entityUseCodeOptionDefault">
                <Form.Check
                  type="radio"
                  label="Assign one entity use code to all the transactions"
                  name="entityUseCodeOption"
                  value="default"
                  onChange={formik.handleChange}
                  checked={formik.values.entityUseCodeOption === 'default'}
                  className="mt-2"
                />
              </Form.Group>

              {formik.values.entityUseCodeOption === 'default' && (
                <Form.Group
                  as={Row}
                  controlId="columnMappings.entityUseCodeDefault"
                >
                  <Col sm="8">
                    <Form.Control
                      as="select"
                      name="columnMappings.entityUseCode"
                      onChange={formik.handleChange}
                      value={formik.values.columnMappings.entityUseCode || ''}
                      className="mt-2"
                    >
                      <option value="">Select a column</option>
                      {defaultEntityUseCodes.map((header, index) => (
                        <option key={index} value={header}>
                          {header}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </Form.Group>
              )}
            </>
          )}
        </div>
      </Form>
    </div>
  );
});

export default ImportSettings;
