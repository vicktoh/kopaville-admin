export const roundNumbers = (number: number) => {
  if (number < 1000) {
    return number;
  }

  if (number >= 1000 && number < 1000000) {
    return `${number / 1000}K`;
  } else {
    return `${number / 1000000}M`;
  }
};
