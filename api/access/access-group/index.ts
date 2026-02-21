export { accessGroupService } from './service';
export type {
  CreateAccessGroupRequest,
  ModifyAccessGroupRequest,
  DeleteAccessGroupRequest,
  GetAccessGroupByIdRequest,
  GetTenantAllAccessGroupsSummaryRequest,
  AccessGroupSummaryResponse,
  AccessGroupByIdResponse,
  TenantAccessGroupSummaryResponse,
} from './service';
export {
  useAllAccessGroupsSummary,
  useAccessGroupById,
  useTenantAllAccessGroupsSummary,
  useCreateAccessGroup,
  useModifyAccessGroup,
  useDeleteAccessGroup,
} from './hooks';
