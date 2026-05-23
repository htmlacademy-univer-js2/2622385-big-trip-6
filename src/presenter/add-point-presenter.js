import PointEditView from '../view/point-edit-view.js';
import { render, remove } from '../framework/render.js';
import { UserAction } from '../utils.js';

export default class AddPointPresenter {
  #container;
  #model;

  #editComponent = null;

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

    this.#editComponent = new PointEditView({
      editingEvent: emptyPoint,
      destinations: this.#model.getDestinations(),
      offersModel: this.#model,
      onSubmit: this.#handleSubmit,
      onRollupClick: this.#handleClose,
      onDelete: this.#handleClose,
    });

    render(this.#editComponent, this.#container);
  }

  destroy() {
    if (!this.#editComponent) {
      return;
    }
    remove(this.#editComponent);
    this.#editComponent = null;
  }

  #handleSubmit = (point) => {
    this.#onDataChange(UserAction.ADD_POINT, null, point);
    this.destroy();
  };

  #handleClose = () => {
    this.destroy();
    this.#onClose();
  };
}
