import FiltersView from '../view/filters-view.js';
import { generateFilters } from '../utils.js';
import InfoView from '../view/info-view.js';

import { render, RenderPosition } from '../framework/render.js';
import { RoutePresenter } from './route-presenter.js';

export default class TripPresenter {
  #routePresenter;
  #container = null;
  #filtersContainer = null;
  #model = null;

  constructor(model) {
    this.#model = model;

    this.#routePresenter = new RoutePresenter({
      model,
    });
  }

  init() {
    this.#container = document.querySelector('.trip-events');
    this.#filtersContainer = document.querySelector('.trip-controls__filters');

    if (this.#model.getPoints().length > 0) {
      this.#renderInfo();
    }

    if (!this.#container) {
      return;
    }

    this.#renderFilters();
    this.#routePresenter.init();
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
}
