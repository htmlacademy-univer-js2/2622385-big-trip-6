import TripModel from './model/trip-model.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterModel from './model/filter-model.js';
import BigTripApi from './api/big-trip-api.js';


if (localStorage.getItem('token') === null) {
  localStorage.setItem('token', crypto.randomUUID());
}

const ENDPOINT = 'https://24.objects.htmlacademy.pro/big-trip';
const AUTHORIZATION = `Basic ${localStorage.getItem('token')}`;

const api = new BigTripApi(
  ENDPOINT,
  AUTHORIZATION
);

const tripModel = new TripModel({
  api,
});
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(
  tripModel,
  filterModel,
);

const bootstrap = async () => {
  tripPresenter.init();
  await tripModel.init();
  tripPresenter.renderBoard();
};

bootstrap();
