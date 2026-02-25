import { icons, type LucideIcon } from 'lucide-react';

export function getLucideIcon(name: string | null | undefined): LucideIcon | null {
  if (!name) return null;
  return (icons as Record<string, LucideIcon>)[name] ?? null;
}
