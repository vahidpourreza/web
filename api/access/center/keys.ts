export const centerKeys = {
  all: ['center'] as const,
  lists: () => [...centerKeys.all, 'list'] as const,
  currentTenantFlat: () => [...centerKeys.lists(), 'currentTenantFlat'] as const,
  currentTenant: () => [...centerKeys.lists(), 'currentTenant'] as const,
  byTenant: (tenantId: string) => [...centerKeys.lists(), 'tenant', tenantId] as const,
  details: () => [...centerKeys.all, 'detail'] as const,
  detail: (centerId: string) => [...centerKeys.details(), centerId] as const,
  tree: (centerId: string) => [...centerKeys.all, 'tree', centerId] as const,
};
