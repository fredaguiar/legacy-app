type TLabelsValues = { label: string; value: string };

const getMap = (contant: TLabelsValues[]) => {
  const map = new Map();
  contant.forEach((item) => {
    map.set(item.value, item.label);
  });
  return map;
};

const generateNumberConstants = (start: number, end: number) => {
  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push({ label: i.toString(), value: i.toString() });
  }
  return arr;
};

const MapsUtil = {
  getMap,
  generateNumberConstants,
};

export { MapsUtil };
