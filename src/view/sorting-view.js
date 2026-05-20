import AbstractView from '../framework/view/abstract-view.js';

export const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFER: 'offer'
};

function createSortingTemplate() {
  return `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <div class="trip-sort__item  trip-sort__item--day">
        <input 
          id="sort-day" 
          class="trip-sort__input  visually-hidden" 
          type="radio" 
          name="trip-sort" 
          value="${SortType.DAY}" 
          checked
          data-sort-type="${SortType.DAY}"
        >
        <label class="trip-sort__btn" for="sort-day">Day</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--event">
        <input 
          id="sort-event" 
          class="trip-sort__input  visually-hidden" 
          type="radio" 
          name="trip-sort" 
          value="${SortType.EVENT}" 
          disabled
          data-sort-type="${SortType.EVENT}"
        >
        <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input 
          id="sort-time" 
          class="trip-sort__input  visually-hidden" 
          type="radio" 
          name="trip-sort" 
          value="${SortType.TIME}" 
          data-sort-type="${SortType.TIME}"
        >
        <label class="trip-sort__btn" for="sort-time">Time</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input 
          id="sort-price" 
          class="trip-sort__input  visually-hidden" 
          type="radio" 
          name="trip-sort" 
          value="${SortType.PRICE}" 
          data-sort-type="${SortType.PRICE}"
        >
        <label class="trip-sort__btn" for="sort-price">Price</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--offer">
        <input 
          id="sort-offer" 
          class="trip-sort__input  visually-hidden" 
          type="radio" 
          name="trip-sort" 
          value="${SortType.OFFER}" 
          disabled
          data-sort-type="${SortType.OFFER}"
        >
        <label class="trip-sort__btn" for="sort-offer">Offers</label>
      </div>
    </form>
  `;
}

export default class SortingView extends AbstractView {
  #currentSortType = SortType.DAY;
  #handleSortTypeChange = null;

  constructor() {
    super();
  }

  get template() {
    return createSortingTemplate();
  }

  setSortTypeChangeHandler(callback) {
    this.#handleSortTypeChange = callback;
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  #sortTypeChangeHandler = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    const sortType = evt.target.dataset.sortType;

    if (sortType === this.#currentSortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#handleSortTypeChange?.(sortType);
  };
}
