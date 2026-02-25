export const otpKeys = {
  all: ['otp'] as const,
  mobile: (id: string) => [...otpKeys.all, 'mobile', id] as const,
};
