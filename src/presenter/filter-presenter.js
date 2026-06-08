import FiltersView from '../view/filters-view.js';
import { generateFilters } from '../utils.js';
import { render, replace, remove } from '../framework/render.js';

export default class FilterPresenter {
  #container = null;
  #filtersComponent = null;
  #filterModel = null;
  #model = null;

  constructor({ container, filterModel, model }) {
    this.#container = container;
    this.#filterModel = filterModel;
    this.#model = model;
  }

  init() {
    this.#model.addObserver(this.#handleModelChange);
    this.#filterModel.addObserver(this.#handleFilterModelChange);
    this.#renderFilters();
  }

  #handleFilterTypeChange = (filterType) => {
    this.#filterModel.setActiveFilter(filterType);
  };

  #renderFilters() {
    const filters = generateFilters(
      this.#model.getPoints(),
      this.#filterModel.getActiveFilter()
    );
    this.#filtersComponent = new FiltersView(filters);
    this.#filtersComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    render(this.#filtersComponent, this.#container);
  }

  #updateFiltersView() {
    const prevComponent = this.#filtersComponent;

    const filters = generateFilters(
      this.#model.getPoints(),
      this.#filterModel.getActiveFilter()
    );

    this.#filtersComponent = new FiltersView(filters);
    this.#filtersComponent.setFilterTypeChangeHandler(this.#handleFilterTypeChange);

    replace(this.#filtersComponent, prevComponent);
    remove(prevComponent);
  }

  #handleModelChange = () => {
    this.#updateFiltersView();
  };

  #handleFilterModelChange = () => {
    this.#updateFiltersView();
  };
}
