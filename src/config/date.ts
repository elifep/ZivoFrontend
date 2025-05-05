import { format } from 'date-fns';
import { tr, enUS } from 'date-fns/locale';
import { arSA } from 'date-fns/locale'; // Arapça locale

export function formatDate(date: string, lang: string): string {
  const dateObj = new Date(date);
  const locale =
    lang === 'tr' ? tr :
      lang === 'ar' ? arSA :
        enUS;

  return format(dateObj, 'd MMMM yyyy', { locale }); // örnek: 10 نيسان 2025
}