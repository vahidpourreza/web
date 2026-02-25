export { workspaceService } from './service';
export type {
  AddDeskRequest,
  SwapDeskRequest,
  UpdateDeskRequest,
  DeleteDeskRequest,
  GetDeskRequest,
  WorkDeskResponse,
  WorkDeskItemResponse,
  UserWorkSpaceResponse,
  CurrentUserMenuResponse,
  UserAvailableWorkDeskResponse,
} from './service';
export {
  useMyDesks,
  useDesk,
  useMyWorkSpace,
  useMyMenus,
  useMyAvailableWorkDesks,
  useAddDesk,
  useSwapDesk,
  useUpdateDesk,
  useToggleLayout,
  useDeleteDesk,
} from './hooks';
