import React from 'react';
export type IconTextProps = {
    children?: React.ReactNode;
    icon: React.ReactNode;
};
export interface Address {
    id: string;
    sub: string;
    lab: string;
    view: boolean;
}
export declare function IconText({ children, icon }: IconTextProps): any;
export type GetAddressTemplateProps = {
    header?: string;
    selAddr?: string;
    req?: boolean;
    setSelectedAddresses?: (Address: Address[]) => void | undefined;
    selectedAddresses?: Address[];
    Address?: Address;
    defaultAdress?: any;
};
export declare const GetAddressTemplate: any;
