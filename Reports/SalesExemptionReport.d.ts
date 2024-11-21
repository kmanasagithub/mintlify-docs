import React from 'react';
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
declare const SalesTransactionReport: React.FC<SalesTransactionReportProps>;
export default SalesTransactionReport;
