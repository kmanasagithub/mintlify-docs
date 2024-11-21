import React from 'react';
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
declare const LocalTaxGrid: React.FC<LocalTaxGridProps>;
export default LocalTaxGrid;
