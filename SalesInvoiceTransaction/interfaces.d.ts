export interface Attribute {
    attribute: string;
    value: string;
    unitOfMeasure: string;
}
interface AdditionalAddress {
    addr: string;
}
interface Address1 {
    address?: string;
    city: string;
    state?: string;
    stat?: string;
    country: string;
    zip_code: string;
    additionalAddresses?: AdditionalAddress[];
    [key: string]: any;
}
interface AddressList {
    defaultAddress: Address1;
    'Ship From': Address1;
    'Ship To': Address1;
}
export interface LineItem {
    itemCode: string;
    itemDesc: string;
    totalAmount: number;
    discountClc: boolean;
    quantity: number;
    overrideType: string;
    override_tax: string;
    override_date: string;
    override_reason: string;
    tax_was_included: string;
    address: AddressList;
    attributes?: Attribute[];
    taxCode: string;
    trafficCode: string;
    taxHandling: string;
    revenueAcc: string;
    refCode1: string;
    refCode2: string;
    custExempType: string;
    custExNum: string;
    custVatNo: string;
    lineAddress: true;
}
export interface Data {
    docuCode: string;
    docuType: string;
    docuDate: string;
    custCode: string;
    vendorCode: string;
    discount: string;
    locCode: string;
    entityCode: string;
    custExNum: string;
    custVatNo: string;
    vendorVatNo: string;
    description: string;
    salesPersonCode: string;
    referenceCode: string;
    purchaseOrder: string;
    currency: string;
    attributes: Attribute[];
    override: boolean;
    overrideType: string;
    override_tax: number;
    override_date: string;
    override_reason: string;
    address: AddressList;
    lineItems: LineItem[];
}
export {};
