export const workspaceKeys = {
  all: ['workspace'] as const,
  desks: () => [...workspaceKeys.all, 'desks'] as const,
  desk: (deskId: string) => [...workspaceKeys.desks(), deskId] as const,
  space: () => [...workspaceKeys.all, 'space'] as const,
  menus: () => [...workspaceKeys.all, 'menus'] as const,
  available: () => [...workspaceKeys.all, 'available'] as const,
};
