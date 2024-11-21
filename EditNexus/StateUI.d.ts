import React from 'react';
interface StateData {
    entity_id: string;
    country: string;
    region: string;
    juris_type_id: string;
    jurisdiction_type_id: string;
    juris_name: string;
    short_name: string;
    end_date: string;
    effective_date: string;
    nexus_type_id: string;
    recommendation_items: string[];
}
interface LocalJurisdictionData {
    local_taxes: any;
}
interface CommonStateUIProps {
    edit: any;
    stateName: string;
    uiType: 'typeA' | 'typeB' | 'typeC' | 'typeD' | 'typeE' | 'typeF' | 'typeG';
    onStateDataChange: (stateData: StateData, localJurisductionData: LocalJurisdictionData) => void;
}
declare const StateUI: React.FC<CommonStateUIProps>;
export default StateUI;
