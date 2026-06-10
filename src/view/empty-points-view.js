import AbstractView from '../framework/view/abstract-view.js';
import { FilterType } from '../model/const.js';

const EmptyMessageText = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

function createTemplate(filterType) {
  return `<p class="trip-events__msg">${EmptyMessageText[filterType]}</p>`;
}

export default class EmptyPointsView extends AbstractView {
  #filterType = null;

  constructor(filterType = FilterType.EVERYTHING) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createTemplate(this.#filterType);
  }
}
