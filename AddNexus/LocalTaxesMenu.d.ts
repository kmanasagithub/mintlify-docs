import React from 'react';
interface LocalTax {
    id: string;
    juris_name: string;
    juris_type: string;
    nexus_type: string;
    region: string;
    local_taxes?: LocalTax[];
}
interface MenuData {
    [county: string]: LocalTax[];
}
interface LocalTaxesMenuProps {
    onData: (data: MenuData) => void;
    onCancel: () => void;
    stateName: string;
    localTaxesArray: LocalTax[];
}
declare const LocalTaxMenu: React.FC<LocalTaxesMenuProps>;
export default LocalTaxMenu;
