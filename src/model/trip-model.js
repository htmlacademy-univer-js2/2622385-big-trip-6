import Observable from '../framework/observable.js';
import PointAdapter from '../adapter/point-adapter.js';

export default class TripModel extends Observable {
  #api = null;
  #destinations = [];
  #offers = [];
  #points = [];
  #errorObservers = [];

  constructor({ api }) {
    super();
    this.#api = api;
  }

  setErrorObserver(observer) {
    this.#errorObservers.push(observer);
  }

  async init() {
    try {
      this.#points = await this.#api.points;
      this.#destinations = await this.#api.destinations;
      this.#offers = await this.#api.offers;
    } catch (err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
      this.#notifyErrorObservers();
      return;
    }

    this._notify();
  }

  getPoints() {
    return this.#points;
  }

  getPointById(id) {
    return this.#points.find((point) => point.id === id) ?? null;
  }

  getDestinations() {
    return this.#destinations;
  }

  getDestinationById(id) {
    return this.#destinations.find(
      (destination) => destination.id === id
    );
  }

  getOffersByType(type) {
    return this.#offers.find(
      (offer) => offer.type === type
    )?.offers ?? [];
  }

  getOffersByIds(offerIds = []) {
    return this.#offers
      .flatMap((offerGroup) => offerGroup.offers)
      .filter((offer) => offerIds.includes(offer.id));
  }

  async updatePoint(update) {
    const updatedPoint = await this.#api.updatePoint(update);
    this.#points = this.#points.map((point) =>
      point.id === updatedPoint.id ? updatedPoint : point
    );
    this._notify();
    return updatedPoint;
  }

  async createPoint(point) {
    const response = await this.#api.addPoint(PointAdapter.adaptToServer(point));
    const newPoint = PointAdapter.adaptToClient(response);
    this.#points.push(newPoint);
    this._notify();
    return newPoint;
  }

  async deletePoint(point) {
    await this.#api.deletePoint(point);
    this.#points = this.#points.filter((p) => p.id !== point.id);
    this._notify();
  }

  #notifyErrorObservers() {
    this.#errorObservers.forEach((observer) => observer());
  }
}
