export default class PointAdapter {
  static adaptToClient(point) {
    return {
      id: point.id,
      type: point.type,
      basePrice: point['base_price'],
      dateFrom: point['date_from']
        ? new Date(point['date_from'])
        : null,
      dateTo: point['date_to']
        ? new Date(point['date_to'])
        : null,

      destinationId: point.destination,
      isFavorite: point['is_favorite'],

      offerIds: point.offers ?? [],
    };
  }

  static adaptToServer(point) {
    return {
      'id': point.id,
      'base_price': point.basePrice,
      'date_from': point.dateFrom,
      'date_to': point.dateTo,
      'is_favorite': point.isFavorite,
      'destination': point.destinationId,
      'offers': point.offerIds,
      'type': point.type,
    };
  }
}
