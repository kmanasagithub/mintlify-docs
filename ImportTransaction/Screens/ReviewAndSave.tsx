import React, { useState } from 'react';
import { FormData } from '../types';
import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';

interface ReviewAndSaveProps {
  data: FormData;
  updateData: (data: Partial<FormData>) => void;
}

const ReviewAndSave: React.FC<ReviewAndSaveProps> = ({ data, updateData }) => {
  const [showTemplateInput, setShowTemplateInput] = useState(false);
  const formik = useFormik({
    initialValues: {
      template: false,
      templateName: '',
    },
    onSubmit: (values: any) => {},
  });
  console.log('data', data);
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setShowTemplateInput(checked);
    formik.setFieldValue('template', checked);
  };

  const renderFields = (section: { [key: string]: any } | null) => {
    if (section === null) {
      return null; // Handle null case
    }

    return Object.entries(section).map(([key, value]) => {
      // Ensure value is not null and is an object before further processing
      if (typeof value === 'object' && value !== null) {
        if (Object.keys(value).length > 0) {
          return (
            <div key={key}>
              <h4>{key}</h4>
              {renderFields(value)}{' '}
              {/* Recursively render fields for nested objects */}
            </div>
          );
        }
        return null; // Skip empty objects
      } else {
        // Render non-object values directly
        return (
          <p key={key}>
            <strong>{key}:</strong> {value?.toString()}
          </p>
        );
      }
    });
  };

  const renderSection = (sectionData: any[], sectionName: string) => {
    const hasValidData = sectionData?.some((item) => {
      if (item === null || typeof item !== 'object') return false; // Check for null and non-object items
      return Object.keys(item).length > 0; // Only consider non-empty objects
    });

    return (
      <div>
        <h3 className="mt-4">{sectionName}</h3>
        {hasValidData ? (
          sectionData.map((item: any, index: number) =>
            item && typeof item === 'object' && Object.keys(item).length > 0 ? (
              <div className="ms-2" key={index}>
                {renderFields(item)}
              </div>
            ) : null
          )
        ) : (
          <div className="ms-4">Not Mapped</div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2>Review and Save</h2>
      <p className="mt-2 custom-paragraph">
        These are the columns and attributes you mapped for calculating tax on
        your transactions. Look over your choices to make sure everything’s
        correct before you finish importing your transaction data.
      </p>

      {renderSection(data.importSettings, 'Import Settings')}
      {renderSection(data.requiredColumns, 'Required Columns')}
      {renderSection(data.attributes, 'Attributes')}
      {renderSection(data.optionalColumns, 'Optional Columns')}

      <h3 className="mt-4">Save as Template</h3>
      <p className="mt-2 custom-paragraph">
        This makes it faster the next time you import transactions using this
        file.
      </p>

      <Form onSubmit={formik.handleSubmit}>
        <Form.Group controlId="template">
          <Form.Check
            type="checkbox"
            label="Save this mapping as a template"
            onChange={handleCheckboxChange}
            checked={formik.values.template}
          />
        </Form.Group>

        {showTemplateInput && (
          <Form.Group controlId="templateName" className="mt-3">
            <Form.Label>Template Name</Form.Label>
            <Form.Control
              type="text"
              name="templateName"
              placeholder="Enter template name"
              value={formik.values.templateName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={
                !!formik.errors.templateName && formik.touched.templateName
              }
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.templateName}
            </Form.Control.Feedback>
          </Form.Group>
        )}
      </Form>
    </div>
  );
};

export default ReviewAndSave;
