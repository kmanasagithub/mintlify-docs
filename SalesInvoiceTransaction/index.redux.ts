import { configureStore } from '@reduxjs/toolkit';
import AddressReducer, { selectAddressesReducer } from './index.slice';

export const store = configureStore({
  reducer: {
    address: AddressReducer,
    selectAddresses: selectAddressesReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
