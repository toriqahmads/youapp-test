import { Horoscope } from 'src/shared/enum/horoscope.enum';

export type HoroscopeDate = {
  start: {
    date: number;
    month: number;
  };
  end: {
    date: number;
    month: number;
  };
  horoscope: Horoscope;
};

export const HoroscopeDateTable: HoroscopeDate[] = [
  {
    start: {
      date: 20,
      month: 1,
    },
    end: {
      date: 18,
      month: 2,
    },
    horoscope: Horoscope.AQUARIUS,
  },
  {
    start: {
      date: 19,
      month: 2,
    },
    end: {
      date: 20,
      month: 3,
    },
    horoscope: Horoscope.PISCES,
  },
  {
    start: {
      date: 21,
      month: 3,
    },
    end: {
      date: 19,
      month: 4,
    },
    horoscope: Horoscope.ARIES,
  },
  {
    start: {
      date: 20,
      month: 4,
    },
    end: {
      date: 20,
      month: 5,
    },
    horoscope: Horoscope.TAURUS,
  },
  {
    start: {
      date: 21,
      month: 5,
    },
    end: {
      date: 21,
      month: 6,
    },
    horoscope: Horoscope.GEMINI,
  },
  {
    start: {
      date: 22,
      month: 6,
    },
    end: {
      date: 22,
      month: 7,
    },
    horoscope: Horoscope.CANCER,
  },
  {
    start: {
      date: 23,
      month: 7,
    },
    end: {
      date: 22,
      month: 8,
    },
    horoscope: Horoscope.LEO,
  },
  {
    start: {
      date: 23,
      month: 8,
    },
    end: {
      date: 22,
      month: 9,
    },
    horoscope: Horoscope.VIRGO,
  },
  {
    start: {
      date: 23,
      month: 9,
    },
    end: {
      date: 23,
      month: 10,
    },
    horoscope: Horoscope.LIBRA,
  },
  {
    start: {
      date: 24,
      month: 10,
    },
    end: {
      date: 21,
      month: 11,
    },
    horoscope: Horoscope.SCORPIUS,
  },
  {
    start: {
      date: 22,
      month: 11,
    },
    end: {
      date: 21,
      month: 12,
    },
    horoscope: Horoscope.SAGITTARIUS,
  },
  {
    start: {
      date: 22,
      month: 12,
    },
    end: {
      date: 19,
      month: 1,
    },
    horoscope: Horoscope.CAPRICORNUS,
  },
];

export function calculateHoroscope(birthday: Date): Horoscope {
  birthday = new Date(birthday);
  birthday.setHours(0, 0, 0, 0);
  const date = birthday.getDate();
  const month = birthday.getMonth() + 1;
  const dob = new Date(`${month}-${date}`);

  let horoscope: Horoscope;
  for (let i = 0; i < HoroscopeDateTable.length; i++) {
    const start_date = new Date(
      `${HoroscopeDateTable[i].start.month}-${HoroscopeDateTable[i].start.date}`,
    );
    const end_date = new Date(
      `${HoroscopeDateTable[i].end.month}-${HoroscopeDateTable[i].end.date}`,
    );

    if (dob >= start_date && dob <= end_date)
      horoscope = HoroscopeDateTable[i].horoscope;
  }

  return horoscope;
}
