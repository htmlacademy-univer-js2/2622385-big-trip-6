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
    const serverPoint = {
      'base_price': point.basePrice,
      'date_from': point.dateFrom
        ? point.dateFrom.toISOString()
        : null,
      'date_to': point.dateTo
        ? point.dateTo.toISOString()
        : null,
      'is_favorite': point.isFavorite,
      'destination': point.destinationId,
      'offers': point.offerIds,
      'type': point.type,
    };

    if (point.id) {
      serverPoint.id = point.id;
    }

    return serverPoint;
  }
}
