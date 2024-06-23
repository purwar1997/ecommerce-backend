const padZero = num => (num < 10 ? '0' : '') + num;

const parseDate = currentDate => {
  const year = currentDate.getFullYear();
  const month = padZero(currentDate.getMonth() + 1);
  const date = padZero(currentDate.getDate());

  return `access-${year}-${month}-${date}.log`;
};

const generator = date => {
  if (!date) {
    return parseDate(new Date());
  }

  return parseDate(date);
};

export default generator;
