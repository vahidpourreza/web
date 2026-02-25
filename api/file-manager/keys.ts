export const fileManagerKeys = {
  all: ['file-manager'] as const,

  sessions: () => [...fileManagerKeys.all, 'session'] as const,
  session: (sessionId: string) => [...fileManagerKeys.sessions(), sessionId] as const,

  files: () => [...fileManagerKeys.all, 'file'] as const,
  file: (fileId: string) => [...fileManagerKeys.files(), fileId] as const,
};
