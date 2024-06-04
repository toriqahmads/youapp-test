import { OrderedZodiac, Zodiac } from 'src/shared/enum/zodiac.enum';

export function getChineseYearFromGeorgianDate(date: Date): number {
  date = new Date(date);
  date.setHours(0, 0, 0, 0);

  return Number(
    new Intl.DateTimeFormat('fr-TN-u-ca-chinese', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
      .format(date)
      .substring(0, 4),
  );
}

// calculation is
// georgian date convert to chinese date
// get the year of the chinese date
// modulus with 12
// the remaining is the zodiac sign from ordered zodiac list
export function calculateZodiac(birthday: Date): Zodiac {
  const chineseYear = getChineseYearFromGeorgianDate(birthday);
  const calculateSign = chineseYear % 12;

  return OrderedZodiac[calculateSign];
}
