// Convert stored HH:mm to a Date object
const convertTimeToDate = (time: string | undefined) => {
  if (!time) return new Date();
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(Number.parseInt(hours), Number.parseInt(minutes), 0, 0);
  return date;
};

const weedaysArray: Array<TWeekdays> = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

const convertWeekdayToIndexes = (weekdays: Array<TWeekdays> | undefined) => {
  if (!weekdays) return [];
  return weekdays.map((day) => weedaysArray.findIndex((weekday) => weekday === day));
};

const convertIndexesToWeekday = (weekdays: Array<number> | undefined) => {
  if (!weekdays) return [];
  return weekdays.map((i) => weedaysArray[i]);
};

export { convertTimeToDate, convertWeekdayToIndexes, convertIndexesToWeekday };
