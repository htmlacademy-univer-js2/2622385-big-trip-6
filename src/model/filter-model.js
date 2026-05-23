import Observable from '../framework/observable.js';
import { FilterType } from './const.js';

export default class FilterModel extends Observable {
  #activeFilter = FilterType.EVERYTHING;

  getActiveFilter() {
    return this.#activeFilter;
  }

  setActiveFilter(filterType) {
    if (this.#activeFilter === filterType) {
      return;
    }

    this.#activeFilter = filterType;

    this._notify();
  }
}
