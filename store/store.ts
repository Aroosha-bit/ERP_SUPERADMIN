import { configureStore } from "@reduxjs/toolkit";
import tenantDirectoryReducer from "@/store/tenant-directory-slice";
import tenantWizardReducer from "@/store/tenant-wizard-slice";

export const store = configureStore({
  reducer: {
    tenantDirectory: tenantDirectoryReducer,
    tenantWizard: tenantWizardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
