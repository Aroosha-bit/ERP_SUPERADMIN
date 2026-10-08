import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TenantStatus } from "@/types/tenant";

export type TenantDirectoryFilter = "All" | TenantStatus;

interface TenantDirectoryState {
  filter: TenantDirectoryFilter;
}

const initialState: TenantDirectoryState = {
  filter: "All",
};

const tenantDirectorySlice = createSlice({
  name: "tenantDirectory",
  initialState,
  reducers: {
    setTenantDirectoryFilter(
      state,
      action: PayloadAction<TenantDirectoryFilter>,
    ) {
      state.filter = action.payload;
    },
  },
});

export const { setTenantDirectoryFilter } = tenantDirectorySlice.actions;
export default tenantDirectorySlice.reducer;
