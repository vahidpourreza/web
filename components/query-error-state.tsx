import { TriangleAlertIcon, RotateCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QueryErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function QueryErrorState({
  message = 'خطا در بارگذاری اطلاعات',
  onRetry,
}: QueryErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 p-6 text-center">
      <TriangleAlertIcon className="size-5 text-muted-foreground/60" />
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-1">
          <RotateCwIcon />
          تلاش مجدد
        </Button>
      )}
    </div>
  );
}
