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

  constructor({model, filterModel}) {
    this.#model = model;
    this.#filterModel = filterModel;
  }

  init() {
    render(
      this.#pointListComponent,
      document.querySelector('.trip-events')
    );

    render(
      this.#loadingComponent,
      this.#pointListComponent.element
    );
  }

  renderBoard() {
    remove(this.#loadingComponent);

    if (this.#model.getPoints().length === 0) {
      this.#renderEmptyPoints();
      return;
    }

    this.#filterModel.addObserver(
      this.#handleModelChange
    );

    this.#renderSorting();
    this.#renderPoints();
  }

  #renderEmptyPoints() {
    this.#emptyComponent = new EmptyPointsView();
    render(this.#emptyComponent, this.#pointListComponent.element);
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
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        await this.#model.updatePoint(data);
        this.#rerenderPoint(data.id);
        break;

      case UserAction.DELETE_POINT:
        this.#model.deletePoint(data.id);
        this.#pointPresenters.get(data.id)?.destroy();
        this.#pointPresenters.delete(data.id);

        if (this.#model.getPoints().length === 0) {
          this.#renderEmptyPoints();
        }
        break;

      case UserAction.ADD_POINT:
        this.#model.createPoint(data);
        this.#clearPointList();
        this.#renderPoints();
        this.#addNewPointPresenter?.destroy();
        this.#addNewPointPresenter = null;
        break;
    }
  };

  #rerenderPoint(id) {
    const presenter = this.#pointPresenters.get(id);
    const point = this.#model.getPointById(id);

    presenter?.init(this.#pointListComponent, point);
  }

  #handleModeChange = (currentPresenter) => {
    this.#pointPresenters.forEach((presenter) => {
      if (presenter !== currentPresenter) {
        presenter.resetView();
      }
    });
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

    this.#renderSorting();
    this.#renderPoints();
  };

  startAddPoint(addPointPresenter) {
    this.#addNewPointPresenter = addPointPresenter;
  }

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
