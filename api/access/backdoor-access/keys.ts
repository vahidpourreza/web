export const backdoorAccessKeys = {
  all: ['backdoor-access'] as const,
  users: () => [...backdoorAccessKeys.all, 'users'] as const,
  byUser: (userId: string) => [...backdoorAccessKeys.all, 'user', userId] as const,
};
