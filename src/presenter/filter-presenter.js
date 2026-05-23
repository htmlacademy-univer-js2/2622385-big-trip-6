import FiltersView from '../view/filters-view.js';
import { render } from '../framework/render.js';

export default class FilterPresenter {
  #container = null;
  #filtersComponent = null;
  #filterModel = null;
  #filters = [];

  constructor({ container, filterModel, filters }) {
    this.#container = container;
    this.#filterModel = filterModel;
    this.#filters = filters;
  }

  init() {
    this.#filtersComponent = new FiltersView(this.#filters);

    this.#filtersComponent.setFilterTypeChangeHandler(
      this.#handleFilterTypeChange
    );

    render(this.#filtersComponent, this.#container);
  }

  #handleFilterTypeChange = (filterType) => {
    this.#filterModel.setActiveFilter(filterType);
  };
}
