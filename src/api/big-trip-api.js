import ApiService from '../framework/api-service.js';
import PointAdapter from '../adapter/point-adapter.js';

export default class BigTripApi extends ApiService {

  get points() {
    return this._load({
      url: 'points',
    })
      .then(ApiService.parseResponse)
      .then((points) =>
        points.map(PointAdapter.adaptToClient)
      );
  }

  get destinations() {
    return this._load({
      url: 'destinations',
    })
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({
      url: 'offers',
    })
      .then(ApiService.parseResponse);
  }

  async updatePoint(point) {
    const response = await this._load({
      url: `points/${point.id}`,
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(
        PointAdapter.adaptToServer(point)
      ),
    });

    const parsedResponse =
      await ApiService.parseResponse(response);

    return PointAdapter.adaptToClient(parsedResponse);
  }
}
