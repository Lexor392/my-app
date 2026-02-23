import { getProductFinalPrice } from '../../data/constants';

export default function CartPanel({
  open,
  items,
  total,
  onClose,
  onChangeQuantity,
  onCheckout
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-panel" onClick={(event) => event.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Кошик</h5>
          <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-body-secondary">Кошик порожній.</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {items.map((item) => (
              <div className="cart-item" key={item.product.id}>
                <div className="d-flex flex-column">
                  <strong>{item.product.name}</strong>
                  <div className="small text-body-secondary">{getProductFinalPrice(item.product)} балів/шт</div>
                  {getProductFinalPrice(item.product) < item.product.price && (
                    <div className="small text-decoration-line-through text-body-secondary">
                      {item.product.price} балів
                    </div>
                  )}
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => onChangeQuantity(item.product.id, -1)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => onChangeQuantity(item.product.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            <div className="cart-total">
              <span>Разом:</span>
              <strong>{total} балів</strong>
            </div>

            <button className="btn btn-primary" type="button" onClick={onCheckout}>
              Оформити покупку
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
