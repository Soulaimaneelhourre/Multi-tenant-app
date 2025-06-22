import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Tenant {
  id: string;
  domain: string;
  name: string;
}

interface TenantState {
  tenants: Tenant[];
  selectedTenant: string | null; // domain or id of tenant
  loading: boolean;
  error: string | null;
}

const initialState: TenantState = {
  tenants: [],
  selectedTenant: null,
  loading: false,
  error: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    fetchTenantsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTenantsSuccess(state, action: PayloadAction<Tenant[]>) {
      state.tenants = action.payload;
      state.loading = false;
    },
    fetchTenantsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedTenant(state, action: PayloadAction<string>) {
      state.selectedTenant = action.payload;
    },
    clearSelectedTenant(state) {
      state.selectedTenant = null;
    },
  },
});

// Export actions
export const {
  fetchTenantsStart,
  fetchTenantsSuccess,
  fetchTenantsFailure,
  setSelectedTenant,
  clearSelectedTenant,
} = tenantSlice.actions;

// Export reducer as default export
export default tenantSlice.reducer;
