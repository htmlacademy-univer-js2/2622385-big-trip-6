import { RoutePresenter } from './route-presenter.js';
import FilterPresenter from './filter-presenter.js';
import TripInfoPresenter from './trip-info-presenter.js';

export default class TripPresenter {
  #addPointButton = document.querySelector('.trip-main__event-add-btn');
  #routePresenter;
  #container = null;
  #filtersContainer = null;
  #model = null;
  #filterModel = null;
  #filterPresenter = null;
  #tripInfoPresenter = null;

  constructor(model, filterModel) {
    this.#filterModel = filterModel;
    this.#model = model;

    this.#routePresenter = new RoutePresenter({
      model,
      filterModel: this.#filterModel,

      onNewPointFormOpen: this.#disableAddPointButton,
      onNewPointFormClose: this.#enableAddPointButton,
    });

    this.#tripInfoPresenter = new TripInfoPresenter({
      container: document.querySelector('.trip-main'),
      model: this.#model
    });
  }

  init() {
    this.#container = document.querySelector('.trip-events');
    this.#filtersContainer = document.querySelector('.trip-controls__filters');
    this.#addPointButton.addEventListener('click', this.#handleNewPointClick);

    if (!this.#container) {
      return;
    }

    this.#filterPresenter = new FilterPresenter({
      container: this.#filtersContainer,
      filterModel: this.#filterModel,
      model: this.#model,
    });

    this.#routePresenter.init();
    this.#filterPresenter.init();
  }

  renderBoard() {
    if (this.#model.getPoints().length > 0) {
      this.#tripInfoPresenter.init();
    }

    this.#routePresenter.renderBoard();
  }

  #handleNewPointClick = () => {
    this.#routePresenter.createPoint();
  };

  #disableAddPointButton = () => {
    if (this.#addPointButton) {
      this.#addPointButton.disabled = true;
    }
  };

  #enableAddPointButton = () => {
    if (this.#addPointButton) {
      this.#addPointButton.disabled = false;
    }
  };
}
