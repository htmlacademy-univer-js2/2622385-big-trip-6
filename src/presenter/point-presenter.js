import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #container = null;
  #model = null;

  #point = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #mode = Mode.DEFAULT;

  #onDataChange = null;
  #onModeChange = null;

  constructor({
    container,
    model,
    onDataChange,
    onModeChange,
  }) {
    this.#container = container;
    this.#model = model;

    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const destination =
      this.#model.getDestinationById(
        point.destinationId
      );

    const pointOffers =
      this.#model.getOffersByIds(
        point.offerIds
      );

    this.#pointComponent = new PointView(
      point,
      destination,
      pointOffers
    );

    this.#pointEditComponent =
      new PointEditView(
        point,
        this.#model.getDestinations(),
        (type) =>
          this.#model.getOffersByType(type),
        this.#model.getOffers()
      );

    this.#pointComponent.setEditClickHandler(
      this.#handleEditClick
    );

    this.#pointComponent.setFavoriteClickHandler(
      this.#handleFavoriteClick
    );

    this.#pointEditComponent.setCloseClickHandler(
      this.#handleCloseClick
    );

    this.#pointEditComponent.setCancelClickHandler(
      this.#handleCancelClick
    );

    this.#pointEditComponent.setFormSubmitHandler(
      this.#handleFormSubmit
    );

    this.#container.appendChild(
      this.#pointComponent.element
    );
  }

  destroy() {
    this.#pointComponent?.element?.remove();
    this.#pointEditComponent?.element?.remove();
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() {
    this.#pointComponent.element.replaceWith(
      this.#pointEditComponent.element
    );

    document.addEventListener(
      'keydown',
      this.#handleEscKeyDown
    );

    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    this.#pointEditComponent.element.replaceWith(
      this.#pointComponent.element
    );

    document.removeEventListener(
      'keydown',
      this.#handleEscKeyDown
    );

    this.#mode = Mode.DEFAULT;
  }

  #handleEditClick = () => {
    this.#onModeChange();

    this.#replacePointToForm();
  };

  #handleCloseClick = () => {
    this.#replaceFormToPoint();
  };

  #handleCancelClick = (evt) => {
    evt.preventDefault();

    this.destroy();
  };

  #handleEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();

      this.#replaceFormToPoint();
    }
  };

  #handleFavoriteClick = () => {
    this.#onDataChange({
      ...this.#point,
      isFavorite:
        !this.#point.isFavorite,
    });
  };

  #handleFormSubmit = (evt) => {
    evt.preventDefault();

    const formData =
      this.#pointEditComponent.getFormData();

    const updatedPoint = {
      ...this.#point,
      ...formData,
    };

    this.#onDataChange(updatedPoint);
  };
}
