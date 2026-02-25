export const accessKeys = {
  all: ['access'] as const,
  activeTenants: (userId: string, brokerId: string) =>
    [...accessKeys.all, 'activeTenants', userId, brokerId] as const,
  centersWithGroups: (tenantUserId: string) =>
    [...accessKeys.all, 'centersWithGroups', tenantUserId] as const,
};
