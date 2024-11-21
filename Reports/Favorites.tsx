import React, { useState, useEffect } from 'react';
import { Col, Container, Row, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BreadCrumb from '../../../Common/BreadCrumb';

// Type for favorite report
interface FavoriteReport {
  id: string;
  name: string;
  category: string;
  reportName: string;
  dateOption: string;
  dateType?: string;
  documentStatus?: string;
  region?: string;
  company?: string;
  timestamp: Date;
}

const Favorites = () => {
  document.title = "Favorites";
  const [favorites, setFavorites] = useState<FavoriteReport[]>([]);

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('reportFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const deleteFavorite = (id: string) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('reportFavorites', JSON.stringify(updatedFavorites));
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Reports" title="Reports" />
          <Row className="pb-4 gy-3">
            <Col md={2}>
              <Link to='/favorites'>Favorites</Link>
            </Col>
            <Col md={2}>
              <Link to='/transaction-reports'>Transaction Reports</Link>
            </Col>
            <Col md={4}>
              <Link to='/liability-&-tax-return-reports'>Liability & Tax Return Reports</Link>
            </Col>
            <Col md={2}>
              <Link to='/exemption-reports'>Exemption Reports</Link>
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <Card>
                <Card.Body>
                  <Form>
                    <h2>Favorite reports</h2>
                    {favorites.length === 0 ? (
                      <div className="text-center p-4">
                        <img
                          src="https://th.bing.com/th/id/OIP.mCTE6ZdVQyxPHVACl89gUwHaFg?w=809&h=601&rs=1&pid=ImgDetMain"
                          alt="No Data Found"
                          className="img-fluid"
                        />
                        <p className="margin-all-none">There are no favorites yet, add a report to your favorites!</p>
                      </div>
                    ) : (
                      <div className="favorites-grid">
                        {favorites.map((favorite) => (
                          <Card key={favorite.id} className="mb-3 shadow-sm">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h5 className="mb-1">{favorite.name}</h5>
                                  <p className="text-muted mb-2">Category: {favorite.category}</p>
                                  <p className="text-muted mb-2">Report: {favorite.reportName}</p>
                                  <p className="text-muted mb-2">Date Option: {favorite.dateOption}</p>
                                  {favorite.dateType && (
                                    <p className="text-muted mb-2">Date Type: {favorite.dateType}</p>
                                  )}
                                  {favorite.documentStatus && (
                                    <p className="text-muted mb-2">Status: {favorite.documentStatus}</p>
                                  )}
                                  {favorite.region && (
                                    <p className="text-muted mb-2">Region: {favorite.region}</p>
                                  )}
                                  {favorite.company && (
                                    <p className="text-muted mb-2">Company: {favorite.company}</p>
                                  )}
                                  <small className="text-muted">
                                    Saved on: {new Date(favorite.timestamp).toLocaleDateString()}
                                  </small>
                                </div>
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={() => window.location.href = '/transaction-reports'}
                                  >
                                    Run Report
                                  </button>
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    onClick={() => deleteFavorite(favorite.id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    )}
                    <div className="mt-4">
                      <h2>Frequently used reports</h2>
                      <Row>
                        <Col md='4'>
                          <h3>Transaction reports</h3>
                          <div className="margin-bottom-sm">
                            <a href="/transaction-reports">Sales tax document summary</a><br />
                            <span>Use this report to reconcile ScalarTax invoice detail with the sales report in your system</span>
                          </div>
                                <div className='pt-2'>
                                <a  href="/transaction-reports">Sales tax document summary listing by jurisdiction</a><br />
                                    <span >Shows totals, broken up by tax jurisdiction, for transactions you've entered in ScalarTax</span>
                                </div>
                                <div className='pt-2'>
                                <a href="/liability-&-tax-return-reports">Sales and sellers use tax jurisdiction detail expanded view</a><br />
                                    <span>Shows transactions summarized by individual tax jurisdictions within a state with extra space between line</span>
                                </div>
                                </Col>
                                <Col md='4'>
                                <h3>Liability & tax return reports</h3>
                                <div className="margin-bottom-sm">
                                    <a href="/liability-&-tax-return-reports">Sales and sellers use tax jurisdiction detail</a><br />
                                    <span>Shows transactions summarized by individual tax jurisdictions within a state</span>
                                </div>
                                <div className='pt-2'>
                                <a  href="/liability-&-tax-return-reports">Sales and sellers use tax summary</a><br />
                                    <span >Shows tax summary liability by country or region</span>
                                </div>
                                <div className='pt-2'>
                                <a href="/liability-&-tax-return-reports">Sales and sellers use tax jurisdiction detail combined view</a><br />
                                    <span>Shows transactions with details displayed for specific counties and cities</span>
                                </div>
                                </Col>
                                <Col md='4'>
                                <h3>Exemption reports</h3>
                                <div className="margin-bottom-sm">
                                    <a href="/exemption-reports">Exemption exposure</a><br />
                                    <span>Shows the total exempt transactions that don't have exemption certificate entries applied</span>
                                </div>
                                <div className='pt-2'>
                                <a  href="/exemption-reports">Exemption exposure aging</a><br />
                                    <span >Shows groups of exempt transactions that don't have exemption certificate entries applied</span>
                                </div>
                                <div className='pt-2'>
                                <a href="/exemption-reports">Sales tax exemption certificates</a><br />
                                    <span>Shows details for each exemption certificate entry</span>
                                </div>
                                </Col>
                             </Row>
                        </div>
                    </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Favorites;