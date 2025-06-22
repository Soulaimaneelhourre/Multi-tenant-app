import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { companyService } from '../services/companyService';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Domain, Tenant } from '../types/auth';
import type { RootState } from '.';

interface TenantState {
  tenants: Tenant[];
  selectedTenant: Tenant | null;
  loading: boolean;
  error: string | null;
}

const initialState: TenantState = {
  tenants: [],
  selectedTenant: null,
  loading: false,
  error: null,
};

// Async thunk to fetch tenants
export const fetchTenants = createAsyncThunk('tenant/fetchTenants', async () => {
  const data = await companyService.getCompanies();
  return data as Tenant[];
});

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setSelectedTenant(state, action: PayloadAction<Tenant>) {
      state.selectedTenant = action.payload;
    },
    clearSelectedTenant(state) {
      state.selectedTenant = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.tenants = action.payload;
        state.loading = false;
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tenants';
      });
  },
});

export const { setSelectedTenant, clearSelectedTenant } = tenantSlice.actions;
export const selectSelectedTenant = (state: RootState) => state.tenant.selectedTenant;

export default tenantSlice.reducer;
