import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';

export function formatDate(date: string, lang: 'tr' | 'en' = 'tr'): string {
  const dateObj = new Date(date);
  const locale = lang === 'tr' ? tr : enUS;

  return format(dateObj, 'd MMMM yyyy', { locale }); // örnek: 10 Nisan 2025
}
