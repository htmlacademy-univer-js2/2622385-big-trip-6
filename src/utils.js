import { FilterType } from './model/const';

export const getFilteredPoints = (points, filterType) => {
  const now = new Date();
  switch (filterType) {
    case FilterType.FUTURE:
      return points.filter((point) => new Date(point.dateFrom) > now);
    case FilterType.PRESENT:
      return points.filter((point) => new Date(point.dateFrom) <= now && new Date(point.dateTo) >= now);
    case FilterType.PAST:
      return points.filter((point) => new Date(point.dateTo) < now);
    case FilterType.EVERYTHING:
    default:
      return points;
  }
};

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

export function generateFilters(points, currentFilterType) {
  const now = new Date();
  return [
    {
      type: FilterType.EVERYTHING,
      name: 'Everything',
      count: points.length,
      disabled: points.length === 0,
      isChecked: currentFilterType === FilterType.EVERYTHING, // <-- ДОБАВЛЕНО
    },
    {
      type: FilterType.FUTURE,
      name: 'Future',
      count: points.filter((point) => new Date(point.dateFrom) > now).length,
      disabled: !points.some((point) => new Date(point.dateFrom) > now),
      isChecked: currentFilterType === FilterType.FUTURE, // <-- ДОБАВЛЕНО
    },
    {
      type: FilterType.PRESENT,
      name: 'Present',
      count: points.filter((point) => {
        const start = new Date(point.dateFrom);
        const end = new Date(point.dateTo);
        return start <= now && end >= now;
      }).length,
      disabled: !points.some((point) => {
        const start = new Date(point.dateFrom);
        const end = new Date(point.dateTo);
        return start <= now && end >= now;
      }),
      isChecked: currentFilterType === FilterType.PRESENT, // <-- ДОБАВЛЕНО
    },
    {
      type: FilterType.PAST,
      name: 'Past',
      count: points.filter((point) => new Date(point.dateTo) < now).length,
      disabled: !points.some((point) => new Date(point.dateTo) < now),
      isChecked: currentFilterType === FilterType.PAST, // <-- ДОБАВЛЕНО
    },
  ];
}

export const EVENT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};
