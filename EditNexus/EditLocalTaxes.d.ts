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
interface MenuData {
    [county: string]: LocalTax[];
}
interface EditLocalTaxProps {
    stateName: string;
    localTaxesArray: LocalTax[];
    onGridData: (data: GridData) => void;
    onMenuData: (data: MenuData) => void;
    onCancel: () => void;
}
declare const EditLocalTax: React.FC<EditLocalTaxProps>;
export default EditLocalTax;
