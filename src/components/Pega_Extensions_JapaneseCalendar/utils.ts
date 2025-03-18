const toHalfDigits = (s: string): string =>
  s.replace(/[０-９]/g, d => String.fromCharCode(d.charCodeAt(0) - 0xff10 + 0x30));

const toFullDigits = (s: string): string =>
  s.replace(/\d/g, d => String.fromCharCode(d.charCodeAt(0) - 0x30 + 0xff10));

export const convertGregorianToJapaneseEra = (str: string): string => {
  const regex = /([\d０-９]+)年(?:\s*([\d０-９]+)月(?:\s*([\d０-９]+)日)?)?/;
  return str.replace(regex, (match, yearStr, monthStr, dayStr) => {
    const isYearFull = /[０-９]/.test(yearStr);

    const gregYear = parseInt(toHalfDigits(yearStr), 10);
    if (Number.isNaN(gregYear)) return match;

    let gregMonth: number;
    let gregDay: number;
    if (monthStr !== undefined) {
      gregMonth = parseInt(toHalfDigits(monthStr), 10);
      if (Number.isNaN(gregMonth)) return match;
    } else {
      gregMonth = 12;
    }
    if (dayStr !== undefined) {
      gregDay = parseInt(toHalfDigits(dayStr), 10);
      if (Number.isNaN(gregDay)) return match;
    } else if (monthStr !== undefined) {
      gregDay = new Date(gregYear, gregMonth, 0).getDate();
    } else {
      gregDay = 31;
    }
    const inputDate = new Date(gregYear, gregMonth - 1, gregDay);

    const eras = [
      { era: '令和', start: new Date(2019, 4, 1) },
      { era: '平成', start: new Date(1989, 0, 8) },
      { era: '昭和', start: new Date(1926, 11, 25) },
      { era: '大正', start: new Date(1912, 6, 30) },
      { era: '明治', start: new Date(1868, 0, 25) }
    ];

    const selectedEra = eras.find(eraData => inputDate >= eraData.start);
    if (!selectedEra) return match;

    const eraYear = gregYear - selectedEra.start.getFullYear() + 1;
    let eraYearStr: string;
    if (eraYear === 1) {
      eraYearStr = '元';
    } else {
      eraYearStr = isYearFull ? toFullDigits(eraYear.toString()) : eraYear.toString();
    }

    let result = `${selectedEra.era}${eraYearStr}年`;
    if (monthStr !== undefined) result += `${monthStr}月`;
    if (dayStr !== undefined) result += `${dayStr}日`;

    return result;
  });
};

export const convertJapaneseEraToGregorian = (str: string): string => {
  return str.replace(/(明治|大正|昭和|平成|令和)(元|[\d０-９]+)年/, (match, era, yearStr) => {
    const eraStartYears: { [key: string]: number } = {
      令和: 2019,
      平成: 1989,
      昭和: 1926,
      大正: 1912,
      明治: 1868
    };
    const startYear = eraStartYears[era];
    if (!startYear) return match;

    const eraYearNumber = yearStr === '元' ? 1 : parseInt(toHalfDigits(yearStr), 10);

    const gregYear = startYear + eraYearNumber - 1;
    const isFullWidth = /[０-９]/.test(yearStr);
    const formattedYear = isFullWidth ? toFullDigits(gregYear.toString()) : gregYear.toString();

    return `${formattedYear}年`;
  });
};
