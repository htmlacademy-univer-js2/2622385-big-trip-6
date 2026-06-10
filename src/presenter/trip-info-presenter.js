import InfoView from '../view/info-view.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';
import dayjs from 'dayjs';
import { encode } from '../utils.js';

const MAX_CITIES_IN_TITLE = 3;

export default class TripInfoPresenter {
  #container = null;
  #model = null;
  #infoComponent = null;

  constructor({ container, model }) {
    this.#container = container;
    this.#model = model;
    this.#model.addObserver(this.#handleModelChange);
  }

  init() {
    this.#renderInfo();
  }

  #handleModelChange = () => {
    const points = this.#model.getPoints();
    if (!points.length) {
      remove(this.#infoComponent);
      this.#infoComponent = null;
      return;
    }
    this.#renderInfo();
  };

  #renderInfo() {
    const prevComponent = this.#infoComponent;
    this.#infoComponent = new InfoView(
      this.#getRouteTitle(),
      this.#getTripDates(),
      this.#getTotalPrice()
    );

    if (!prevComponent) {
      render(this.#infoComponent, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#infoComponent, prevComponent);
    remove(prevComponent);
  }

  #getSortedPoints() {
    return [...this.#model.getPoints()].sort((a, b) => a.dateFrom - b.dateFrom);
  }

  #getRouteTitle() {
    const points = this.#getSortedPoints();
    const cities = points
      .map((point) => this.#model.getDestinationById(point.destinationId)?.name)
      .filter(Boolean);

    if (cities.length <= MAX_CITIES_IN_TITLE) {
      return cities.map((city) => encode(city)).join(' &mdash; ');
    }

    return `${encode(cities[0])} &mdash; ... &mdash; ${encode(cities[cities.length - 1])}`;
  }

  #getTripDates() {
    const points = this.#getSortedPoints();
    if (!points.length) {
      return '';
    }

    const start = points[0].dateFrom;
    const end = points.at(-1).dateTo;

    return `${dayjs(start).format('DD MMM')} — ${dayjs(end).format('DD MMM')}`;
  }

  #getTotalPrice() {
    return this.#model.getPoints().reduce(
      (sum, point) => sum + this.#getPointPrice(point),
      0
    );
  }

  #getPointPrice(point) {
    const offers = this.#model.getOffersByType(point.type);
    const selectedOffers = offers.filter((offer) => point.offerIds.includes(offer.id));
    const offersPrice = selectedOffers.reduce((sum, offer) => sum + offer.price, 0);

    return point.basePrice + offersPrice;
  }
}
