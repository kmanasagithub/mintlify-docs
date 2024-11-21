export interface Address {
    address: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
}
export interface AddressInitialState {
    Addresses: {
        [key: string]: Address;
    };
}
export declare const AddressSlice: any;
export declare const selectAddressesSlice: any;
export declare const addAddress: any, removeAddress: any;
declare const _default: any;
export default _default;
export declare const selectAddress: any, removeSelectedAddress: any;
export declare const selectAddressesReducer: any;
