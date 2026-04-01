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
    this.eventsList = null;
    this.pointViews = new Map();
    this.activeEditView = null;
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
  }

  init() {
    this.container = document.querySelector('.trip-events');
    this.filtersContainer = document.querySelector('.trip-controls__filters');
    if (!this.container) {
      return;
    }

    this.render();
  }

  render() {
    this.container.innerHTML = '';
    this.renderFilters();
    this.renderSorting();

    const points = this.model.getPoints();
    const destinations = this.model.getDestinations();
    const offers = this.model.getOffers();

    if (points.length === 0) {
      this.container.innerHTML += '<h2 class="trip-events__title">No events</h2>';
      return;
    }

    this.eventsList = document.createElement('ul');
    this.eventsList.classList.add('trip-events__list');
    this.container.appendChild(this.eventsList);

    points.forEach((point) => this.renderPoint(point, this.eventsList, destinations, offers));
  }

  renderFilters() {
    if (this.filtersContainer) {
      const filtersView = new FiltersView();
      this.filtersContainer.innerHTML = '';
      this.filtersContainer.appendChild(filtersView.element);
    }
  }

  renderSorting() {
    const sortingView = new SortingView();
    this.container.appendChild(sortingView.element);
  }

  renderPoint(point, eventsList) {
    const destination = this.model.getDestinationById(point.destinationId);
    const pointOffers = this.model.getOffersByIds(point.offerIds);
    const pointView = new PointView(point, destination, pointOffers);
    eventsList.appendChild(pointView.element);
    this.pointViews.set(point.id, pointView);
    pointView.setEditClickHandler(() => {
      this.openEditForm(point, pointView);
    });
    pointView.setFavoriteClickHandler(() => {
      try {
        this.model.toggleFavorite(point.id);
        const updatedPoint = this.model.getPointById(point.id);
        if (updatedPoint) {
          const newDestination = this.model.getDestinationById(updatedPoint.destinationId);
          const newPointOffers = this.model.getOffersByIds(updatedPoint.offerIds);
          pointView.updateData(updatedPoint, newDestination, newPointOffers);
        }
      } catch (error) {
        pointView.shake();
      }
    });
  }

  openEditForm(point, oldPointView) {
    if (this.activeEditView) {
      this.closeEditForm();
    }
    const destinations = this.model.getDestinations();
    const offers = this.model.getOffers();
    const editView = new PointEditView(
      point,
      destinations,
      (type) => this.model.getOffersByType(type),
      offers
    );
    this.activeEditView = editView;
    oldPointView.element.replaceWith(editView.element);
    this.pointViews.delete(point.id);
    this._setEditFormHandlers(editView, point);
    document.addEventListener('keydown', this._onDocumentKeyDown);
  }

  _setEditFormHandlers(editView, point) {
    editView.setFormSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = editView.getFormData();
      try {
        const updatedPoint = { ...point, ...formData };
        this.model.updatePoint(point.id, updatedPoint);
        this.closeEditForm();
      } catch (error) {
        editView.showError();
      }
    });
    editView.setCancelClickHandler((evt) => {
      evt.preventDefault();
      this.closeEditForm();
    });
    editView.setCloseClickHandler(() => {
      this.closeEditForm();
    });
  }

  closeEditForm() {
    if (!this.activeEditView) {
      return;
    }
    const pointId = this.activeEditView.point?.id;
    if (pointId) {
      const point = this.model.getPointById(pointId);
      if (point) {
        const destination = this.model.getDestinationById(point.destinationId);
        const pointOffers = this.model.getOffersByIds(point.offerIds);
        const pointView = new PointView(point, destination, pointOffers);
        pointView.setEditClickHandler(() => {
          this.openEditForm(point, pointView);
        });
        pointView.setFavoriteClickHandler(() => {
          this.model.toggleFavorite(point.id);
          const updatedPoint = this.model.getPointById(point.id);
          if (updatedPoint) {
            const newDestination = this.model.getDestinationById(updatedPoint.destinationId);
            const newPointOffers = this.model.getOffersByIds(updatedPoint.offerIds);
            pointView.updateData(updatedPoint, newDestination, newPointOffers);
          }
        });
        this.activeEditView.element.replaceWith(pointView.element);
        this.pointViews.set(point.id, pointView);
      }
    }
    this.activeEditView = null;
    document.removeEventListener('keydown', this._onDocumentKeyDown);
  }

  _onDocumentKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.closeEditForm();
    }
  }
}
