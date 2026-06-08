import PointEditView from '../view/point-edit-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { UserAction } from '../model/const.js';

export default class AddPointPresenter {
  #container;
  #model;

  #pointEditComponent = null;

  #onDataChange = null;
  #onClose = null;

  constructor({ container, model, onDataChange, onClose }) {
    this.#container = container;
    this.#model = model;
    this.#onDataChange = onDataChange;
    this.#onClose = onClose;
  }

  init() {
    const emptyPoint = {
      id: null,
      type: 'flight',
      destinationId: null,
      basePrice: 0,
      dateFrom: null,
      dateTo: null,
      isFavorite: false,
      offerIds: [],
    };

    this.#pointEditComponent = new PointEditView({
      editingEvent: emptyPoint,
      destinations: this.#model.getDestinations(),
      offersModel: this.#model,
      onSubmit: this.#handleSubmit,
      onRollupClick: this.#handleClose,
      onDelete: this.#handleClose,
    });

    render(this.#pointEditComponent, this.#container, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#KeyEscDownHandler);
  }

  destroy() {
    if (!this.#pointEditComponent) {
      return;
    }
    document.removeEventListener('keydown', this.#KeyEscDownHandler);
    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;
  }

  #handleSubmit = (point) => {
    this.#onDataChange(UserAction.ADD_POINT, null, point);
  };

  #handleClose = () => {
    this.destroy();
    this.#onClose();
  };

  setSaving() {
    this.#pointEditComponent.setSaving();
  }

  setAborting() {
    this.#pointEditComponent.setAborting();
  }

  setDeleting() {
    this.#pointEditComponent.setDeleting();
  }

  #KeyEscDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#handleClose();
    }
  };
}
