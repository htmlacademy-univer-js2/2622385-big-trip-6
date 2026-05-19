import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting-view.js';
import PointPresenter from './point-presenter.js';
import TripModel from '../model/trip-model.js';
import EmptyPointsView from '../view/empty-points-view.js';
import { generateFilters } from '../utils.js';

export default class TripPresenter {
  constructor() {
    this.container = null;
    this.filtersContainer = null;
    this.model = new TripModel();
    this.eventsList = null;
    this.pointViews = new Map();
    this.pointPresenters = new Map();
  }

  init() {
    this.container = document.querySelector('.trip-events');
    this.filtersContainer = document.querySelector('.trip-controls__filters');
    if (!this.container) {
      return;
    }

    this.render();
  }

  render() {
    this.container.innerHTML = '';
    this.renderFilters();
    this.renderSorting();

    const points = this.model.getPoints();

    if (points.length === 0) {
      const emptyPointsView = new EmptyPointsView();
      this.container.appendChild(emptyPointsView.element);
      return;
    }

    this.eventsList = document.createElement('ul');
    this.eventsList.classList.add('trip-events__list');
    this.container.appendChild(this.eventsList);

    points.forEach((point) => {
      const pointPresenter =
        new PointPresenter({
          container: this.eventsList,
          model: this.model,
          onDataChange:
            this.handlePointChange,
          onModeChange:
            this.handleModeChange,
        });

      pointPresenter.init(point);

      this.pointPresenters.set(
        point.id,
        pointPresenter
      );
    });
  }

  renderFilters() {
    if (this.filtersContainer) {
      const points = this.model.getPoints();
      const filters = generateFilters(points);
      const filtersView = new FiltersView(filters);
      this.filtersContainer.innerHTML = '';
      this.filtersContainer.appendChild(filtersView.element);
    }
  }

  renderSorting() {
    const sortingView = new SortingView();
    this.container.appendChild(sortingView.element);
  }

  handlePointChange = (updatedPoint) => {
    this.model.updatePoint(
      updatedPoint.id,
      updatedPoint
    );

    const pointPresenter =
      this.pointPresenters.get(
        updatedPoint.id
      );

    if (pointPresenter) {
      pointPresenter.destroy();

      pointPresenter.init(updatedPoint);
    }
  };

  handleModeChange = () => {
    this.pointPresenters.forEach(
      (presenter) =>
        presenter.resetView()
    );
  };
}
