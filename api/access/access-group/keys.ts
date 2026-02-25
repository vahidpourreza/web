export const accessGroupKeys = {
  all: ['access-group'] as const,
  lists: () => [...accessGroupKeys.all, 'list'] as const,
  byTenant: (tenantId: string) => [...accessGroupKeys.all, 'tenant', tenantId] as const,
  details: () => [...accessGroupKeys.all, 'detail'] as const,
  detail: (accessGroupId: string) => [...accessGroupKeys.details(), accessGroupId] as const,
};
