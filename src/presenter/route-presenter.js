import PointsView from '../view/points-view.js';
import SortingView from '../view/sorting-view.js';
import EmptyPointsView from '../view/empty-points-view.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { SortType } from '../view/sorting-view.js';

export class RoutePresenter {
  #model;

  #currentSortType = SortType.DAY;
  #pointPresenters = new Map();
  #pointListComponent = new PointsView();
  #sortingView = null;

  constructor({model}) {
    this.#model = model;
  }

  init() {
    render(this.#pointListComponent, document.querySelector('.trip-events'));

    if (this.#model.getPoints().length === 0) {
      this.#renderEmptyPoints();
      return;
    }

    this.#renderSorting();
    this.#renderPoints();
  }

  #renderEmptyPoints() {
    const empty = new EmptyPointsView();
    render(empty, this.#pointListComponent.element);
  }

  #renderSorting() {
    this.#sortingView = new SortingView(this.#currentSortType);
    this.#sortingView.setSortTypeChangeHandler(this.#handleSortTypeChange);

    render(
      this.#sortingView,
      document.querySelector('.trip-events'),
      RenderPosition.AFTERBEGIN,
    );
  }

  #handleSortTypeChange = (sortType) => {
    this.#currentSortType = sortType;

    this.#clearPointList();

    remove(this.#sortingView);

    this.#renderSorting();
    this.#renderPoints();
  };

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) =>
      presenter.destroy()
    );

    this.#pointPresenters = new Map();
    this.#pointListComponent.element.innerHTML = '';
  }

  #getSortedPoints() {
    const points = [...this.#model.getPoints()];

    switch (this.#currentSortType) {
      case SortType.DAY:
        return points.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

      case SortType.TIME:
        return points.sort((a, b) => {
          const durationA = new Date(a.dateTo) - new Date(a.dateFrom);
          const durationB = new Date(b.dateTo) - new Date(b.dateFrom);
          return durationB - durationA;
        });

      case SortType.PRICE:
        return points.sort((a, b) => b.basePrice - a.basePrice);
      default:
        return points.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
    }
  }

  #renderPoints() {
    const points = this.#getSortedPoints();

    for (const event of points) {
      const presenter = new PointPresenter({
        model: this.#model,
        onDataChange: this.#handlePointChange,
        onModeChange: this.#handleModeChange,
      });

      presenter.init(this.#pointListComponent, event);
      this.#pointPresenters.set(event.id, presenter);
    }
  }

  #handlePointChange = (updatedPoint) => {
    const updatedModelPoint =
      this.#model.updatePoint(
        updatedPoint.id,
        updatedPoint
      );

    const presenter =
      this.#pointPresenters.get(updatedPoint.id);

    presenter?.init(
      this.#pointListComponent,
      updatedModelPoint
    );
  };

  #handleModeChange = (currentPresenter) => {
    this.#pointPresenters.forEach((presenter) => {
      if (presenter !== currentPresenter) {
        presenter.resetView();
      }
    });
  };
}
