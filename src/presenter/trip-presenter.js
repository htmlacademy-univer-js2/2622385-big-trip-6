import RoutePresenter from './route-presenter.js';
import FilterPresenter from './filter-presenter.js';
import TripInfoPresenter from './trip-info-presenter.js';

export default class TripPresenter {
  #addPointButton = null;
  #routePresenter = null;
  #model = null;
  #filterModel = null;
  #filterPresenter = null;
  #tripInfoPresenter = null;

  constructor(model, filterModel) {
    this.#model = model;
    this.#filterModel = filterModel;

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
    const container = document.querySelector('.trip-events');
    const filtersContainer = document.querySelector('.trip-controls__filters');
    this.#addPointButton = document.querySelector('.trip-main__event-add-btn');

    if (!container) {
      return;
    }

    this.#addPointButton.addEventListener('click', this.#handleNewPointClick);

    this.#filterPresenter = new FilterPresenter({
      container: filtersContainer,
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
