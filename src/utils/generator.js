import { format } from 'date-fns';

const formatDate = date => {
  const dateString = format(date, 'yyyy-MM-dd');
  return `access-${dateString}.log`;
};

const generator = date => {
  if (!date) {
    return formatDate(new Date());
  }

  return formatDate(date);
};

export default generator;
