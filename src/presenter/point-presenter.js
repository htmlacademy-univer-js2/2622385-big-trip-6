import PointView from '../view/point-view.js';
import PointEditView from '../view/point-edit-view.js';

import { render, remove, replace } from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointComponent = null;
  #pointEditComponent = null;
  #container;
  #model;
  #point;
  #mode = Mode.DEFAULT;

  #onDataChange = null;
  #onModeChange = null;

  constructor({
    model,
    onDataChange,
    onModeChange,
  }) {
    this.#model = model;

    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;
  }

  init(pointView, point) {
    this.#point = point;
    this.#container = pointView.element;

    const destination =
      this.#model.getDestinationById(
        point.destinationId
      );

    const pointOffers =
      this.#model.getOffersByIds(
        point.offerIds
      );

    const prevPointComponent = this.#pointComponent;
    const prevEditPointComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView(
      point,
      destination,
      pointOffers
    );

    this.#pointEditComponent =
      new PointEditView(
        {
          editingEvent: this.#point,
          destinations: this.#model.getDestinations(),
          offersModel: this.#model,
          onSubmit: this.#handleFormSubmit,
          onRollupClick: this.#handleRollupClick,
        }
      );

    this.#pointComponent.setEditClickHandler(
      this.#handleEditClick
    );

    this.#pointComponent.setFavoriteClickHandler(
      this.#handleFavoriteClick
    );

    if (
      prevPointComponent === null ||
      prevEditPointComponent === null
    ) {
      render(this.#pointComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevEditPointComponent);
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() {
    if (this.#mode === Mode.EDITING) {
      return;
    }

    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener(
      'keydown',
      this.#handleEscKeyDown
    );

    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    if (this.#mode !== Mode.EDITING) {
      return;
    }

    replace(this.#pointComponent, this.#pointEditComponent);
    this.#mode = Mode.DEFAULT;
    document.removeEventListener(
      'keydown',
      this.#handleEscKeyDown
    );
  }

  #handleEditClick = () => {
    this.#onModeChange(this);

    this.#replacePointToForm();
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

  #handleFormSubmit = (updatedPoint) => {
    this.#onDataChange(updatedPoint);
    this.#replaceFormToPoint();
  };

  #handleRollupClick = () => {
    this.#replaceFormToPoint();
  };
}
