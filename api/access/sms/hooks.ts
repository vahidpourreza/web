'use client';

import { useQuery } from '@tanstack/react-query';
import { smsService } from './service';
import { smsKeys } from './keys';
import { unwrapApiResponse } from '@/api/utils';

export function useAllSms({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: smsKeys.list(),
    queryFn: () => unwrapApiResponse(smsService.getAll()),
    staleTime: 2 * 60 * 1000,
    enabled,
  });
}
