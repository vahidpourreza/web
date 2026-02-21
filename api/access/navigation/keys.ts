export const navigationKeys = {
  all: ['navigation'] as const,
  byClient: (clientApp: string) => [...navigationKeys.all, 'client', clientApp] as const,
  licensable: () => [...navigationKeys.all, 'licensable'] as const,
  currentLicense: () => [...navigationKeys.all, 'currentLicense'] as const,
  adminScope: () => [...navigationKeys.all, 'adminScope'] as const,
};
