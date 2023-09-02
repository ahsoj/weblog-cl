import { twMerge } from 'tailwind-merge';
import { clsx, ClassValue } from 'clsx';

export function twmesh(...props: ClassValue[]) {
  return twMerge(clsx(props));
}
