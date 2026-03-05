import { 
  getDestinations, 
  getOffers, 
  getPoints,
  getDestinationById,
  getOffersByType,
  getOffersByIds 
} from './mock-data.js';

export default class TripModel {
  constructor() {
    this.destinations = getDestinations();
    this.offers = getOffers();
    this.points = getPoints();
  }

  // Геттеры
  getDestinations() {
    return this.destinations;
  }

  getDestinationById(id) {
    return getDestinationById(id);
  }

  getOffers() {
    return this.offers;
  }

  getOffersByType(type) {
    return getOffersByType(type);
  }

  getOffersByIds(offerIds) {
    return getOffersByIds(offerIds);
  }

  getPoints() {
    return this.points;
  }

  getPointById(id) {
    return this.points.find(point => point.id === id);
  }

  getFullPointData(pointId) {
    const point = this.getPointById(pointId);
    if (!point) return null;

    const destination = this.getDestinationById(point.destinationId);
    const offers = this.getOffersByIds(point.offerIds);

    return {
      point,
      destination,
      offers
    };
  }
}