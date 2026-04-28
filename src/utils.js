import { FilterType } from './model/const';

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function getRandomObjectField(object) {
  const values = Object.values(object);
  return values[Math.floor(Math.random() * values.length)];
}

export {getRandomArrayElement};
export {getRandomObjectField};

const filterEverything = (points) => [...points];

const filterFuture = (points) => {
  const now = new Date();
  return points.filter((point) => new Date(point.dateFrom) > now);
};

const filterPresent = (points) => {
  const now = new Date();
  return points.filter((point) => {
    const dateFrom = new Date(point.dateFrom);
    const dateTo = new Date(point.dateTo);
    return dateFrom <= now && dateTo >= now;
  });
};

const filterPast = (points) => {
  const now = new Date();
  return points.filter((point) => new Date(point.dateTo) < now);
};

export const filters = {
  [FilterType.EVERYTHING]: filterEverything,
  [FilterType.FUTURE]: filterFuture,
  [FilterType.PRESENT]: filterPresent,
  [FilterType.PAST]: filterPast
};

export const getFilteredPoints = (points, filterType) => {
  const filterFn = filters[filterType];
  return filterFn ? filterFn(points) : points;
};

export const getFiltersInfo = (points) => {
  const filtersInfo = {};
  Object.entries(filters).forEach(([filterType, filterFn]) => {
    const filteredPoints = filterFn(points);
    filtersInfo[filterType] = {
      count: filteredPoints.length,
      isDisabled: filteredPoints.length === 0
    };
  });
  return filtersInfo;
};
