export const accountKeys = {
  all: ['account'] as const,
  lists: () => [...accountKeys.all, 'list'] as const,
  byCurrentTenant: () => [...accountKeys.lists(), 'currentTenant'] as const,
  byTenant: (tenantId: string) => [...accountKeys.lists(), 'tenant', tenantId] as const,
  compact: () => [...accountKeys.lists(), 'compact'] as const,
  superAdminsCompact: () => [...accountKeys.lists(), 'superAdminsCompact'] as const,
  details: () => [...accountKeys.all, 'detail'] as const,
  detail: (id: string) => [...accountKeys.details(), id] as const,
  profile: (tenantUserId: string) => [...accountKeys.all, 'profile', tenantUserId] as const,
  fullProfile: (userId: string) => [...accountKeys.all, 'fullProfile', userId] as const,
  tenantProfile: (userId: string, tenantId: string) => [...accountKeys.all, 'tenantProfile', userId, tenantId] as const,
};
