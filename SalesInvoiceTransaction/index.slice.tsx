import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { remove } from 'lodash';

export interface Address {
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
}

export interface AddressInitialState {
  Addresses: { [key: string]: Address };
}

const initialState: AddressInitialState = {
  Addresses: {
    defaultAddress: {
      address: '5678 main avenue',
      city: 'nevada',
      state: 'nevada',
      country: 'USA',
      zip_code: '67890',
    },
  },
};

export const AddressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    addAddress: (
      state,
      action: PayloadAction<{ key: string; address: Address }>
    ) => {
      const { key, address } = action.payload;
      state.Addresses[key] = address;
    },
    removeAddress: (state, action: PayloadAction<string>) => {
      const key = action.payload;
      delete state.Addresses[key];
    },
  },
});

const initialStateSelectAddresses = {
  'Ship From': false,
  'Ship To': false,
} as any;
export const selectAddressesSlice = createSlice({
  name: 'addressesSelects',
  initialState: initialStateSelectAddresses,
  reducers: {
    selectAddress: (state: any, action: PayloadAction<string>) => {
      state[action.payload] = true;
    },
    removeSelectedAddress: (state: any, action: PayloadAction<string>) => {
      state[action.payload] = false;
    },
    removeFromStore: (state: any, action: PayloadAction<string>) => {
      const key = action.payload;
      delete state[key];
    },
  },
});

export const { addAddress, removeAddress } = AddressSlice.actions;
export default AddressSlice.reducer;

export const { selectAddress, removeSelectedAddress } =
  selectAddressesSlice.actions;
export const selectAddressesReducer = selectAddressesSlice.reducer;
