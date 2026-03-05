import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting-view.js';
import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';
import TripModel from '../model/trip-model.js';

export default class TripPresenter {
  constructor() {
    this.container = null;
    this.filtersContainer = null;
    this.model = new TripModel();
  }

  init() {
    this.container = document.querySelector('.trip-events');
    this.filtersContainer = document.querySelector('.trip-controls__filters');
    
    if (!this.container) {
      console.error('Container .trip-events not found!');
      return;
    }

    this.render();
  }

  render() {
    this.container.innerHTML = '';
    
    this.renderFilters();

    const sortingView = new SortingView();
    this.container.appendChild(sortingView.getElement());

    const points = this.model.getPoints();
    const destinations = this.model.getDestinations();
    const offers = this.model.getOffers();

    if (points.length === 0) {
      this.container.innerHTML += '<h2 class="trip-events__title">No events</h2>';
      return;
    }

    const eventsList = document.createElement('ul');
    eventsList.classList.add('trip-events__list');
    this.container.appendChild(eventsList);

    if (points.length > 0) {
      const firstPoint = points[0];
      const destination = this.model.getDestinationById(firstPoint.destinationId);
      const pointOffers = this.model.getOffersByIds(firstPoint.offerIds);
      
      const editView = new PointEditView(
        firstPoint, 
        destinations, 
        (type) => this.model.getOffersByType(type),
        offers
      );
      eventsList.appendChild(editView.getElement());
    }

    points.slice(1).forEach(point => {
      const destination = this.model.getDestinationById(point.destinationId);
      const pointOffers = this.model.getOffersByIds(point.offerIds);
      
      const pointView = new PointView(point, destination, pointOffers);
      eventsList.appendChild(pointView.getElement());
    });
  }

  renderFilters() {
    if (this.filtersContainer) {
      const filtersView = new FiltersView();
      this.filtersContainer.innerHTML = '';
      this.filtersContainer.appendChild(filtersView.getElement());
    }
  }
}
