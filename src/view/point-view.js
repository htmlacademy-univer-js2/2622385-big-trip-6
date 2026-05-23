import AbstractStatefulView from '../framework/view/abstract-stateful-view';

export default class PointView extends AbstractStatefulView {
  constructor(point, destination, offers) {
    super();
    this._destination = destination;
    this._offers = offers;
    this._setState({
      point: point,
      isFavorite: point.isFavorite
    });
  }

  get template() {
    return this._getTemplate();
  }

  _getTemplate() {
    const { point } = this._state;
    const { _destination: destination, _offers: offers } = this;
    const dateFrom = point.dateFrom
      ? new Date(point.dateFrom)
      : null;
    const dateTo = point.dateTo
      ? new Date(point.dateTo)
      : null;
    if (!dateFrom || !dateTo) {
      return '';
    }
    const month = dateFrom.toLocaleString('en', { month: 'short' }).toUpperCase();
    const day = dateFrom.getDate().toString().padStart(2, '0');
    const startTime = dateFrom.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
    const endTime = dateTo.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });

    const offersHtml = offers.length > 0 ? `
      <ul class="event__selected-offers">
        ${offers.map((offer) => `
          <li class="event__offer">
            <span class="event__offer-title">${offer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </li>
        `).join('')}
      </ul>
    ` : '';

    const favoriteClass = this._state.isFavorite ? 'event__favorite-btn--active' : '';

    return `
      <li class="trip-events__item">
        <div class="event">
          <time class="event__date" datetime="${dateFrom.toISOString().split('T')[0]}">${month} ${day}</time>
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${point.type} ${destination?.name ?? ''}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${dateFrom.toISOString()}">${startTime}</time>
              &mdash;
              <time class="event__end-time" datetime="${dateTo.toISOString()}">${endTime}</time>
            </p>
          </div>  
          <p class="event__price">
            €&nbsp;<span class="event__price-value">${point.basePrice}</span>
          </p>
          ${offersHtml}
          <button class="event__favorite-btn ${favoriteClass}" type="button">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.228 4.326 1.571-9.162L0 9.673l9.192-1.336L14 0l4.808 8.337L28 9.673l-7.343 7.161 1.571 9.162z"/>
            </svg>
          </button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </div>
      </li>
    `;
  }

  updateData(point, destination, offers) {
    this._destination = destination;
    this._offers = offers;
    this.updateElement({
      point: point,
      isFavorite: point.isFavorite
    });
  }

  _restoreHandlers() {
    if (!this.element) {
      return;
    }

    if (this._onEditClick) {
      const editButton = this.element.querySelector('.event__rollup-btn');
      if (editButton) {
        editButton.addEventListener('click', this._onEditClick);
      }
    }
    if (this._onFavoriteClick) {
      const favoriteButton = this.element.querySelector('.event__favorite-btn');
      if (favoriteButton) {
        favoriteButton.addEventListener('click', this._onFavoriteClick);
      }
    }
  }

  setEditClickHandler(callback) {
    this._onEditClick = callback;
    const editButton = this.element.querySelector('.event__rollup-btn');
    if (editButton) {
      editButton.addEventListener('click', this._onEditClick);
    }
  }

  setFavoriteClickHandler(callback) {
    this._onFavoriteClick = callback;
    const favoriteButton = this.element.querySelector('.event__favorite-btn');
    if (favoriteButton) {
      favoriteButton.addEventListener('click', this._onFavoriteClick);
    }
  }

  getPoint() {
    return this._state.point;
  }
}
