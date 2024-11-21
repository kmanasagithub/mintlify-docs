import React from 'react';
interface FavoriteReportModalProps {
    show: boolean;
    onHide: () => void;
    onSave: (name: string) => void;
    defaultName: string;
    reportData: any;
}
declare const FavoriteReportModal: React.FC<FavoriteReportModalProps>;
export default FavoriteReportModal;
