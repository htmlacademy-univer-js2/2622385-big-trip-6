import FiltersView from '../view/filters-view.js';
import { generateFilters } from '../utils.js';
import InfoView from '../view/info-view.js';
import { render, RenderPosition } from '../framework/render.js';
import { RoutePresenter } from './route-presenter.js';
import FilterPresenter from './filter-presenter.js';

export default class TripPresenter {
  #addPointButton = document.querySelector('.trip-main__event-add-btn');
  #routePresenter;
  #container = null;
  #filtersContainer = null;
  #model = null;
  #filterModel = null;
  #filterPresenter = null;

  constructor(model, filterModel) {
    this.#filterModel = filterModel;
    this.#model = model;

    this.#routePresenter = new RoutePresenter({
      model,
      filterModel: this.#filterModel
    });
  }

  init() {
    this.#container = document.querySelector('.trip-events');
    this.#filtersContainer = document.querySelector('.trip-controls__filters');
    this.#addPointButton.addEventListener('click', this.#handleNewPointClick);

    if (this.#model.getPoints().length > 0) {
      this.#renderInfo();
    }

    if (!this.#container) {
      return;
    }

    this.#filterPresenter = new FilterPresenter({
      container: this.#filtersContainer,
      filterModel: this.#filterModel,
      filters: generateFilters(this.#model.getPoints()),
    });

    this.#routePresenter.init();
    this.#filterPresenter.init();
  }

  #renderInfo() {
    const infoView = new InfoView(
      'Amsterdam &mdash; Chamonix &mdash; Geneva',
      '18&nbsp;&mdash;&nbsp;20 Mar',
      12300,
    );

    render(
      infoView,
      document.querySelector('.trip-main'),
      RenderPosition.AFTERBEGIN,
    );
  }

  #renderFilters() {
    if (this.#filtersContainer) {
      const points = this.#model.getPoints();
      const filters = generateFilters(points);
      const filtersView = new FiltersView(filters);

      render(filtersView, document.querySelector('.trip-controls__filters'));
    }
  }

  #handleNewPointClick = () => {
    this.#routePresenter.createPoint();
  };
}
