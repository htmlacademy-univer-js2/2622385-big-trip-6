import AbstractStatefulView from '../framework/view/abstract-stateful-view';

export default class PointEditView extends AbstractStatefulView{
  constructor(point = null, destinations, offersByType, allOffers, isNew = false) {
    super();
    this.point = point;
    this.destinations = destinations;
    this.offersByType = offersByType;
    this.allOffers = allOffers;
    this.isNew = isNew;

    this._onFormSubmit = null;
    this._onCancelClick = null;
    this._onCloseClick = null;
  }

  get template() {
    if (this.isNew || !this.point) {
      return this.getEmptyTemplate();
    }

    const { point, destinations } = this;
    const destination = destinations.find((d) => d.id === point.destinationId) ||
                       { id: '', name: '', description: '', pictures: [] };
    const availableOffers = this.offersByType(point.type);
    const dateFrom = new Date(point.dateFrom);
    const dateTo = new Date(point.dateTo);
    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString().slice(-2);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const offersHtml = availableOffers.length > 0 ? `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${availableOffers.map((offer) => `
            <div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" 
                     id="event-offer-${offer.id}" 
                     type="checkbox" 
                     name="event-offer-${offer.id}"
                     ${point.offerIds.includes(offer.id) ? 'checked' : ''}>
              <label class="event__offer-label" for="event-offer-${offer.id}">
                <span class="event__offer-title">${offer.title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${offer.price}</span>
              </label>
            </div>
          `).join('')}
        </div>
      </section>
    ` : '';

    const destinationsOptions = destinations.map((dest) =>
      `<option value="${dest.name}"></option>`
    ).join('');

    const photosHtml = destination.pictures && destination.pictures.length > 0 ? `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${destination.pictures.map((pic) => `
            <img class="event__photo" src="${pic.src}" alt="${pic.description || 'Event photo'}">
          `).join('')}
        </div>
      </div>
    ` : '';

    return `
      <li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-1">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            </div>

            <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-1">
                ${point.type}
              </label>
              <input class="event__input  event__input--destination" 
                     id="event-destination-1" 
                     type="text" 
                     name="event-destination" 
                     value="${destination.name}" 
                     list="destination-list-1"
                     placeholder="Enter destination">
              <datalist id="destination-list-1">
                ${destinationsOptions}
              </datalist>
            </div>

            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input class="event__input  event__input--time" 
                     id="event-start-time-1" 
                     type="text" 
                     name="event-start-time" 
                     value="${formatDate(dateFrom)}">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input  event__input--time" 
                     id="event-end-time-1" 
                     type="text" 
                     name="event-end-time" 
                     value="${formatDate(dateTo)}">
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                €
              </label>
              <input class="event__input  event__input--price" 
                     id="event-price-1" 
                     type="text" 
                     name="event-price" 
                     value="${point.basePrice}">
            </div>

            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">
              ${this.isNew ? 'Cancel' : 'Delete'}
            </button>
            
            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Close event</span>
            </button>
          </header>

          <section class="event__details">
            ${offersHtml}
            
            <section class="event__section  event__section--destination">
              <h3 class="event__section-title  event__section-title--destination">Destination</h3>
              <p class="event__destination-description">${destination.description || ''}</p>
              ${photosHtml}
            </section>
          </section>
        </form>
      </li>
    `;
  }

  getEmptyTemplate() {
    const destinationsOptions = this.destinations.map((dest) =>
      `<option value="${dest.name}"></option>`
    ).join('');

    return `
      <li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-1">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/flight.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
            </div>

            <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-1">
                Flight
              </label>
              <input class="event__input  event__input--destination" 
                     id="event-destination-1" 
                     type="text" 
                     name="event-destination" 
                     value="" 
                     list="destination-list-1"
                     placeholder="Enter destination">
              <datalist id="destination-list-1">
                ${destinationsOptions}
              </datalist>
            </div>

            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input class="event__input  event__input--time" 
                     id="event-start-time-1" 
                     type="text" 
                     name="event-start-time" 
                     value=""
                     placeholder="Start date">
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input  event__input--time" 
                     id="event-end-time-1" 
                     type="text" 
                     name="event-end-time" 
                     value=""
                     placeholder="End date">
            </div>

            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-1">
                <span class="visually-hidden">Price</span>
                €
              </label>
              <input class="event__input  event__input--price" 
                     id="event-price-1" 
                     type="text" 
                     name="event-price" 
                     value=""
                     placeholder="0">
            </div>

            <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
            <button class="event__reset-btn" type="reset">Cancel</button>

            <button class="event__rollup-btn" type="button">
              <span class="visually-hidden">Close event</span>
            </button> 
          </header>
          <section class="event__details">
            <section class="event__section  event__section--offers">
              <h3 class="event__section-title  event__section-title--offers">Offers</h3>
              <div class="event__available-offers">
                <p class="event__destination-description">Choose event type to see offers</p>
              </div>
            </section>
          </section>
        </form>
      </li>
    `;
  }

  setFormSubmitHandler(callback) {
    this._onFormSubmit = callback;
    const form = this.element.querySelector('form');
    if (form) {
      form.removeEventListener('submit', this._onFormSubmit);
      form.addEventListener('submit', this._onFormSubmit);
    }
  }

  setCancelClickHandler(callback) {
    this._onCancelClick = callback;
    const cancelButton = this.element.querySelector('.event__reset-btn');
    if (cancelButton) {
      cancelButton.removeEventListener('click', this._onCancelClick);
      cancelButton.addEventListener('click', this._onCancelClick);
    }
  }

  setCloseClickHandler(callback) {
    this._onCloseClick = callback;
    const closeButton = this.element.querySelector('.event__rollup-btn');
    if (closeButton) {
      closeButton.removeEventListener('click', this._onCloseClick);
      closeButton.addEventListener('click', this._onCloseClick);
    }
  }

  setFavoriteClickHandler(callback) {
    this.element
      .querySelector('.event__favorite-btn')
      .addEventListener('click', callback);
  }

  getFormData() {
    const form = this.element.querySelector('form');
    const formData = new FormData(form);
    const destinationName = formData.get('event-destination');
    const destination = this.destinations.find((d) => d.name === destinationName);
    const parseDateTime = (dateTimeStr) => {
      if (!dateTimeStr) {
        return null;
      }
      const [datePart, timePart] = dateTimeStr.split(' ');
      const [day, month, year] = datePart.split('/');
      const [hours, minutes] = timePart.split(':');
      const fullYear = 2000 + parseInt(year, 10);
      return new Date(fullYear, parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hours, 10), parseInt(minutes, 10)).toISOString();
    };
    return {
      type: this.point?.type || 'flight',
      destinationId: destination ? destination.id : (this.point?.destinationId || ''),
      basePrice: parseInt(formData.get('event-price'), 10),
      dateFrom: parseDateTime(formData.get('event-start-time')),
      dateTo: parseDateTime(formData.get('event-end-time')),
      offerIds: Array.from(form.querySelectorAll('.event__offer-checkbox:checked'))
        .map((checkbox) => checkbox.id.replace('event-offer-', ''))
    };
  }

  showError() {
    this.shake();
  }

  _restoreHandlers() {
    this.setFormSubmitHandler(this._onFormSubmit);
    this.setCancelClickHandler(this._onCancelClick);
    this.setCloseClickHandler(this._onCloseClick);
  }
}
