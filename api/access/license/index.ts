export { licenseService } from './service';
export type {
  CreateStandardLicenseRequest,
  CreateUnlimitedLicenseRequest,
  SetDefaultLicenseRequest,
  UpdateLicenseContentRequest,
  UpdateLicenseRequest,
  DeleteLicenseRequest,
  GetLicenseByIdRequest,
  GetAllTenantsLicensesRequest,
  GetTenantLicensesHistoryRequest,
  LicenseSummaryResponse,
  LicenseResponse,
  LicenseNavigationResponse,
  LicenseHistoryResponse,
  TenantLicenseResponse,
} from './service';
export {
  useAllLicensesSummary,
  useLicenseById,
  useAllTenantsLicenses,
  useTenantLicensesHistory,
  useCreateStandardLicense,
  useCreateUnlimitedLicense,
  useSetDefaultLicense,
  useUpdateLicenseContent,
  useUpdateLicense,
  useDeleteLicense,
} from './hooks';
