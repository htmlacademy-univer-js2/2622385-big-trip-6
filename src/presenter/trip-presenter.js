import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting-view.js';
import PointPresenter from './point-presenter.js';
import EmptyPointsView from '../view/empty-points-view.js';
import { generateFilters } from '../utils.js';
import { SortType } from '../view/sorting-view.js';

export default class TripPresenter {
  #container = null;
  #filtersContainer = null;
  #model = null;

  #sortingView = null;
  #eventsList = null;
  #pointPresenters = new Map();
  #currentSortType = SortType.DAY;

  constructor(model) {
    this.#model = model;
  }

  init() {
    this.#container = document.querySelector('.trip-events');
    this.#filtersContainer = document.querySelector('.trip-controls__filters');

    if (!this.#container) {
      return;
    }

    this.#render();
  }

  #render() {
    this.#container.innerHTML = '';

    this.#renderFilters();
    this.#renderSorting();
    this.#renderPoints();
  }

  #renderFilters() {
    if (this.#filtersContainer) {
      const points = this.#model.getPoints();
      const filters = generateFilters(points);
      const filtersView = new FiltersView(filters);
      this.#filtersContainer.innerHTML = '';
      this.#filtersContainer.appendChild(filtersView.element);
    }
  }

  #renderSorting() {
    this.#sortingView = new SortingView();
    this.#container.appendChild(this.#sortingView.element);

    this.#sortingView.setSortTypeChangeHandler(this.#handleSortTypeChange);
  }

  #handleSortTypeChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPoints();
  };

  #getSortedPoints() {
    const points = [...this.#model.getPoints()];

    switch (this.#currentSortType) {
      case SortType.DAY:
        return points.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

      case SortType.TIME:
        return points.sort((a, b) => {
          const durationA = new Date(a.dateTo) - new Date(a.dateFrom);
          const durationB = new Date(b.dateTo) - new Date(b.dateFrom);
          return durationA - durationB;
        });

      case SortType.PRICE:
        return points.sort((a, b) => a.basePrice - b.basePrice);
      default:
        return points.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
    }
  }

  #renderPoints() {
    const points = this.#getSortedPoints();

    if (points.length === 0) {
      const emptyView = new EmptyPointsView();
      this.#container.appendChild(emptyView.element);
      return;
    }

    this.#eventsList = document.createElement('ul');
    this.#eventsList.classList.add('trip-events__list');
    this.#container.appendChild(this.#eventsList);

    points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        container: this.#eventsList,
        model: this.#model,
        onDataChange: this.#handlePointChange,
        onModeChange: this.#handleModeChange,
      });

      pointPresenter.init(point);
      this.#pointPresenters.set(point.id, pointPresenter);
    });
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    if (this.#eventsList) {
      this.#eventsList.remove();
      this.#eventsList = null;
    }
  }

  #handlePointChange = (updatedPoint) => {
    this.#model.updatePoint(updatedPoint.id, updatedPoint);

    this.#clearPointList();
    this.#renderPoints();
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };
}
