import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Table, Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

interface LocalTax {
  id: string;
  juris_name: string;
  juris_type: string;
  nexus_type: string;
  region: string;
  local_taxes?: LocalTax[];
}

interface GridData {
  selectedTaxes: LocalTax[];
}

interface LocalTaxGridProps {
  onData: (data: GridData) => void;
  onCancel: () => void;
  stateName: string;
  localTaxesArray: LocalTax[];
}

const LocalTaxGrid: React.FC<LocalTaxGridProps> = ({
  onData,
  onCancel,
  stateName,
  localTaxesArray,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      selectedTaxes: [] as LocalTax[], // Storing full tax objects
    },
    validationSchema: Yup.object({
      selectedTaxes: Yup.array().min(1, 'Select at least one tax'),
    }),
    onSubmit: (values: any) => {
      onData({ selectedTaxes: values.selectedTaxes });
      onCancel();
    },
  });

  const handleTaxChange = (tax: LocalTax, isChecked: boolean) => {
    const updatedSelection = isChecked
      ? [...formik.values.selectedTaxes, tax]
      : formik.values.selectedTaxes.filter(
          (selectedTax: LocalTax) => selectedTax.id !== tax.id
        );
    formik.setFieldValue('selectedTaxes', updatedSelection);
    setSelectAll(updatedSelection.length === filteredTaxes.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      formik.setFieldValue('selectedTaxes', []);
      setSelectAll(false);
    } else {
      formik.setFieldValue('selectedTaxes', filteredTaxes);
      setSelectAll(true);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setSelectAll(false); // Reset "select all" when searching
  };

  const filteredTaxes = localTaxesArray.filter((tax) =>
    tax.juris_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Form onSubmit={formik.handleSubmit}>
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search taxes..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </InputGroup>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p>
          {formik.values.selectedTaxes.length} of {filteredTaxes.length} taxes
          selected
        </p>
        <Link to="#" onClick={handleSelectAll}>
          {selectAll ? 'Deselect all' : 'Select all'}
        </Link>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Local jurisdiction</th>
            <th>Tax name</th>
            <th>Jurisdiction type</th>
            <th>Tax type</th>
            <th>Tax subtype</th>
          </tr>
        </thead>
        <tbody>
          {filteredTaxes.map((tax: LocalTax) => (
            <tr key={tax.id}>
              <td className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  checked={formik.values.selectedTaxes.some(
                    (selectedTax: LocalTax) => selectedTax.id === tax.id
                  )}
                  onChange={(e) => handleTaxChange(tax, e.target.checked)}
                  style={{ marginRight: '10px' }}
                />
                {tax.juris_name}
              </td>
              <td>{tax.nexus_type}</td>
              <td>{tax.juris_type}</td>
              <td>{tax.nexus_type}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </Table>
      {formik.errors.selectedTaxes && (
        <div className="text-danger">{formik.errors.selectedTaxes}</div>
      )}
      <Button
        type="submit"
        variant="outline-primary"
        style={{ marginTop: '10px', marginBottom: '20px' }}
      >
        Submit
      </Button>
      <Button
        variant="outline-primary"
        style={{ marginTop: '10px', marginBottom: '20px', marginLeft: '20px' }}
        onClick={onCancel}
      >
        Cancel
      </Button>
    </Form>
  );
};

export default LocalTaxGrid;
