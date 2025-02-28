export const convertHiraganaToKatakana = (str: string) => {
  return str.replace(/[\u3041-\u3096]/g, match => {
    return String.fromCharCode(match.charCodeAt(0) + 0x60);
  });
};

export const fullWidthToHalfWidth = (str: string): string => {
  str = str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, match => {
    return String.fromCharCode(match.charCodeAt(0) - 0xfee0);
  });
  // prettier-ignore
  const kanaMap: Record<string, string> = {
    ガ: 'ｶﾞ', ギ: 'ｷﾞ', グ: 'ｸﾞ', ゲ: 'ｹﾞ', ゴ: 'ｺﾞ',
    ザ: 'ｻﾞ', ジ: 'ｼﾞ', ズ: 'ｽﾞ', ゼ: 'ｾﾞ', ゾ: 'ｿﾞ',
    ダ: 'ﾀﾞ', ヂ: 'ﾁﾞ', ヅ: 'ﾂﾞ', デ: 'ﾃﾞ', ド: 'ﾄﾞ',
    バ: 'ﾊﾞ', ビ: 'ﾋﾞ', ブ: 'ﾌﾞ', ベ: 'ﾍﾞ', ボ: 'ﾎﾞ',
    パ: 'ﾊﾟ', ピ: 'ﾋﾟ', プ: 'ﾌﾟ', ペ: 'ﾍﾟ', ポ: 'ﾎﾟ',
    ヴ: 'ｳﾞ', ヷ: 'ﾜﾞ', ヺ: 'ｦﾞ',
    ア: 'ｱ', イ: 'ｲ', ウ: 'ｳ', エ: 'ｴ', オ: 'ｵ',
    カ: 'ｶ', キ: 'ｷ', ク: 'ｸ', ケ: 'ｹ', コ: 'ｺ',
    サ: 'ｻ', シ: 'ｼ', ス: 'ｽ', セ: 'ｾ', ソ: 'ｿ',
    タ: 'ﾀ', チ: 'ﾁ', ツ: 'ﾂ', テ: 'ﾃ', ト: 'ﾄ',
    ナ: 'ﾅ', ニ: 'ﾆ', ヌ: 'ﾇ', ネ: 'ﾈ', ノ: 'ﾉ',
    ハ: 'ﾊ', ヒ: 'ﾋ', フ: 'ﾌ', ヘ: 'ﾍ', ホ: 'ﾎ',
    マ: 'ﾏ', ミ: 'ﾐ', ム: 'ﾑ', メ: 'ﾒ', モ: 'ﾓ',
    ヤ: 'ﾔ', ユ: 'ﾕ', ヨ: 'ﾖ',
    ラ: 'ﾗ', リ: 'ﾘ', ル: 'ﾙ', レ: 'ﾚ', ロ: 'ﾛ',
    ワ: 'ﾜ', ヲ: 'ｦ', ン: 'ﾝ',
    ァ: 'ｧ', ィ: 'ｨ', ゥ: 'ｩ', ェ: 'ｪ', ォ: 'ｫ',
    ッ: 'ｯ', ャ: 'ｬ', ュ: 'ｭ', ョ: 'ｮ',
    '。': '｡', '、': '､', ー: 'ｰ', '「': '｢', '」': '｣', '・': '･'
  };
  const reg = new RegExp(`(${Object.keys(kanaMap).join('|')})`, 'g');
  return str
    .replace(reg, match => {
      return kanaMap[match];
    })
    .replace(/゛/g, 'ﾞ')
    .replace(/゜/g, 'ﾟ');
};

export const convertJapaneseEraToGregorian = (input: string): string | null => {
  const japanRegex = /^(令和|平成|昭和|大正|明治)(\d+)(年)?$/;
  const match = input.match(japanRegex);
  if (!match) return null;
  const era = match[1];
  const eraYear = parseInt(match[2], 10);
  let gregYear: number;
  switch (era) {
    case '令和':
      gregYear = 2018 + eraYear;
      break;
    case '平成':
      gregYear = 1988 + eraYear;
      break;
    case '昭和':
      gregYear = 1925 + eraYear;
      break;
    case '大正':
      gregYear = 1911 + eraYear;
      break;
    case '明治':
      gregYear = 1867 + eraYear;
      break;
    default:
      return null;
  }
  return `${gregYear.toString()}年`;
};

export const convertGregorianToJapaneseEra = (input: string): string | null => {
  const gregRegex = /^(\d{3,4})(年)?$/;
  const match = input.match(gregRegex);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  let era: string;
  let eraYear: number;
  if (year >= 2019) {
    era = '令和';
    eraYear = year - 2018;
  } else if (year >= 1989) {
    era = '平成';
    eraYear = year - 1988;
  } else if (year >= 1926) {
    era = '昭和';
    eraYear = year - 1925;
  } else if (year >= 1912) {
    era = '大正';
    eraYear = year - 1911;
  } else if (year >= 1868) {
    era = '明治';
    eraYear = year - 1867;
  } else {
    return null;
  }
  return `${era + eraYear.toString()}年`;
};
