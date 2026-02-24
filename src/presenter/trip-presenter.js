import FiltersView from '../view/filters-view.js';
import SortingView from '../view/sorting-view.js';
import PointView from '../view/point-view.js';
import AddNewPointView from '../view/add-new-point-view.js'; // Форма создания
import PointEditView from '../view/point-edit-view.js';      // Форма редактирования

const POINT_COUNT = 3

export default class TripPresenter {
    constructor() {
        this.container = null;
        this.filtersContainer = null;
    }

    init() {
        this.container = document.querySelector('.trip-events');
        this.filtersContainer = document.querySelector('.trip-controls__filters');

        if (!this.container) {
            console.error('Container .trip-events not found!');
            return;
        }

        this.container.innerHTML = '';

        this.renderFilters();

        const sortingView = new SortingView();
        this.container.appendChild(sortingView.getElement());

        const eventsList = document.createElement('ul');
        eventsList.classList.add('trip-events__list');
        this.container.appendChild(eventsList);

        const pointEditView = new PointEditView();
        eventsList.appendChild(pointEditView.getElement());

        for (let i = 0; i < POINT_COUNT; i++) {
            const pointView = new PointView();
            eventsList.appendChild(pointView.getElement());
        }
    }

    renderFilters() {
        if (this.filtersContainer) {
            const filtersView = new FiltersView();
            this.filtersContainer.innerHTML = ''; 
            this.filtersContainer.appendChild(filtersView.getElement());
        }
    }

    createNewPoint() {
        const eventsList = this.container.querySelector('.trip-events__list');
        const addNewPointView = new AddNewPointView();
        eventsList.prepend(addNewPointView.getElement()); 
    }
}