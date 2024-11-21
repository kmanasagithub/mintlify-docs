import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Col, Dropdown, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import TableContainer from '../../../Common/Tabledata/TableContainer';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEntities as onGetEntities,
  deleteEntities as onDeleteEntities,
} from '../../../slices/thunk';
import { ToastContainer } from 'react-toastify';
import { createSelector } from 'reselect';
import NoSearchResult from '../../../Common/Tabledata/NoSearchResult';
import { DeleteModal } from '../../../Common/DeleteModal';
import { handleSearchData } from '../../../Common/Tabledata/SorttingData';
import EditEntities from '../../../Common/CrudModal/EditEntities';

interface Entity {
  id: any;
  name: string;
  parent_entity_id: string | null;
  phone: string | null;
  tax_id: string | null;
  doBusinessInEU: boolean;
  attributes: [];
  companyType: string | null;
  is_online_marketplace: boolean;
  taxCollection: boolean;
  taxCollectionSeparate: boolean;
}

const EntityTable: React.FC = () => {
  const dispatch = useDispatch();

  const selectEntitiesList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      entitiesList: invoices.entitiesList,
    })
  );

  const { entitiesList } = useSelector(selectEntitiesList);

  const [entities, setEntities] = useState<Entity[]>([]);
  const [delet, setDelet] = useState<boolean>(false);
  const [deletid, setDeletid] = useState<string>('');
  const [editEntity, setEditEntity] = useState<boolean>(false);
  const [edit, setEdit] = useState<Partial<Entity> | null>(null);

  useEffect(() => {
    dispatch(onGetEntities());
  }, [dispatch]);

  useEffect(() => {
    if (entitiesList && entitiesList.length > 0) {
      setEntities(entitiesList);
    }
  }, [entitiesList]);

  const handleDeleteModal = useCallback(
    (id: string) => {
      setDelet(!delet);
      setDeletid(id);
    },
    [delet]
  );

  const handleDeleteId = () => {
    dispatch(onDeleteEntities(deletid));
    setDelet(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const item = e.target.value;
    if (item === 'All Tasks') {
      setEntities([...entitiesList]);
    } else {
      handleSearchData({ data: entitiesList, item, setState: setEntities });
    }
  };

  const handleCloseEdit = () => setEditEntity(false);
  const handleEditProduct = (item: Entity) => {
    setEditEntity(true);
    setEdit(item);
  };

  const getParentCompanyName = useCallback(
    (parentId: string | null) => {
      if (!parentId) return 'No Parent';
      const parentEntity = entities.find((entity) => entity.id === parentId);
      return parentEntity ? parentEntity.name : 'No Parent';
    },
    [entities] // Use the local state instead of entitiesList
  );

  interface ColumnsType {
    Header: any;
    accessor: string;
    key?: string;
    Filter: boolean;
    isSortable: boolean;
    Cell?: (cell: any) => JSX.Element;
  }

  const columns: ColumnsType[] = useMemo(
    () => [
      {
        Header: () => (
          <Form>
            <Form.Check type="checkbox" />
          </Form>
        ),
        accessor: 'id',
        key: 'id',
        Filter: false,
        isSortable: false,
        width: 50,
        Cell: () => (
          <Form>
            <Form.Check type="checkbox" />
          </Form>
        ),
      },
      {
        Header: 'Entity',
        accessor: 'name',
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => (
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <h6 className="fs-16 mb-1">{cell.row.original.name}</h6>
            </div>
          </div>
        ),
      },
      {
        Header: 'Parent Entity',
        accessor: 'parent_entity_id',
        Filter: false,
        isSortable: true,
        Cell: ({ value }: { value: string | null }) => (
          <>{getParentCompanyName(value)}</>
        ),
      },
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
                handleEditProduct(item);
              }}
            >
              <Link to="#" className="btn btn-soft-info btn-sm d-inline-block">
                Details
              </Link>
            </li>
            <li
              className="list-inline-item"
              onClick={() => {
                const item = cell.row.original;
                handleDeleteModal(cell.row.original.id);
              }}
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
    [entities, getParentCompanyName, handleDeleteModal, handleEditProduct]
  );

  //         <Dropdown>
  //           <Dropdown.Toggle as="button" className="btn btn-soft-secondary btn-sm arrow-none">
  //             <i className="las la-ellipsis-h align-middle fs-18"></i>
  //           </Dropdown.Toggle>
  //           <Dropdown.Menu className="dropdown-menu-end">
  //             <li>
  //               <Dropdown.Item onClick={() => handleEditProduct(cell.row.original)}>
  //                 <i className="las la-pen fs-18 align-middle me-2 text-muted"></i>
  //                 Edit
  //               </Dropdown.Item>
  //             </li>
  //             <li className="dropdown-divider"></li>
  //             <li>
  //               <Dropdown.Item onClick={() => handleDeleteModal(cell.row.original.id)}>
  //                 <i className="las la-trash-alt fs-18 align-middle me-2 text-muted"></i>
  //                 Delete
  //               </Dropdown.Item>
  //             </li>
  //           </Dropdown.Menu>
  //         </Dropdown>
  //       ),
  //     },
  //   ],
  //   [getParentCompanyName, handleDeleteModal]
  // );

  return (
    <React.Fragment>
      <Row className="pb-4 gy-3">
        <Col sm={4}>
          <Link to="/add-entity">
            <i className="las la-plus-circle me-1"></i> Add New
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
            <Dropdown>
              <Dropdown.Toggle
                as="button"
                className="btn btn-soft-info btn-icon fs-14 arrow-none"
              >
                <i className="las la-ellipsis-v fs-18"></i>
              </Dropdown.Toggle>
            </Dropdown>
          </div>
        </div>
      </Row>

      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body>
              {entities && entities.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns}
                  data={entities}
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
      <EditEntities
        isShow={editEntity}
        handleClose={handleCloseEdit}
        edit={edit}
      />
      <DeleteModal
        show={delet}
        handleClose={handleDeleteModal}
        deleteModalFunction={handleDeleteId}
      />
      <ToastContainer />
    </React.Fragment>
  );
};

export default EntityTable;
