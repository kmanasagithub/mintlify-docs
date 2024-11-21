import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Col, Dropdown, Form, Row, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import TableContainer from '../../../Common/Tabledata/TableContainer';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCustomerList as onGetCustomerList,
  deleteCustomerList as onDeleteCustomerList,
} from '../../../slices/thunk';
import { ToastContainer } from 'react-toastify';
import { createSelector } from 'reselect';
import NoSearchResult from '../../../Common/Tabledata/NoSearchResult';
import { DeleteModal } from '../../../Common/DeleteModal';
import { handleSearchData } from '../../../Common/Tabledata/SorttingData';
import BreadCrumb from '../../../Common/BreadCrumb';
import EditCustomerList from '../../../Common/CrudModal/EditCustomerList';

interface Customer {
  id: string;
  customer_code: string;
  customer_name: string;
  customer_entity: {
    entity_id: string;
  };
  external_address: {
    address_line1: string;
    address_line2: string;
  };
  contact: {
    email: string;
  };
}

interface PrimaryEntity {
  id: string;
  name: string;
  parent_entity_id: string | null;
  created_at: string;
  is_default: boolean;
}

const CustomerTable: React.FC = () => {
  const dispatch = useDispatch();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [visibleCustomerIds, setVisibleCustomerIds] = useState<{
    [key: string]: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [primaryEntity, setPrimaryEntity] = useState<PrimaryEntity | null>(
    null
  );

  const selectCustomerList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      customerList: invoices.customerList,
    })
  );

  const selectEntitiesList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      entitiesList: invoices.entitiesList,
    })
  );

  const { customerList } = useSelector(selectCustomerList);
  const { entitiesList } = useSelector(selectEntitiesList);

  // Set the primary entity based on the entities list
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

  // Filter customers based on the primary entity
  useEffect(() => {
    if (customerList && primaryEntity) {
      const filteredCustomers = customerList.filter(
        (customer: Customer) =>
          customer.customer_entity?.entity_id === primaryEntity.id
      );
      setCustomers(filteredCustomers);
      setIsLoading(false);
    } else {
      setCustomers([]);
      setIsLoading(false);
    }
  }, [customerList, primaryEntity]);

  useEffect(() => {
    dispatch(onGetCustomerList() as any);
  }, [dispatch]);

  // Delete modal handling
  const [delet, setDelet] = useState<boolean>(false);
  const [deletid, setDeletid] = useState<any>();
  const handleDeleteModal = useCallback(
    (id: any) => {
      setDelet(!delet);
      setDeletid(id);
    },
    [delet]
  );

  const handleDeleteId = () => {
    dispatch(onDeleteCustomerList(deletid.id) as any);
    setDelet(false);
  };

  // Toggle visibility of customer ID
  const toggleVisibility = (id: string) => {
    setVisibleCustomerIds((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // Search handling
  const handleSearch = (ele: any) => {
    let item = ele.value;

    if (item === 'All Tasks') {
      setCustomers([...customerList]);
    } else {
      handleSearchData({
        data: customerList,
        item: item,
        setState: setCustomers,
      });
    }
  };

  // Edit handling
  const [editCustomer, setEditCustomer] = useState<boolean>(false);
  const [edit, setEdit] = useState<any>();
  const handleCloseEdit = () => setEditCustomer(false);
  const handleEditCustomer = (item: Customer) => {
    setEditCustomer(true);
    setEdit(item);
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Customer Id',
        accessor: 'id',
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => {
          const customerId = cell.row.original.id;
          const isVisible = visibleCustomerIds[customerId];
          const displayedId = isVisible
            ? customerId
            : `${customerId.slice(-6)}`;

          return (
            <>
              {displayedId}
              <Link
                to="#"
                onClick={() => toggleVisibility(customerId)}
                className="ms-2"
              >
                <i className={`bi bi-eye${isVisible ? '-slash' : ''}`}></i>
              </Link>
            </>
          );
        },
      },
      {
        Header: 'Customer code',
        accessor: 'customer_code',
        Filter: false,
        isSortable: true,
      },
      {
        Header: 'Customer name',
        accessor: 'customer_name',
        Filter: false,
        isSortable: true,
      },
      {
        Header: 'Address',
        accessor: 'external_address',
        Filter: false,
        isSortable: true,
        Cell: ({ row }: any) => (
          <>
            {row.original.external_address?.address_line1 ?? 'N/A'}{' '}
            {row.original.external_address?.address_line2 ?? ''}
          </>
        ),
      },
      {
        Header: 'Email',
        accessor: 'contact.email',
        Filter: false,
        isSortable: true,
        Cell: ({ row }: any) => <>{row.original.contact?.email ?? 'N/A'}</>,
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
                handleEditCustomer(item);
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
                handleDeleteModal(item);
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
    [handleEditCustomer]
  );

  return (
    <React.Fragment>
      <div className="page-content pb-4 gy-3">
        <Container fluid>
          <BreadCrumb pageTitle="Customers" title="Customers" />
          <Row>
            <Col sm={12}>
              <Link to="/add-customer">
                <i className="las la-plus me-1"></i> Add New
              </Link>
            </Col>

            <div className="col-sm-auto ms-auto">
              <div className="d-flex gap-3">
                <div className="search-box">
                  <Form.Control
                    type="text"
                    id="searchMemberList"
                    placeholder="Search for Result"
                    onChange={(e: any) => handleSearch(e.target)}
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

          <Row className="mt-4">
            <Col xl={12}>
              <Card>
                <Card.Body>
                  {customers && customers.length > 0 ? (
                    <TableContainer
                      isPagination={true}
                      columns={columns}
                      data={customers} // Pass the filtered customers here
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
        </Container>
      </div>
      <DeleteModal
        show={delet}
        handleClose={handleDeleteModal}
        deleteModalFunction={handleDeleteId}
      />
      <EditCustomerList
        isShow={editCustomer}
        handleClose={handleCloseEdit}
        edit={edit}
      />
      <ToastContainer />
    </React.Fragment>
  );
};

export default CustomerTable;
