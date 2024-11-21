import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Col, Dropdown, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import TableContainer from '../../../Common/Tabledata/TableContainer';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProductList as onGetProductList,
  deleteProductList as onDeleteProductList,
} from '../../../slices/thunk';
import { ToastContainer } from 'react-toastify';
import { createSelector } from 'reselect';
import NoSearchResult from '../../../Common/Tabledata/NoSearchResult';
import { DeleteModal } from '../../../Common/DeleteModal';
import { handleSearchData } from '../../../Common/Tabledata/SorttingData';
import EditProductList from '../../../Common/CrudModal/EditProductList';
import ExportProductsModal from '../../InvoiceManagement/AddProduct/ExportProductsData';

interface PrimaryEntity {
  id: any;
  name: string;
  parent_entity_id: string | null;
}

// Define types
interface Product {
  id: string;
  entity_id: string;
  tax_code: string;
  price: number;
  product_code: string;
  product_group: string;
  category: string;
  description: string;
  age_group: string;
  asin: string;
  availability: string;
  color: string;
  condition: string;
  ean: string;
  gender: string;
  google_product_category: string;
  gtin: string;
  height: string;
  hs_hint: string;
  image_link: string;
  link: string;
  material: string;
  mpn: string;
  sale_price: string;
  sale_price_effective_date: string;
  shipping: string;
  shipping_weight: string;
  size: string;
  sku: string;
  summary: string;
  upc: string;
  width: string;
  height_unit: string;
  shipping_weight_unit: string;
  width_unit: string;
}

const ProductlistTable: React.FC = () => {
  const dispatch = useDispatch();
  const [showExportModal, setShowExportModal] = useState(false);

  const handleShowExportModal = () => setShowExportModal(true);
  const handleCloseExportModal = () => setShowExportModal(false);
  const [primaryEntity, setPrimaryEntity] = useState<PrimaryEntity | null>(
    null
  );

  const selectProductList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      productList: invoices.productList,
    })
  );

  useEffect(() => {
    const storedEntity = sessionStorage.getItem('primaryEntity');
    if (storedEntity) {
      setPrimaryEntity(JSON.parse(storedEntity));
    }
  }, []);

  const { productList } = useSelector(selectProductList);

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    dispatch(onGetProductList() as any);
  }, [dispatch]);

  useEffect(() => {
    setProducts(productList);
  }, [productList]);

  // Delete modal
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
    dispatch(onDeleteProductList(deletid.id) as any);
    setDelet(false);
  };

  // search
  const handleSearch = (ele: any) => {
    let item = ele.value;

    if (item === 'All Tasks') {
      setProducts([...productList]);
    } else {
      handleSearchData({
        data: productList,
        item: item,
        setState: setProducts,
      });
    }
  };

  // edit data
  const [editProduct, setEditProduct] = useState<boolean>(false);
  const [edit, setEdit] = useState<any>();

  const handleCloseEdit = () => setEditProduct(false);
  const handleEditProduct = (item: Product) => {
    setEditProduct(true);

    setEdit(item);
  };

  interface ColumnType {
    Header: any;
    accessor: string;
    key?: string;
    Filter: boolean;
    isSortable: boolean;
    Cell?: (cell: any) => JSX.Element;
  }

  const columns: ColumnType[] = useMemo(
    () => [
      {
        Header: 'Product Code',
        accessor: 'product_code',
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => (
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <h6 className="fs-16 mb-1">{cell.row.original.product_code}</h6>
            </div>
          </div>
        ),
      },

      {
        Header: 'Product Description',
        accessor: 'description',
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.description}</>,
      },
      {
        Header: 'Product Group',
        accessor: 'product_group',
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => <>{cell.row.original.product_group}</>,
      },
      {
        Header: 'Scalar Tax Code',
        accessor: 'tax_code',
        Filter: false,
        isSortable: true,

        Cell: (cell: any) => <>{cell.row.original.tax_code}</>,
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
    [handleEditProduct]
  );

  return (
    <React.Fragment>
      <Row className="pb-4 gy-3">
        <Col sm={12}>
          <Link to="/product-add">
            <i className="las la-plus-circle me-1"></i> Add New
          </Link>
          <span style={{ paddingLeft: '20px' }}></span>
          <Link to="/import-product">
            <i className="las la-file-import me-1"></i> Import Product
          </Link>
          {/* <span style={{ paddingLeft: '20px' }}></span>
          <Link to="/file-upload">
            <i className="las la-lightbulb me-1"></i> Get recommendations
          </Link> */}
          <span style={{ paddingLeft: '20px' }}></span>
          <button
            className="btn addPayment-modal"
            onClick={handleShowExportModal}
          >
            <span style={{ color: '#477bf9' }}>
              <i className="las la-lightbulb me-1"></i>Export Product
            </span>{' '}
          </button>
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

      <Row>
        <Col xl={12}>
          <Card>
            <Card.Body>
              {products && products.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns}
                  data={products || []}
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

      <DeleteModal
        show={delet}
        handleClose={handleDeleteModal}
        deleteModalFunction={handleDeleteId}
      />
      <ToastContainer />

      <EditProductList
        isShow={editProduct}
        handleClose={handleCloseEdit}
        edit={edit}
      />
      <ExportProductsModal
        show={showExportModal}
        handleClose={handleCloseExportModal}
      />
    </React.Fragment>
  );
};

export default ProductlistTable;
