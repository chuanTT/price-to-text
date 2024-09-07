// debuggerd
// dd

/**
 * @type {(string | { prefix: string, suffix: string })[]}
 */
const arrTextNumber = [
  "Một",
  "Hai",
  "Ba",
  "Bốn",
  {
    prefix: "Năm",
    suffix: "Lăm",
  },
  "Sáu",
  "Bảy",
  "Tám",
  "Chín",
];

// 10
// Mười
// Hai mươi
// 100
// Một trăm nghìn
// 101
// Một trăm lẻ một
// 150
// Một trăm lăm mươi nghìn đồng

/**
 * Chuyển đổi số thành văn bản tương ứng.
 * @function
 * @param {number} number - Số cần chuyển đổi (từ 1 đến 9).
 * @param {'prefix' | 'suffix'} [key='prefix'] - Tên thuộc tính của đối tượng (mặc định là 'prefix').
 * @returns {string} - Văn bản tương ứng với số, hoặc chuỗi rỗng nếu số lớn hơn 9.
 */
const convertNumberSingleToText = (number, key = "prefix") => {
  if (number > 9) return "";
  const numberText = arrTextNumber[number - 1];
  const isString = typeof numberText === "string";
  const text = isString ? numberText : numberText?.[key];
  return key === "suffix" ? text?.toLocaleLowerCase() : text;
};

/**
 * @function
 * @param {number} number
 * @returns {string}
 */
const convertNumberToText = (number) => {
  if (number <= 9) {
    return convertNumberSingleToText(number);
  } else if (number >= 10 && number < 20) {
    const lastNumber = number?.toString()?.charAt(1);
    const suffixStr =
      number > 10 ? convertNumberSingleToText(+lastNumber, "suffix") : "";
    return `Mười ${suffixStr}`.trim();
  } else if (number >= 20 && number < 100) {
    const strNumber = number.toString();
    const prefixNumber = +strNumber.charAt(0);
    const suffixNumber = +strNumber.charAt(1);
    const textPrefix = convertNumberSingleToText(prefixNumber);
    const textSuffix =
      suffixNumber > 0 ? convertNumberSingleToText(suffixNumber, "suffix") : "";
    return `${textPrefix} mươi ${textSuffix}`.trim();
  } else {
    const strNumber = number.toString();
    const prefixStr = +strNumber.charAt(0);
    const suffixStr = +strNumber.substring(1);
    let str = `${convertNumberSingleToText(prefixStr)} trăm`;
    if (suffixStr > 0 && suffixStr < 9) {
      str += ` lẻ ${convertNumberSingleToText(suffixStr, "suffix")}`;
    } else if (suffixStr > 9) {
      str += ` ${convertNumberToText(suffixStr)?.toLocaleLowerCase()}`;
    }
    return str.trim();
  }
};

/**
 * @function
 * @param {number} length
 * @returns {string}
 */
const convertNumberToUnitText = (length) => {
  if (length <= 3) {
    return "đồng";
  } else if (length > 3 && length <= 6) {
    return "nghìn";
  } else if (length > 6 && length <= 9) {
    return "triệu";
  } else if (length > 9) {
    return "tỷ";
  } else {
    return "";
  }
};

/**
 * @function
 * @param {number} number
 * @param {number | undefined} unitNumber
 * @returns {string}
 */
const concatNumberTextToUnit = (number, unitNumber) => {
  const unit = unitNumber || number?.toString()?.length;
  return `${convertNumberToText(number) ?? ""} ${convertNumberToUnitText(
    unit
  )}`.trim();
};

/**
 * @function
 * @param {number} number
 * @returns {string}
 */
const convertNumerToVND = (number) => {
  if (number === undefined) return "";
  const strNumber = number?.toString();
  const length = strNumber?.length;
  if (length <= 3) {
    return concatNumberTextToUnit(number);
  } else {
    const loop = Math.ceil(length / 3);
    let numberStr = strNumber;
    let unitText = 3;
    let str = "";
    for (let i = 0; i < loop; i++) {
      const isEndLoop = i === loop - 1;
      const start = numberStr?.length;
      const strNumber = numberStr.substring(start, start - 3);
      const newNumber = +strNumber;
      const isSpirit = isEndLoop ? false : newNumber?.toString()?.length === 1 && newNumber !== 0;
      numberStr = numberStr.slice(0, start - 3);
      const value = !(i > 0 && newNumber === 0)  ? concatNumberTextToUnit(newNumber, unitText) : "";
      str = `${isSpirit ? "lẻ" : ""} ${isEndLoop ? value : value?.toLocaleLowerCase()} ${str}`.trim();
      unitText += 3;
    }
    return str.trim();
  }
};
