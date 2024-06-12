const padZero = num => (num < 10 ? '0' : '') + num;

const parseDate = dateObj => {
  const year = dateObj.getFullYear();
  const month = padZero(dateObj.getMonth() + 1);
  const date = padZero(dateObj.getDate());

  return `access-${year}-${month}-${date}.log`;
};

const generator = date => {
  if (!date) {
    return parseDate(new Date());
  }

  return parseDate(date);
};

export default generator;
