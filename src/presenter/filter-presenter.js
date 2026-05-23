import FiltersView from '../view/filters-view.js';
import { render } from '../framework/render.js';

export default class FilterPresenter {
  #container;
  #filterModel;
  #filters;
  #view = null;

  constructor({container, filterModel, filters}) {
    this.#container = container;
    this.#filterModel = filterModel;
    this.#filters = filters;
  }

  init() {
    this.#view = new FiltersView(this.#filters, this.#handleFilterChange);

    render(this.#view, this.#container);
  }

  #handleFilterChange = (filterType) => {
    this.#filterModel.setActiveFilter(filterType);
  };
}
