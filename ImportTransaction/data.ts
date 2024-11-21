import { ExtraColumnsSection } from './types';
export const GridData = [
  {
    Column: 'A',
    Name: 'ProcessCode',
    Meaning:
      'The process to apply to a transaction document, represented by a one-digit code.',
    PossibleValues: '0, 1, 2, 3, 4, 9, 10',
    Notes:
      'SST sellers should use codes 0, 1, 2, 3, 4, 9, and 10. ProcessCode 0 voids values in DocCode, DocType, and CompanyCode. Use caution with tax overrides (1, 2, 5, 6, 9, 10).',
  },
  {
    Column: 'B',
    Name: 'DocCode',
    Meaning: 'The unique ID for the invoice, credit memo, or return.',
    PossibleValues: 'An alphanumeric code (50)',
    Notes:
      'Must be unique within its DocType for all transactions. Document codes with the same DocType must be contiguous.',
  },
  {
    Column: 'C',
    Name: 'DocType',
    Meaning: 'The type of document as represented by a one-digit code.',
    PossibleValues: '0 to 11',
    Notes:
      'Order documents (codes 0, 2, 4, 6, 8, and 11) aren’t saved to ScalarTax.',
  },
  {
    Column: 'D',
    Name: 'DocDate',
    Meaning: 'The invoice, credit memo, or return date.',
    PossibleValues: 'yyyy-mm-dd or mm/dd/yyyy',
    Notes: 'Use the date format resembling that in your business application.',
  },
  {
    Column: 'F',
    Name: 'CustomerCode',
    Meaning: 'The code your business application uses to identify a customer.',
    PossibleValues: 'An alphanumeric code (50)',
    Notes: 'May be called customer ID, customer number, etc.',
  },
  {
    Column: 'H',
    Name: 'LineNo',
    Meaning: "The transaction's line number.",
    PossibleValues: 'Text (50)',
    Notes:
      "Recommended to number lines sequentially; lines with the same DocCode won't import unless they're in order.",
  },
  {
    Column: 'N',
    Name: 'Amount',
    Meaning: 'The total sale for the line item.',
    PossibleValues: 'A number',
    Notes: 'Use a negative number for return invoices (DocType 5).',
  },
  {
    Column: 'V',
    Name: 'DestRegion',
    Meaning: "The destination or ship-to state or province's abbreviation.",
    PossibleValues: 'A state or province abbreviation',
    Notes: '',
  },
  {
    Column: 'W',
    Name: 'DestPostCode',
    Meaning: 'The destination or ship-to postal code.',
    PossibleValues: 'A ZIP code (5) / ZIP + 4 (9) / Canadian postal code (6)',
    Notes:
      'Excel removes leading zeros. Format this column as text and save as .CSV instead of Excel document.',
  },
  {
    Column: 'AA',
    Name: 'OrigRegion',
    Meaning: "The origin or ship-from state or province's abbreviation.",
    PossibleValues: 'A state or province abbreviation (2)',
    Notes: '',
  },
  {
    Column: 'AB',
    Name: 'OrigPostCode',
    Meaning: "The origin or ship-from state or province's postal code.",
    PossibleValues: 'ZIP code (5) / ZIP + 4 (9) / Canadian postal code (6)',
    Notes:
      'Excel removes leading zeros. Format this column as text and save as .CSV instead of Excel document.',
  },
  {
    Column: 'X',
    Name: 'DestCountry',
    Meaning: "The destination or ship-to country's abbreviation.",
    PossibleValues: 'A country abbreviation (2)',
    Notes: '',
  },
  {
    Column: 'AC',
    Name: 'OrigCountry',
    Meaning: "The origin or ship-from country's abbreviation.",
    PossibleValues: 'A country abbreviation (2)',
    Notes: '',
  },
  {
    Column: 'I',
    Name: 'TaxCode',
    Meaning:
      'The ScalarTax tax code or customer tax code associated with the item or SKU in the transaction.',
    PossibleValues: 'An alphanumeric code (25)',
    Notes:
      'Use a tax code for items with special taxability; enter the SST certified tax code unless mapped in ScalarTax.',
  },
  {
    Column: 'K',
    Name: 'ItemCode',
    Meaning:
      'The item code or SKU that identifies the product, service, or charge.',
    PossibleValues: 'An alphanumeric code (50)',
    Notes:
      'If mapped to a tax code, custom tax rules are triggered automatically.',
  },
  {
    Column: 'L',
    Name: 'Description',
    Meaning: 'A description of the line item.',
    PossibleValues: 'Text (255)',
    Notes: '',
  },
  {
    Column: 'T',
    Name: 'DestAddress',
    Meaning: 'The destination or ship-to street address.',
    PossibleValues: 'Text or a LocationCode (50)',
    Notes:
      'Entering a LocationCode identifies an address associated with a location in ScalarTax.',
  },
  {
    Column: 'U',
    Name: 'DestCity',
    Meaning: 'The destination or ship-to city.',
    PossibleValues: 'A city name (50)',
    Notes:
      'If using LocationCode, leave DestCity blank; otherwise, use this field for accurate tax.',
  },
  {
    Column: 'E',
    Name: 'CompanyCode',
    Meaning: 'The company code used by ScalarTax.',
    PossibleValues: 'An alphanumeric code (25)',
    Notes: 'Important for importing transactions to multiple companies.',
  },
  {
    Column: 'G',
    Name: 'EntityUseCode',
    Meaning: 'The entity use code that triggers customer-level tax rules.',
    PossibleValues: 'Text (25)',
    Notes: 'Commonly used for exempt customers. Custom codes supported.',
  },
  {
    Column: 'J',
    Name: 'TaxDate',
    Meaning: 'Overrides the date used for sales tax calculation.',
    PossibleValues: 'yyyy-mm-dd or mm/dd/yyyy',
    Notes:
      'Used on return invoice transactions requiring a tax calculation date reflecting the original invoice date.',
  },
  {
    Column: 'M',
    Name: 'Qty',
    Meaning: 'The quantity of items included on the document line.',
    PossibleValues: 'A positive number',
    Notes:
      'Fractional numbers accepted. Qty used to calculate per-item sales amount.',
  },
  {
    Column: 'O',
    Name: 'Discount',
    Meaning: 'The trade discount allocated to the document line.',
    PossibleValues: 'A number',
    Notes:
      'The sign for the discount must match the line amount. Discounts handled at document header level.',
  },
  {
    Column: 'P',
    Name: 'Ref1',
    Meaning: 'A user-defined reference.',
    PossibleValues: 'Text (50)',
    Notes: '',
  },
  {
    Column: 'Q',
    Name: 'Ref2',
    Meaning: 'A user-defined reference.',
    PossibleValues: 'Text (50)',
    Notes: '',
  },
  {
    Column: 'R',
    Name: 'ExemptionNo',
    Meaning: 'The exemption certificate number, if applicable.',
    PossibleValues: 'Text (25)',
    Notes:
      'Generates a sales tax exemption for the line item to which it is applied.',
  },
  {
    Column: 'S',
    Name: 'RevAcct',
    Meaning: 'The revenue account for this transaction.',
    PossibleValues: 'Text (50)',
    Notes: 'User-defined reference identifying a general ledger account.',
  },
  {
    Column: 'Y',
    Name: 'OrigAddress',
    Meaning: 'The origin or ship-from street address.',
    PossibleValues: 'Text or a LocationCode (50)',
    Notes: 'Entering a LocationCode identifies an address in ScalarTax.',
  },
  {
    Column: 'Z',
    Name: 'OrigCity',
    Meaning: 'The origin or ship-from city.',
    PossibleValues: 'Text (35)',
    Notes: 'Used only when PostalCode isn’t included.',
  },
  {
    Column: 'AD',
    Name: 'LocationCode',
    Meaning: 'The sales location (outlet) for the document line.',
    PossibleValues: 'Text (50)',
    Notes:
      'Enter the location code set up to track sales, usually the marketplace name.',
  },
  {
    Column: 'AE',
    Name: 'SalesPersonCode',
    Meaning: 'The salesperson for the document line.',
    PossibleValues: 'Text (25)',
    Notes: '',
  },
  {
    Column: 'AF',
    Name: 'PurchaseOrderNo',
    Meaning: 'The purchase order for the document line.',
    PossibleValues: 'Text (50)',
    Notes: 'Can match against single-use exemption certificate entries.',
  },
  {
    Column: 'AG',
    Name: 'CurrencyCode',
    Meaning: 'The ISO currency code.',
    PossibleValues: 'Text (30)',
    Notes: 'Defaults to USD.',
  },
  {
    Column: 'AH',
    Name: 'ExchangeRate',
    Meaning:
      'The conversion rate from CurrencyCode to the company base currency.',
    PossibleValues: 'A number',
    Notes: 'For reference only. Default is 1.0.',
  },
  {
    Column: 'AI',
    Name: 'ExchangeRateDate',
    Meaning: 'The date of the conversion rate.',
    PossibleValues: 'yyyy-mm-dd or mm/dd/yyyy',
    Notes: 'Use when ExchangeRate is provided.',
  },
];

export const predefinedColumns = [
  'CompanyCode',
  'DocType',
  'ProcessCode',
  'entityUseCode',
];
export const defaultDocumentTypes = [
  '1 - Sales invoice',
  '3 - Purchase invoice',
  '5 - Return invoice',
  '7 - Inventory transfer inbound invoice',
  '12 - Inventory transfer outbound invoice',
];
export const defaultProcessCodes = [
  '0 = Void transaction',
  '1 = Tax override (new transaction without tax calculation)',
  '2 = Tax override (adjusted transaction without tax calculation)',
  '3 = New transaction',
  '4 = Adjust existing transaction',
  '5 = Accrued consumer use tax override (new transaction)',
  '6 = Accrued consumer use tax override (adjusted transaction)',
  '9 = Out of harbor tax override (new transaction without tax calculation)',
  '10 = Out of harbor tax override (adjusted transaction without tax calculation',
];

export const defaultEntityUseCodes = [
  'None',
  'A - Federal Government',
  'B - State Government',
  'C - Tribal Government',
  'D - Foreign Diplomat',
  'E - Charitable/Exempt Organization',
  'F - Religious Organization',
  'G - Resale',
  'H - Agriculture',
  'I - Industrial Prod/Manufacturers',
  'J - Direct Pay',
  'K - Direct Mail',
  'M - Educational Organization',
  'N - Local Government',
  'P - Commercial Aquaculture',
  'Q - Commercial Fishery',
  'R - Non-Resident',
  'Taxable - Override Exemption',
  'Use A Custom Entity/Use Code',
];

export const requiredColumns = [
  'Document Code',
  'Document date',
  'Customer code',
  'Line number',
  'Line amount',
];

export const originAddress = [
  'Origin country',
  'Origin address line 1',
  'Origin address line 2',
  'Origin address line 3',
  'Origin city',
  'Origin region',
  'Origin postal code',
  'Origin location code',
];

export const destinationAddress = [
  'Destination country',
  'Destination address line 1',
  'Destination address line 2',
  'Destination address line 3',
  'Destination city',
  'Destination region',
  'Destination postal code',
  'Destination location code',
];

export const originCoordinates = ['Origin Latitude', 'Origin Longitude'];

export const destinationCoordinates = [
  'Destination Latitude',
  'Destination Longitude',
];

// Constants
export const baseOptionalColumns: string[] = [
  'Line item code',
  'Line tax code',
  'Line tax override tax amount',
  'Line tax override tax date',
  'Exemption number',
];

export const extraColumns: ExtraColumnsSection = {
  'Tax and product information': [
    'Line exemption code',
    'Line HS code',
    'Line item code',
    'Line parameters name',
    'Line parameters unit',
    'Line parameters value',
    'Line quantity',
    'Line revenue account',
    'Line tax amount by types',
    'Line tax code',
    'Line tax included',
    'Line tax override reason',
    'Line tax override tax amount',
    'Line tax override tax date',
    'Line tax override type',
  ],
  'Document details': {
    'Document level': {
      'Customer and destination info': [
        'Business identification number',
        'Customer supplier name',
        'Destination city',
        'Destination country',
        'Destination latitude',
        'Destination line 1',
        'Destination line 2',
        'Destination line 3',
        'Destination location code',
        'Destination longitude',
        'Destination region',
        'Destination ZIP code',
        'Entity use code',
        'Exemption number',
        'Purchase order number',
        'Reference code',
      ],
      'Seller and origin info': [
        'Origin city',
        'Origin country',
        'Origin latitude',
        'Origin line 1',
        'Origin line 2',
        'Origin line 3',
        'Origin location code',
        'Origin longitude',
        'Origin region',
        'Origin ZIP code',
        'POS lane code',
        'Reporting location code',
        'Salesperson code',
      ],
    },
    'Line Level': {
      'Customer and destination info': [
        'Destination address line 2',
        'Destination address line 3',
        'Line business identification number',
        'Line description',
        'Line ref1',
        'Line ref2',
      ],
      'Seller and origin info': [
        'Line marketplace liability type',
        'Line merchant seller ID',
        'Origin address line 2',
        'Origin address line 3',
      ],
    },
  },
  'Other transaction information': [
    'Adjustment description',
    'Adjustment reason',
    'Document batch code',
    'Document commit',
    'Document currency code',
    'Document data source ID',
    'Document debug level',
    'Document description',
    'Document discount',
    'Document email',
    'Document exchange rate',
    'Document exchange rate currency code',
    'Document exchange rate effective date',
    'Document service mode',
  ],
};

export const baseAttributesColumns: string[] = [
  'Availability',
  'Average Daily Rate',
  'Base Room Rate',
  'Beverage Container Material',
];
export const attributes = [
  'Availability',
  'Average Daily Rate',
  'Base Room Rate',
  'Beverage Container Material',
  'Beverage Container Type',
  'Bill To DOB',
  'Boat Propulsion Type',
  'Brand',
  'Calculate Beverage Alcohol Excise Tax',
  'Carrier Code',
  'Catered',
  'Cellular Capability',
  'CIRO Deminimis Exception',
  'Color',
  'Commercial',
  'Component',
  'Condition',
  'ContactCode',
  'Container Count',
  'Container Size',
  'Contains Mercury',
  'CostCenter',
  'Country of Manufacture',
  'Daily Rate',
  'Daily Rental',
  'Delivery Terms',
  'Digital',
  'Discount Type',
  'Disposable',
  'DutyDeminimisThreshold',
  'EAN',
  'Eating Facility Provisions',
  'Electric Vehicle Charging Station Level',
  'Establishment Type',
  'Event Space Size',
  'Exempt Entity Performance',
  'Exempt Status Approved',
  'FDA Warning',
  'Fee Type',
  'First Use',
  'Food Preparation',
  'FoodAndBeverageSales',
  'Fuel Economy',
  'Fulfillment House Code',
  'Fullfillment House Code',
  'Gender',
  'Google Product Category',
  'Gross Weight',
  'GTIN',
  'Height',
  'Home Consumption',
  'HotelOwnedRestaurantOnsite',
  'HS Hint',
  'Image Link',
  'IndigentPurchaser',
  'Industrial',
  'Instate Pro Team',
  'Insured',
  'IOSSRegNo',
  'Is Accelerated Tax Paid',
  'Is Alcohol Sample',
  'Is Assembly Or Installation',
  'Is Buyers Agent',
  'Is Certified Extended Stay',
  'Is Colorado SMM Registered',
  'Is Customer Established',
  'Is Customer RegisteredThrough FiscalRep',
  'Is Direct Alcohol Import',
  'Is Electric Vehicle',
  'Is Entire House Rented',
  'Is EU Digital Service Thresh Exceeded',
  'Is EU Distance Sales Threshold Exceeded',
  'Is EU Goods Document Total Below 150 EUR',
  'Is Foreign Alcohol',
  'Is Goods Second Hand',
  'Is Heavy Machinery',
  'Is Import Vat Deferment',
  'Is Incidental to Owner Use',
  'Is Indeterminate Length',
  'Is Intercompany',
  'Is Intermediary Appointed',
  'Is Luxury Vehicle',
  'Is Marketplace',
  'Is Operator Provided',
  "Is Owner's Primary Address",
  'Is Preferred Program',
  'Is Registered Solar Dealer',
  'Is Registered Through Fiscal Rep',
  'Is Registered Used Vehicle Dealer',
  'Is Reseller',
  'Is Residence Owner Present',
  'Is Service Contract',
  'Is Special Arrangement By Carrier',
  'Is Start-Up',
  'Is Supplier Established',
  'Is Taxable Service',
  'Is TaxIncluded Exclude Multitax',
  'Is Temporary Import 18 months',
  'Is Temporary Import 2 years',
  'Is Texas TERP Eligible',
  'Is Triangulation',
  'Is Used Vehicle',
  'IsAPBatchTransaction',
  'IsBelowRdfThreshold',
  'IsBilledToPrincipal',
  'IsManualAllocation',
  'IsMerchantSellerTaxDependency',
  'IsPermanentEstablishmentResponsible',
  'IsRegisteredMaquiladora',
  'IsRegisteredNortherBorderRegion',
  'IsRegisteredNorthernBorderRegion',
  'IsRegisteredSouthernBorderRegion',
  'IsTemporaryImport',
  'Item Grade',
  'KVIC Approved',
  'License Jurisdiction',
  'Link',
  'ListingMarketplace',
  'Lodging Marketplace',
  'Maintains Inventory',
  'Manufacturer Rebate Type',
  'MarginScheme',
  'Market Place Type',
  'Material',
  'Merchant Establishment Country',
  'MerchantName',
  'MerchantVatId',
  'Middleman VatId',
  'MinAge',
  'Model Year',
  'ModeOfTransport',
  'Motor Horsepower',
  'Motor Type',
  'MPN',
  'Nebraska Contractor Option',
  'Net Length',
  'Net Surface Area',
  'Net Volume',
  'Net Weight',
  'Number Of Days',
  'Number of Nights',
  'Number of Rooms in Unit',
  'Number of Units for Rent',
  'OverridesParentJurisdiction',
  'Pack Size',
  'Party A VATID Country',
  'Party C VAT ID Country',
  'PerformanceType',
  'Pick-Up Option',
  'Place of Consumption',
  'Policy Expiration Date',
  'Policy Inception Date',
  'Pre-packaging',
  'preferential_program',
  'Preferred Program',
  'Prepared Food Threshold Met',
  'Price',
  'Product',
  'Product Use Designation',
  'Project Value',
  'Proprietary ATM',
  'Purchase Threshold Type',
  'Purchaser DOB',
  'Purchaser Name',
  'Purchaser Street Address',
  'Purchaser To City',
  'Purchaser To State',
  'Purchaser To Zip',
  'Quantity',
  'QuotePricingStrategy',
  'Real Property Tax Classification',
  'Recipient DOB',
  'Recipient Name',
  'Remote Seller',
  'Residential',
  'Revenue per Available Room',
  'Revenue Requirement Met',
  'Rim Diameter',
  'Rule applied for line',
  'Sale Price',
  'Sale Price Effective Date',
  'Sales Location',
  'Sales Tax',
  'Scope',
  'Screen Size',
  'Self Billing',
  'Seller Classification',
  'SellerPrepared',
  'Separately Contracted',
  'Served',
  'ServicePerformedOnTemporaryImport',
  'Serving Size',
  'SEZ',
  'Ship Date',
  'Ship To DOB',
  'Shipping',
  'Shipping Weight',
  'ShippingProhibited',
  'Short Term Rental Type',
  'Size',
  'SKU',
  'Sleeps',
  'Sold as Part of a Meal',
  'Sporting Event Type',
  'Studded',
  'Summary',
  'SupplyofService',
  'Texas Alcohol Beverage License Type',
  'ThresholdPeriod',
  'Tire Type',
  'Tracking Number',
  'TransactionType',
  'Transport',
  'TravelAgentScheme',
  'Tread Width',
  'TypeofUse',
  'Unmapped Fee',
  'UPC',
  'Use Tax',
  'Utensils',
  'Utility',
  'VarianceCalculatedForDocument is AP Related parame',
  'Varietal',
  'VATDeminimisThreshold',
  'VATGroupId',
  'VATRegId',
  'Vehicle Value',
  'Vehicle Value After Trade-In',
  'Vendor Charged Tax',
  'Venue Has Liquor License',
  'Venue Size',
  'Venue Special License',
  'Venue Type',
  'Voltage',
  'Width',
  'Working Unit Code',
];