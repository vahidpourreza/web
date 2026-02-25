export const tenantKeys = {
  all: ['tenant'] as const,
  lists: () => [...tenantKeys.all, 'list'] as const,
  summary: () => [...tenantKeys.lists(), 'summary'] as const,
  compactSummary: () => [...tenantKeys.lists(), 'compactSummary'] as const,
  details: () => [...tenantKeys.all, 'detail'] as const,
  detail: (id: string) => [...tenantKeys.details(), id] as const,
};
