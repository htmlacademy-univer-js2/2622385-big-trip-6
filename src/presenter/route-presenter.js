import PointsView from '../view/points-view.js';
import SortingView from '../view/sorting-view.js';
import EmptyPointsView from '../view/empty-points-view.js';
import { render, RenderPosition, remove } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { SortType } from '../view/sorting-view.js';
import { getFilteredPoints, UserAction } from '../utils.js';
import { FilterType } from '../model/const.js';
import AddPointPresenter from './add-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export class RoutePresenter {
  #model;
  #filterModel;
  #currentSortType = SortType.DAY;
  #pointPresenters = new Map();
  #addNewPointPresenter = null;
  #pointListComponent = new PointsView();
  #loadingComponent = new LoadingView();
  #sortingView = null;
  #emptyComponent = null;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  #onNewPointFormOpen;
  #onNewPointFormClose;

  constructor({ model, filterModel, onNewPointFormOpen, onNewPointFormClose }) {
    this.#model = model;
    this.#filterModel = filterModel;
    this.#onNewPointFormOpen = onNewPointFormOpen;
    this.#onNewPointFormClose = onNewPointFormClose;

    this.#model.addObserver(this.#handleModelChange);
    this.#filterModel.addObserver(this.#handleModelChange);
  }

  init() {
    render(this.#pointListComponent, document.querySelector('.trip-events'));
    render(this.#loadingComponent, this.#pointListComponent.element);
  }

  renderBoard() {
    remove(this.#loadingComponent);
  }

  #renderEmptyPoints() {
    if (this.#emptyComponent) {
      return;
    }
    const filterType = this.#filterModel.getActiveFilter();
    this.#emptyComponent = new EmptyPointsView(filterType);
    render(this.#emptyComponent, this.#pointListComponent.element);
  }

  #renderSorting() {
    this.#sortingView = new SortingView(this.#currentSortType);
    this.#sortingView.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortingView, document.querySelector('.trip-events'), RenderPosition.AFTERBEGIN);
  }

  #handleSortTypeChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearPointList();
    remove(this.#sortingView);
    this.#renderSorting();
    this.#renderPoints();
  };

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters = new Map();
    remove(this.#emptyComponent);
    this.#emptyComponent = null;
  }

  #getSortedPoints(points) {
    const sorted = [...points];
    switch (this.#currentSortType) {
      case SortType.DAY:
        return sorted.sort((a, b) => new Date(a?.dateFrom || 0) - new Date(b?.dateFrom || 0));
      case SortType.TIME:
        return sorted.sort((a, b) =>
          ((new Date(b?.dateTo || 0) - new Date(b?.dateFrom || 0))) -
          ((new Date(a?.dateTo || 0) - new Date(a?.dateFrom || 0)))
        );
      case SortType.PRICE:
        return sorted.sort((a, b) => b.basePrice - a.basePrice);
      default:
        return sorted;
    }
  }

  createPoint() {
    if (this.#addNewPointPresenter !== null) {
      return;
    }

    this.#onNewPointFormOpen();

    this.#currentSortType = SortType.DAY;
    this.#handleModeChange();
    this.#filterModel.setActiveFilter(FilterType.EVERYTHING);
    remove(this.#emptyComponent);
    this.#emptyComponent = null;

    this.#addNewPointPresenter = new AddPointPresenter({
      container: this.#pointListComponent.element,
      model: this.#model,
      onDataChange: this.#handlePointChange,
      onClose: this.#destroyNewPoint
    });

    this.#addNewPointPresenter.init();
  }

  #destroyNewPoint = () => {
    this.#addNewPointPresenter?.destroy();
    this.#addNewPointPresenter = null;
    this.#onNewPointFormClose();

    if (this.#getFilteredPoints().length === 0) {
      this.#renderEmptyPoints();
    }
  };

  #renderPoints() {
    const filteredPoints = this.#getFilteredPoints();
    const points = this.#getSortedPoints(filteredPoints);
    if (points.length === 0) {
      this.#renderEmptyPoints();
      return;
    }

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

  #handlePointChange = async (actionType, updateType, data) => {
    const presenter = this.#pointPresenters.get(data.id);
    this.#uiBlocker.block();
    try {
      switch (actionType) {
        case UserAction.UPDATE_POINT:
          presenter.setSaving();
          try {
            const updatedPoint = await this.#model.updatePoint(data);
            this.#rerenderPoint(updatedPoint.id);
          } catch(err) {
            presenter.setAborting();
          }
          break;
        case UserAction.DELETE_POINT:
          presenter.setDeleting();
          try {
            await this.#model.deletePoint(data);
            this.#pointPresenters.get(data.id)?.destroy();
            this.#pointPresenters.delete(data.id);
          } catch(err) {
            presenter.setAborting();
          }
          break;
        case UserAction.ADD_POINT:
          this.#addNewPointPresenter.setSaving();
          try {
            await this.#model.createPoint(data);
            this.#addNewPointPresenter.destroy();
            this.#addNewPointPresenter = null;
            this.#clearPointList();
            this.#renderPoints();
          } catch(err) {
            this.#addNewPointPresenter.setAborting();
          }
          break;
      }
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #rerenderPoint(id) {
    const presenter = this.#pointPresenters.get(id);
    const point = this.#model.getPointById(id);
    presenter.resetView();
    presenter.init(this.#pointListComponent, point);
  }

  #handleModeChange = (currentPresenter) => {
    this.#pointPresenters.forEach((presenter) => {
      if (presenter !== currentPresenter) {
        presenter.resetView();
      }
    });

    if (this.#addNewPointPresenter !== null) {
      this.#destroyNewPoint();
    }
  };

  #getFilteredPoints() {
    const points = this.#model.getPoints();
    const filterType = this.#filterModel.getActiveFilter();
    return getFilteredPoints(points, filterType);
  }

  #handleModelChange = () => {
    this.#currentSortType = SortType.DAY;
    this.#clearPointList();
    remove(this.#sortingView);
    this.#sortingView = null;

    if (this.#model.getPoints().length === 0) {
      this.#renderEmptyPoints();
      return;
    }

    this.#renderSorting();
    this.#renderPoints();
  };

  resetSort() {
    this.#currentSortType = SortType.DAY;
    remove(this.#sortingView);
    this.#renderSorting();
    this.#renderPoints();
  }

  destroyAllOpenForms() {
    this.#pointPresenters.forEach((presenter) => {
      presenter.resetView();
    });
  }

  getContainer() {
    return this.#pointListComponent.element;
  }

  handleModelAction(actionType, data) {
    this.#handlePointChange(actionType, null, data);
  }
}
