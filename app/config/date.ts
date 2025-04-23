import dayjs from 'dayjs';
import 'dayjs/locale/tr';
import 'dayjs/locale/en';

export const formatDate = (date: string, locale: 'tr' | 'en') => {
    return dayjs(date).locale(locale).format('D MMMM YYYY');
};