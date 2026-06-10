import TripModel from './model/trip-model.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterModel from './model/filter-model.js';
import BigTripApi from './api/big-trip-api.js';

const RANDOM_RADIX = 36;
const TOKEN_START_INDEX = 2;

if (localStorage.getItem('token') === null) {
  localStorage.setItem('token', Math.random().toString(RANDOM_RADIX).substring(TOKEN_START_INDEX));
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
