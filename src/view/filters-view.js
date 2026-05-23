import AbstractView from '../framework/view/abstract-view';

function createFilterItemTemplate(filter) {
  return `
    <div class="trip-filters__filter">
      <input
        id="filter-${filter.type}"
        class="trip-filters__filter-input visually-hidden"
        type="radio"
        name="trip-filter"
        value="${filter.type}"
        ${filter.disabled ? 'disabled' : ''}
      >

      <label
        class="trip-filters__filter-label"
        for="filter-${filter.type}"
      >
        ${filter.name}
      </label>
    </div>
  `;
}

function createFiltersTemplate(filters) {
  return `
    <form class="trip-filters" action="#" method="get">
      ${filters.map(createFilterItemTemplate).join('')}

      <button class="visually-hidden" type="submit">
        Accept filter
      </button>
    </form>
  `;
}

export default class FiltersView extends AbstractView {
  #filterTypeChangeHandler;

  constructor(filters, filterTypeChangeHandler = () => {}) {
    super();
    this._filters = filters;
    this.#filterTypeChangeHandler = filterTypeChangeHandler;
  }

  get template() {
    return createFiltersTemplate(this._filters);
  }
}
