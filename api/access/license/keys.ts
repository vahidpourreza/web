export const licenseKeys = {
  all: ['license'] as const,
  lists: () => [...licenseKeys.all, 'list'] as const,
  tenants: () => [...licenseKeys.all, 'tenants'] as const,
  tenantHistory: (tenantId: string) => [...licenseKeys.all, 'tenantHistory', tenantId] as const,
  details: () => [...licenseKeys.all, 'detail'] as const,
  detail: (id: string) => [...licenseKeys.details(), id] as const,
};
