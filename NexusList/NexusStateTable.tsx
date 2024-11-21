import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Col, Form, Row, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import TableContainer from '../../../Common/Tabledata/TableContainer';
import { ToastContainer } from 'react-toastify';
import NoSearchResult from '../../../Common/Tabledata/NoSearchResult';
import { DeleteModal } from '../../../Common/DeleteModal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as XLSX from 'xlsx';
import { createSelector } from 'reselect';
import Papa from 'papaparse';
import EditNexus from '../EditNexus/EditNexus';
import { useDispatch, useSelector } from 'react-redux';

import {
  getNexus as onGetNexus,
  deleteNexus as onDeleteNexus,
} from '../../../slices/thunk';

interface StateData {
  id: string;
  entity_id: string;
  country: string;
  region: string;
  juris_type_id: string;
  jurisdiction_type_id: string;
  juris_name: string;
  effective_date: string;
  end_date: string;
  short_name: string;
  nexus_type_id: string;
  recommendation_items: string[];
  local_taxes: any;
}

interface ColumnDefinition {
  id: string;
  Header: string;
  accessor: string;
}

interface PrimaryEntity {
  id: any;
  name: string;
  is_default: boolean;
}

const NexusStateTable: React.FC = () => {
  const [nexus, setNexus] = useState<StateData[]>([]);
  const [delet, setDelet] = useState<boolean>(false);
  const [deletid, setDeletid] = useState<string>('');
  const [showCustomizeModal, setShowCustomizeModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<string>('csv');

  const initialColumns: ColumnDefinition[] = [
    { id: 'juris_name', Header: 'State', accessor: 'juris_name' },
    { id: 'nexus_type_id', Header: 'Tax type', accessor: 'nexus_type_id' },
    { id: 'local_taxes', Header: 'Local taxes', accessor: 'local taxes' },
    {
      id: 'effective_date',
      Header: 'Effective date',
      accessor: 'effective_date',
    },
    { id: 'end_date"', Header: 'Expiration date', accessor: 'end_date' },
    { id: 'updated_at', Header: 'Last modified', accessor: 'updated_at' },
  ];

  const [shownColumns, setShownColumns] = useState<ColumnDefinition[]>(
    initialColumns.slice(0, 6)
  );
  const [hiddenColumns, setHiddenColumns] = useState<ColumnDefinition[]>(
    initialColumns.slice(6)
  );
  const [primaryEntity, setPrimaryEntity] = useState<PrimaryEntity | null>(
    null
  );
  const selectLocationsList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      NexusList: invoices.NexusList,
    })
  );

  const { NexusList } = useSelector(selectLocationsList);
  const selectEntitiesList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      entitiesList: invoices.entitiesList,
    })
  );
  const { entitiesList } = useSelector(selectEntitiesList);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onGetNexus());
  }, [dispatch]);

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
    if (NexusList && primaryEntity) {
      const filteredLocations = NexusList.filter(
        (nexus: StateData) =>
          nexus.entity_id === primaryEntity.id &&
          (nexus.jurisdiction_type_id === 'state' ||
            nexus.jurisdiction_type_id === 'State')
      );
      setNexus(filteredLocations);
    } else {
      setNexus([]);
    }
  }, [NexusList, primaryEntity]);

  const handleDeleteModal = useCallback(
    (id: string) => {
      setDelet(!delet);
      setDeletid(id);
    },
    [delet]
  );

  const handleDeleteId = () => {
    dispatch(onDeleteNexus(deletid));
    setDelet(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm === '') {
      // Reset to the original list of locations
      if (NexusList && primaryEntity) {
        const filteredLocations = NexusList.filter(
          (nexus: StateData) =>
            nexus.entity_id === primaryEntity.id &&
            nexus.jurisdiction_type_id === 'state'
        );
        setNexus(filteredLocations);
      }
    } else {
      const filteredData = nexus.filter((item: StateData) => {
        return (
          (item.juris_name &&
            item.juris_name.toLowerCase().includes(searchTerm)) ||
          (item.nexus_type_id &&
            item.nexus_type_id.toLowerCase().includes(searchTerm)) ||
          (item.jurisdiction_type_id &&
            item.jurisdiction_type_id.toLowerCase().includes(searchTerm)) ||
          (item.effective_date &&
            item.effective_date.toLowerCase().includes(searchTerm)) ||
          (item.end_date && item.end_date.toLowerCase().includes(searchTerm))
        );
      });
      setNexus(filteredData);
    }
  };

  const [editNexus, setEditNexus] = useState<boolean>(false);
  const [edit, setEdit] = useState<any>();
  const [showEdit, setShowEdit] = useState(false);

  const handleEditLocations = (item: StateData) => {
    setEditNexus(true);
    setEdit(item);
    setShowEdit(true);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    let updatedShownColumns = [...shownColumns];
    let updatedHiddenColumns = [...hiddenColumns];

    // Remove item from the source list
    if (result.source.droppableId === 'shownColumns') {
      const [removed] = updatedShownColumns.splice(result.source.index, 1);
      // Add item to the destination list
      if (result.destination.droppableId === 'shownColumns') {
        updatedShownColumns.splice(result.destination.index, 0, removed);
      } else {
        updatedHiddenColumns.splice(result.destination.index, 0, removed);
      }
    } else {
      const [removed] = updatedHiddenColumns.splice(result.source.index, 1);
      // Add item to the destination list
      if (result.destination.droppableId === 'shownColumns') {
        updatedShownColumns.splice(result.destination.index, 0, removed);
      } else {
        updatedHiddenColumns.splice(result.destination.index, 0, removed);
      }
    }

    setShownColumns(updatedShownColumns);
    setHiddenColumns(updatedHiddenColumns);
  };

  const columns = useMemo(
    () => [
      ...shownColumns.map((col) => ({
        Header: col.Header,
        accessor: col.accessor,
        Filter: false,
        isSortable: true,
      })),
      {
        Header: 'Action',
        accessor: 'action',
        Filter: false,
        isSortable: false,
        Cell: (cell: any) => (
          <ul className="list-inline hstack gap-2 mb-0">
            <li
              className="list-inline-item edit"
              onClick={() => {
                const item = cell.row.original;
                handleEditLocations(item);
              }}
            >
              <Link to="#" className="btn btn-soft-info btn-sm d-inline-block">
                Details
                {/* <i className="las la-pen fs-17 align-middle"></i> */}
              </Link>
            </li>
            <li
              className="list-inline-item"
              onClick={() => handleDeleteModal(cell.row.original.id)}
            >
              <Link
                to="#"
                className="btn btn-soft-danger btn-sm d-inline-block"
              >
                <i className="bi bi-trash fs-17 align-middle"></i>
              </Link>
            </li>
          </ul>
        ),
      },
    ],
    [shownColumns, handleDeleteModal]
  );

  const draggableItemStyle: React.CSSProperties = {
    userSelect: 'none',
    padding: '8px 16px',
    margin: '0 8px',
    backgroundColor: 'rgba(173, 216, 230, 0.3)', // Light blue with transparency
    color: 'black',
    borderRadius: '4px',
    cursor: 'grab',
    backdropFilter: 'blur(10px)', // Glass-like appearance
    border: '1px solid rgba(173, 216, 230, 0.5)', // Optional: border to enhance effect
  };

  const droppableContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const handleExportToXlsx = () => {
    const ws = XLSX.utils.json_to_sheet(nexus);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Locations');
    XLSX.writeFile(wb, 'Nexus.xlsx');
  };

  const handleExportToCsv = () => {
    const csv = Papa.unparse(nexus);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Nexus.csv';
    link.click();
  };

  const handleExport = () => {
    if (exportFormat === 'csv') {
      handleExportToCsv();
    } else {
      handleExportToXlsx();
    }
    setShowExportModal(false);
  };

  const handleCancelClick = () => {
    setShowEdit(false);
  };

  return (
    <>
      {' '}
      {!showEdit ? (
        <>
          <Row className="pb-4 gy-3">
            <Col sm={2}>
              <Link to="/add-nexus">
                <i className="las la-plus-circle me-1"></i> Add New
              </Link>
              <span style={{ paddingLeft: '20px' }}></span>
            </Col>
            <Col sm={2}>
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowExportModal(true);
                }}
              >
                <span style={{ color: '#477bf9' }}>
                  <i className="las la-lightbulb me-1"></i> Export States
                </span>{' '}
              </Link>
            </Col>

            <div className="col-sm-auto ms-auto">
              <div className="d-flex gap-3">
                <div className="search-box">
                  <Form.Control
                    type="text"
                    id="searchMemberList"
                    placeholder="Search for Result"
                    onChange={handleSearch}
                  />
                  <i className="las la-search search-icon"></i>
                </div>
                <Button onClick={() => setShowCustomizeModal(true)}>
                  Customize Columns
                </Button>
              </div>
            </div>
          </Row>

          <Modal
            show={showCustomizeModal}
            onHide={() => setShowCustomizeModal(false)}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Customize Columns</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <DragDropContext onDragEnd={onDragEnd}>
                <Row>
                  <Col>
                    <h5>Columns Shown in Grid</h5>
                    <Droppable droppableId="shownColumns" direction="vertical">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={droppableContainerStyle}
                        >
                          {shownColumns.length > 0 ? (
                            shownColumns.map((column, index) => (
                              <Draggable
                                key={column.id}
                                draggableId={column.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      ...draggableItemStyle,
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {column.Header}
                                  </div>
                                )}
                              </Draggable>
                            ))
                          ) : (
                            <div>No columns available</div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Col>
                  <Col>
                    <h5>Columns Not Shown in Grid</h5>
                    <Droppable droppableId="hiddenColumns" direction="vertical">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={droppableContainerStyle}
                        >
                          {hiddenColumns.length > 0 ? (
                            hiddenColumns.map((column, index) => (
                              <Draggable
                                key={column.id}
                                draggableId={column.id}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      ...draggableItemStyle,
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    {column.Header}
                                  </div>
                                )}
                              </Draggable>
                            ))
                          ) : (
                            <div>No columns available</div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Col>
                </Row>
              </DragDropContext>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowCustomizeModal(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShownColumns([...shownColumns]);
                  setHiddenColumns([...hiddenColumns]);
                  setShowCustomizeModal(false);
                }}
              >
                Done
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal
            show={showExportModal}
            onHide={() => setShowExportModal(false)}
          >
            <Modal.Header closeButton>
              <Modal.Title>Export Locations</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Check
                  type="radio"
                  label="Export as CSV"
                  name="exportFormat"
                  id="csv"
                  checked={exportFormat === 'csv'}
                  onChange={() => setExportFormat('csv')}
                />
                <Form.Check
                  type="radio"
                  label="Export as XLSX"
                  name="exportFormat"
                  id="xlsx"
                  checked={exportFormat === 'xlsx'}
                  onChange={() => setExportFormat('xlsx')}
                />
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={() => setShowExportModal(false)}
              >
                Close
              </Button>
              <Button variant="primary" onClick={handleExport}>
                Export
              </Button>
            </Modal.Footer>
          </Modal>

          <Row>
            <Col xl={12}>
              <Card>
                <Card.Body>
                  {nexus.length > 0 ? (
                    <TableContainer
                      isPagination={true}
                      columns={columns}
                      data={nexus}
                      customPageSize={8}
                      divClassName="table-card table-responsive"
                      tableClass="table-hover table-nowrap align-middle mb-0"
                      isBordered={false}
                      PaginationClass="align-items-center mt-4 gy-3"
                    />
                  ) : (
                    <NoSearchResult />
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <EditNexus onCancel={handleCancelClick} edit={edit} />
      )}
      <DeleteModal
        show={delet}
        handleClose={() => setDelet(false)}
        deleteModalFunction={handleDeleteId}
      />
      <ToastContainer />
    </>
  );
};

export default NexusStateTable;
