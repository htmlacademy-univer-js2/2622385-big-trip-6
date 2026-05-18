import { FilterType } from './const.js';

export default class FilterModel {
  constructor() {
    this._activeFilter = FilterType.EVERYTHING;
    this._observers = [];
  }

  getActiveFilter() {
    return this._activeFilter;
  }

  setActiveFilter(filter) {
    if (this._activeFilter !== filter) {
      this._activeFilter = filter;
      this._notifyObservers();
    }
  }

  addObserver(observer) {
    this._observers.push(observer);
  }

  removeObserver(observer) {
    this._observers = this._observers.filter((obs) => obs !== observer);
  }

  _notifyObservers() {
    this._observers.forEach((observer) => observer());
  }
}
