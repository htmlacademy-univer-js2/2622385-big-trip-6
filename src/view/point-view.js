import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import dayjs from 'dayjs';
import {encode} from '../utils.js';

const MINUTES_IN_HOUR = 60;
const MINUTES_IN_DAY = 24 * MINUTES_IN_HOUR;

function formatDuration(start, end) {
  const durationMinutes = dayjs(end).diff(dayjs(start), 'minute');
  if (durationMinutes < MINUTES_IN_HOUR) {
    return `${durationMinutes}M`;
  }
  const days = Math.floor(durationMinutes / MINUTES_IN_DAY);
  const hours = Math.floor((durationMinutes % MINUTES_IN_DAY) / MINUTES_IN_HOUR);
  const minutes = durationMinutes % MINUTES_IN_HOUR;

  if (durationMinutes < MINUTES_IN_DAY) {
    return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }

  return `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
}

export default class PointView extends AbstractStatefulView {
  _destination = null;
  _offers = null;
  _onEditClick = null;
  _onFavoriteClick = null;

  constructor(point, destination, offers) {
    super();
    this._destination = destination;
    this._offers = offers;
    this._setState({
      point,
      isFavorite: point.isFavorite
    });
  }

  get template() {
    return this._getTemplate();
  }

  getPoint() {
    return this._state.point;
  }

  updateData(point, destination, offers) {
    this._destination = destination;
    this._offers = offers;
    this.updateElement({
      point,
      isFavorite: point.isFavorite
    });
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

  _getTemplate() {
    const { point } = this._state;
    const { _destination: destination, _offers: offers } = this;
    const dateFrom = point.dateFrom ? new Date(point.dateFrom) : null;
    const dateTo = point.dateTo ? new Date(point.dateTo) : null;

    if (!dateFrom || !dateTo) {
      return '';
    }

    const month = dateFrom.toLocaleString('en', { month: 'short' }).toUpperCase();
    const day = dateFrom.getDate().toString().padStart(2, '0');
    const offersHtml = offers.length > 0 ? `
      <ul class="event__selected-offers">
        ${offers.map((offer) => `
          <li class="event__offer">
            <span class="event__offer-title">${encode(offer.title)}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${offer.price}</span>
          </li>
        `).join('')}
      </ul>
    ` : '';

    const favoriteClass = this._state.isFavorite ? 'event__favorite-btn--active' : '';
    const duration = formatDuration(dateFrom, dateTo);

    return `
      <li class="trip-events__item">
        <div class="event">
          <time class="event__date" datetime="${dateFrom.toISOString().split('T')[0]}">${month} ${day}</time>
          <div class="event__type">
            <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
          </div>
          <h3 class="event__title">${encode(point.type)} ${encode(destination?.name ?? '')}</h3>
          <div class="event__schedule">
            <p class="event__time">
              <time class="event__start-time" datetime="${dayjs(dateFrom).toISOString()}">${dayjs(dateFrom).format('HH:mm')}</time>
              &mdash;
              <time class="event__end-time" datetime="${dayjs(dateTo).toISOString()}">${dayjs(dateTo).format('HH:mm')}</time>
            </p>
            <p class="event__duration">${duration}</p>
          </div>  
          <p class="event__price">
            &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
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
}
