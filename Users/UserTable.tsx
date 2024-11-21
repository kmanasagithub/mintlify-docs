import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Card, Col, Dropdown, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { createSelector } from 'reselect';
import {
  getUsers as onGetUsers,
  deleteUsers as onDeleteUsers,
} from '../../../slices/thunk';
import TableContainer from '../../../Common/Tabledata/TableContainer';
import { DeleteModal } from '../../../Common/DeleteModal';
import { handleSearchData } from '../../../Common/Tabledata/SorttingData';
import EditUsers from '../../../Common/CrudModal/EditUsers';
import AddUsers from '../../../Common/CrudModal/AddUsers';
import NoSearchResult from '../../../Common/Tabledata/NoSearchResult';

interface userProps {
  isShow: any;
  hideUserModal: any;
}

const UserTable = ({ isShow, hideUserModal }: userProps) => {
  const dispatch = useDispatch();

  const selectUsersList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      usersList: invoices.usersList,
    })
  );

  const { usersList } = useSelector(selectUsersList);

  const [users, setUsers] = useState<any>([]);

  useEffect(() => {
    dispatch(onGetUsers());
  }, [dispatch]);

  useEffect(() => {
    setUsers(usersList);
  }, [usersList]);

  // Delete modal

  const [delet, setDelet] = useState<boolean>(false);
  const [deletid, setDeletid] = useState<any>();

  const handleDeleteModal = useCallback(
    (email: any) => {
      setDelet(!delet);
      setDeletid(email);
    },
    [delet]
  );

  const handleDeleteId = () => {
    dispatch(onDeleteUsers(deletid.email));
    setDelet(false);
  };

  // Forget Password

  const [handleForgetPassword, setForgetPassword] = useState<boolean>(false);
  const [ForgetPasswordid, setForgetPasswordid] = useState<any>();

  const handleForgetPasswordModal = useCallback(
    (id: any) => {
      // Rename the function to avoid conflicts
      setForgetPassword(!handleForgetPassword);
      setForgetPasswordid(id);
    },
    [handleForgetPassword]
  );

  // search
  const handleSearch = (ele: any) => {
    let item = ele.value;

    if (item === 'All Tasks') {
      setUsers([...usersList]);
    } else {
      handleSearchData({ data: usersList, item: item, setState: setUsers });
    }
  };
  //    console.log(users)
  const [editUser, setEditUser] = useState<boolean>(false);
  const [edit, setEdit] = useState<any>();

  const handleCloseEdit = () => setEditUser(false);
  const handleEditUser = (item: any) => {
    setEditUser(true);
    setEdit({
      email: item.email,
      first_name: item.first_name,
      last_name: item.last_name,
      username: item.username,
      company_name: item.company_name,
      access_type: item.access_type,
      access_level: item.access_level,
    });
  };

  interface columnsType {
    Header: any;
    accessor: string;
    key?: string;
    Filter: boolean;
    isSortable: boolean;
    Cell?: (cell: any) => any;
  }

  const columns: columnsType[] = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Filter: false,
        isSortable: true,
        Cell: ({ row }) =>
          `${row.original.first_name} ${row.original.last_name}`,
      },

      {
        Header: 'Email',
        accessor: 'email',
        Filter: false,
        isSortable: true,
      },

      {
        Header: 'User Name',
        accessor: 'username',
        Filter: false,
        isSortable: true,
        Cell: ({ cell }) => cell.value || 'N/A',
      },

      {
        Header: 'Registered Date',
        accessor: 'created_at',
        Filter: false,
        isSortable: true,
      },

      //           {
      //             Header: "Modified Date",
      //             accessor: "updated_at",
      //             Filter: false,
      //             isSortable: true
      //           },

      //   {
      //     Header: "STATUS",
      //     accessor: "status",
      //     Filter: false,
      //     isSortable: true,
      //     Cell: (cell) => {
      //         switch (cell.row.original.status) {
      //             case "Active":
      //                 return <span className="badge bg-success-subtle text-success p-2">{cell.row.original.status}</span>
      //             case "Disabled":
      //                 return <span className="badge bg-danger-subtle text-danger p-2">{cell.row.original.status}</span>
      //             default:
      //                 return <span className="badge bg-success-subtle text-success p-2">{cell.row.original.status}</span>
      //         }
      //     }
      //   },
      {
        Header: 'ACTION',
        accessor: 'action',
        Filter: false,
        style: { width: '12%' },

        isSortable: false,
        Cell: (cell: any) => (
          <ul className="list-inline hstack gap-2 mb-0">
            {/* <li className="list-inline-item" data-bs-toggle="tooltip" data-bs-trigger="hover" data-bs-placement="top" aria-label="View" data-bs-original-title="View">
                                <Link to="#" className="btn btn-soft-info btn-sm d-inline-block">
                                    <i className="las la-eye fs-17 align-middle"></i>
                                </Link>
                            </li> */}
            <li
              className="list-inline-item edit"
              onClick={() => {
                const item = cell.row.original;
                handleEditUser(item);
              }}
            >
              <Link to="#" className="btn btn-soft-info btn-sm d-inline-block">
                Details
                {/* <i className="las la-pen fs-17 align-middle"></i> */}
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
    [handleDeleteModal]
  );

  return (
    <React.Fragment>
      <Row className="pb-4 gy-3">
        <Col sm={4}>
          <Link to="#" onClick={hideUserModal}>
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
                onChange={(e: any) => handleSearch(e.target)}
              />
              <i className="las la-search search-icon"></i>
            </div>
            <Dropdown>
              <Dropdown.Toggle
                as="button"
                variant="info"
                className="btn btn-soft-info btn-icon fs-14 arrow-none"
              >
                <i className="las la-ellipsis-v fs-18"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item>All</Dropdown.Item>
                <Dropdown.Item>Last Week</Dropdown.Item>
                <Dropdown.Item>Last Month</Dropdown.Item>
                <Dropdown.Item>Last Year</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </Row>

      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body>
              {users && users.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns}
                  data={users || []}
                  customPageSize={9}
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

      <AddUsers
        isShow={isShow}
        handleClose={hideUserModal}
        handleShow={isShow}
      />

      <EditUsers isShow={editUser} handleClose={handleCloseEdit} edit={edit} />

      <DeleteModal
        show={delet}
        handleClose={handleDeleteModal}
        deleteModalFunction={handleDeleteId}
      />
      <ToastContainer />
    </React.Fragment>
  );
};

export default UserTable;
