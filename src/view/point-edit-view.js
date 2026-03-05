export default class PointEditView {
  constructor(point = null, destinations, offersByType, allOffers, isNew = false) {
    this.point = point;
    this.destinations = destinations;
    this.offersByType = offersByType;
    this.allOffers = allOffers; 
    this.isNew = isNew;
    this.element = null;
  }

  getTemplate() {
    if (this.isNew || !this.point) {
      return this.getEmptyTemplate();
    }

    const { point, destinations, allOffers } = this;
    
    const destination = destinations.find(d => d.id === point.destinationId) || 
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
          ${availableOffers.map(offer => `
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

    const destinationsOptions = destinations.map(dest => 
      `<option value="${dest.name}"></option>`
    ).join('');

    const photosHtml = destination.pictures && destination.pictures.length > 0 ? `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${destination.pictures.map(pic => `
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
                ${this.destinations.map(dest => `<option value="${dest.name}"></option>`).join('')}
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

  getElement() {
    if (!this.element) {
      const template = document.createElement('template');
      template.innerHTML = this.getTemplate().trim();
      this.element = template.content.firstElementChild;
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
