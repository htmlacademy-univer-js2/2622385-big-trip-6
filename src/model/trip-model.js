import Observable from '../framework/observable.js';

export default class TripModel extends Observable {
  #api = null;

  #destinations = [];
  #offers = [];
  #points = [];

  constructor({api}) {
    super();
    this.#api = api;
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
    }

    this._notify();
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

  getPoints() {
    return this.#points;
  }

  getPointById(id) {
    return this.#points.find((point) => point.id === id) ?? null;
  }

  async updatePoint(update) {
    const updatedPoint =
      await this.#api.updatePoint(update);

    this.#points = this.#points.map((point) =>
      point.id === updatedPoint.id
        ? updatedPoint
        : point
    );

    this._notify();

    return updatedPoint;
  }

  createPoint(point) {
    const newPoint = {
      ...point,
      id: crypto.randomUUID(),
    };
    this.#points.push(newPoint);
    return newPoint;
  }

  deletePoint(id) {
    const index = this.#points.findIndex((p) => p.id === id);

    if (index === -1) {
      return;
    }

    this.#points.splice(index, 1);
  }
}
