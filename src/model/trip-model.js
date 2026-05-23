import {
  getDestinations,
  getOffers,
  getPoints,
} from './mock-data.js';

export default class TripModel {
  #destinations = [];
  #offers = [];
  #points = [];

  constructor() {
    this.#destinations = getDestinations();
    this.#offers = getOffers();
    this.#points = getPoints();
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
    return this.#offers.filter(
      (offer) => offer.type === type
    );
  }

  getOffersByIds(offerIds = []) {
    return this.#offers.filter(
      (offer) => offerIds.includes(offer.id)
    );
  }

  getPoints() {
    return this.#points;
  }

  getPointById(id) {
    return this.#points.find((point) => point.id === id) ?? null;
  }

  updatePoint(updateId, updatedPoint) {
    this.#points = this.#points.map((point) =>
      point.id === updateId
        ? updatedPoint
        : point
    );

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
