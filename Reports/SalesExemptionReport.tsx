import React, { useState } from 'react';
import { Table, Card, Button, Pagination, Spinner } from 'react-bootstrap';
import { ArrowLeft, Download, Printer } from 'lucide-react';

// Define the types for the report data
export type ReportData = {
  jurisdiction: string;
  transactionType: string;
  taxType: string;
  transactionCount: number;
  transactionAmount: number;
  taxSaved: number;
};

interface SalesTransactionReportProps {
  reportData: ReportData[];
  loading: boolean;
  onBackClick: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const SalesTransactionReport: React.FC<SalesTransactionReportProps> = ({
  reportData,
  loading,
  onBackClick,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Display loading spinner if data is loading
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Conditionally render the message if no data is available
  const isEmpty = reportData.length === 0;

  return (
    <div className="w-full">
      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Button
                variant="link"
                className="text-primary p-0 me-3"
                onClick={onBackClick}
              >
                <ArrowLeft className="me-1" size={20} />
                Back to report criteria
              </Button>
              <h4 className="mb-0">Sales Tax Transaction Detail by Jurisdiction</h4>
            </div>
            <div>
              <Button variant="outline-secondary" className="me-2">
                <Printer className="me-1" size={16} />
                Print
              </Button>
              <Button variant="outline-secondary">
                <Download className="me-1" size={16} />
                Download
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Conditionally render message if no data */}
          {isEmpty ? (
            <div className="text-center py-3">
              <h5>No transaction data found based on the selected criteria.</h5>
            </div>
          ) : (
            <>
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('jurisdiction')}>Jurisdiction</th>
                    <th onClick={() => handleSort('transactionType')}>Transaction Type</th>
                    <th onClick={() => handleSort('taxType')}>Tax Type</th>
                    <th onClick={() => handleSort('transactionCount')} className="text-end">Transaction Count</th>
                    <th onClick={() => handleSort('transactionAmount')} className="text-end">Transaction Amount</th>
                    <th onClick={() => handleSort('taxSaved')} className="text-end">Tax Saved</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData?.map((row, index) => (
                    <tr key={index}>
                      <td>{row.jurisdiction}</td>
                      <td>{row.transactionType}</td>
                      <td>{row.taxType}</td>
                      <td className="text-end">{row.transactionCount.toLocaleString()}</td>
                      <td className="text-end">${row.transactionAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="text-end">${row.taxSaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  Page {currentPage} of {totalPages}
                </div>
                <Pagination>
                  <Pagination.First
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => Math.abs(page - currentPage) <= 2)
                    .map(page => (
                      <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => onPageChange(page)}
                      >
                        {page}
                      </Pagination.Item>
                    ))}
                  <Pagination.Next
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default SalesTransactionReport;
