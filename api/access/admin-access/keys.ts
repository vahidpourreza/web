export const adminAccessKeys = {
  all: ['admin-access'] as const,
  details: () => [...adminAccessKeys.all, 'detail'] as const,
  detail: (superAdminUserId: string) => [...adminAccessKeys.details(), superAdminUserId] as const,
  withPrivilege: () => [...adminAccessKeys.all, 'withPrivilege'] as const,
};
