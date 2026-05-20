import TripModel from './model/trip-model.js';
import TripPresenter from './presenter/trip-presenter.js';

document.addEventListener('DOMContentLoaded', () => {
  const tripModel = new TripModel();
  const tripPresenter = new TripPresenter(tripModel);
  tripPresenter.init();
});
