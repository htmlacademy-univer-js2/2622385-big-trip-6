import { FilterType } from './model/const';
import he from 'he';

const isEscapeKey = (evt) => evt.key === 'Escape';

const encode = (value) => he.encode(String(value ?? ''));

const getFilteredPoints = (points, filterType) => {
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

export function generateFilters(points, currentFilterType) {
  const now = new Date();
  return [
    {
      type: FilterType.EVERYTHING,
      name: 'Everything',
      count: points.length,
      disabled: points.length === 0,
      isChecked: currentFilterType === FilterType.EVERYTHING,
    },
    {
      type: FilterType.FUTURE,
      name: 'Future',
      count: points.filter((point) => new Date(point.dateFrom) > now).length,
      disabled: !points.some((point) => new Date(point.dateFrom) > now),
      isChecked: currentFilterType === FilterType.FUTURE,
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
      isChecked: currentFilterType === FilterType.PRESENT,
    },
    {
      type: FilterType.PAST,
      name: 'Past',
      count: points.filter((point) => new Date(point.dateTo) < now).length,
      disabled: !points.some((point) => new Date(point.dateTo) < now),
      isChecked: currentFilterType === FilterType.PAST,
    },
  ];
}

export {encode, getFilteredPoints, isEscapeKey};
