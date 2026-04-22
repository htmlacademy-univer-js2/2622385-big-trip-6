import AbstractView from '../framework/view/abstract-view';

export default class EmptyPointsView extends AbstractView {
  constructor(message = 'Click New Event to create your first point') {
    super();
    this._message = message;
  }

  get template() {
    return `
      <p class="trip-events__msg">${this._message}</p>
    `;
  }
}
