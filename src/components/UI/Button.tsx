import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn('focus-ring rounded-xl border border-white/10 bg-sky-300/15 px-4 py-2 text-sm font-medium text-sky-50 transition hover:bg-sky-300/25 disabled:opacity-50', className)} {...props} />;
}
