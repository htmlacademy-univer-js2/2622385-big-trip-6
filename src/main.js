import TripModel from './model/trip-model.js';
import TripPresenter from './presenter/trip-presenter.js';
import FilterModel from './model/filter-model.js';

document.addEventListener('DOMContentLoaded', () => {
  const tripModel = new TripModel();
  const filterModel = new FilterModel();
  const tripPresenter = new TripPresenter(tripModel, filterModel);
  tripPresenter.init();
});
