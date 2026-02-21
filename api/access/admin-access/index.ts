export { adminAccessService } from './service';
export type {
  CreateAdminAccessRequest,
  ModifyNavigationsRequest,
  DeleteAdminAccessRequest,
  GetBySuperAdminIdRequest,
  AllSuperAdminsWithDetailsResponse,
  SuperAdminPrivilegeDetailsResponse,
  SuperAdminPrivilegeResponse,
  SuperAdminWithPrivilegeResponse,
} from './service';
export {
  useAllSuperAdminsDetails,
  useSuperAdminPrivilege,
  useAllSuperAdminsWithPrivilege,
  useCreateAdminAccess,
  useModifyAdminNavigations,
  useDeleteAdminAccess,
} from './hooks';
