import { useMemo, useState } from 'react';
import { getProductFinalPrice, isProductNew } from '../../data/constants';

const PRODUCTS_PER_PAGE = 15;

const resolveImages = (product) => {
  if (Array.isArray(product.images) && product.images.length > 0) {
    return product.images;
  }

  return product.image ? [product.image] : [];
};

export default function ShopPage({ products, categories, onAddToCart }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [newOnly, setNewOnly] = useState(false);
  const [page, setPage] = useState(1);

  const [selectedProductId, setSelectedProductId] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState('');
  const [detailTab, setDetailTab] = useState('description');

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId) || null,
    [products, selectedProductId]
  );

  const selectedProductImages = useMemo(
    () => (selectedProduct ? resolveImages(selectedProduct) : []),
    [selectedProduct]
  );

  const filteredProducts = useMemo(() => {
    const search = query.trim().toLowerCase();

    return products.filter((product) => {
      const byCategory = activeCategory === 'all' ? true : product.category === activeCategory;
      if (!byCategory) {
        return false;
      }

      if (newOnly && !isProductNew(product)) {
        return false;
      }

      if (!search) {
        return true;
      }

      const haystack = `${product.name} ${product.category} ${product.description || ''}`.toLowerCase();
      return haystack.includes(search);
    });
  }, [products, query, activeCategory, newOnly]);

  const pagination = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * PRODUCTS_PER_PAGE;

    return {
      page: safePage,
      totalPages,
      items: filteredProducts.slice(start, start + PRODUCTS_PER_PAGE)
    };
  }, [filteredProducts, page]);

  const openProduct = (productId) => {
    setSelectedProductId(productId);
    setActiveImageIndex(0);
    setDetailTab('description');
  };

  const closeProduct = () => {
    setSelectedProductId(null);
    setActiveImageIndex(0);
    setFullscreenImage('');
    setDetailTab('description');
  };

  const showPrevImage = () => {
    if (selectedProductImages.length === 0) {
      return;
    }

    setActiveImageIndex((prev) => (prev - 1 + selectedProductImages.length) % selectedProductImages.length);
  };

  const showNextImage = () => {
    if (selectedProductImages.length === 0) {
      return;
    }

    setActiveImageIndex((prev) => (prev + 1) % selectedProductImages.length);
  };

  if (selectedProduct) {
    const finalPrice = getProductFinalPrice(selectedProduct);
    const hasDiscount = finalPrice < selectedProduct.price;
    const activeImage = selectedProductImages[activeImageIndex] || '';
    const productSpecs = Array.isArray(selectedProduct.specs) ? selectedProduct.specs : [];

    return (
      <>
        <div className="card shadow-sm shop-product-page">
          <div className="card-body d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 shop-detail-head">
              <button type="button" className="btn btn-outline-primary" onClick={closeProduct}>
                <i className="bi bi-arrow-left me-2" /> До каталогу
              </button>
              <div className="d-flex gap-2 flex-wrap">
                <span className="badge text-bg-light">{selectedProduct.category}</span>
                {isProductNew(selectedProduct) && <span className="badge product-badge-new">Новинка</span>}
                {hasDiscount && <span className="badge product-badge-discount">-{selectedProduct.discountPercent}%</span>}
              </div>
            </div>

            <div className="shop-product-layout shop-product-main-layout">
              <div className="shop-gallery-wrap">
                <div className="shop-gallery-main">
                  {activeImage ? (
                    <img
                      src={activeImage}
                      alt={selectedProduct.name}
                      onClick={() => setFullscreenImage(activeImage)}
                      role="button"
                    />
                  ) : (
                    <div className="shop-gallery-empty">Фото відсутнє</div>
                  )}

                  {selectedProductImages.length > 1 && (
                    <>
                      <button type="button" className="shop-gallery-nav prev" onClick={showPrevImage}>
                        <i className="bi bi-chevron-left" />
                      </button>
                      <button type="button" className="shop-gallery-nav next" onClick={showNextImage}>
                        <i className="bi bi-chevron-right" />
                      </button>
                    </>
                  )}
                </div>

                {selectedProductImages.length > 1 && (
                  <div className="shop-gallery-thumbs">
                    {selectedProductImages.map((image, index) => (
                      <button
                        type="button"
                        key={`${image.slice(0, 24)}-${index}`}
                        className={`shop-gallery-thumb ${index === activeImageIndex ? 'active' : ''}`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <img src={image} alt={`thumb-${index}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <aside className="shop-buy-card">
                <div>
                  <h3 className="mb-1">{selectedProduct.name}</h3>
                  <div className="small text-body-secondary">Код товару: TF-{selectedProduct.id}</div>
                </div>

                <div className="shop-product-price-row">
                  <div>
                    <div className="product-price">
                      <i className="bi bi-coin me-1" />
                      {finalPrice}
                    </div>
                    {hasDiscount && (
                      <div className="product-price-old">
                        <i className="bi bi-coin me-1" />
                        {selectedProduct.price}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary shop-buy-btn"
                    aria-label="Додати в кошик"
                    title="Додати в кошик"
                    onClick={() => onAddToCart(selectedProduct.id)}
                  >
                    <i className="bi bi-cart-plus" />
                  </button>
                </div>

                <div className="d-flex flex-column gap-2">
                  <div className="small text-body-secondary">Доставка та оплата</div>
                  <div className="shop-quick-info-row">
                    <span><i className="bi bi-truck me-2" />Відправка щодня</span>
                    <strong>Нова Пошта / Укрпошта</strong>
                  </div>
                  <div className="shop-quick-info-row">
                    <span><i className="bi bi-credit-card me-2" />Оплата</span>
                    <strong>Онлайн або післяплата</strong>
                  </div>
                  <div className="shop-quick-info-row">
                    <span><i className="bi bi-arrow-repeat me-2" />Повернення</span>
                    <strong>14 днів</strong>
                  </div>
                </div>
              </aside>
            </div>

            <div className="shop-detail-tabs" role="tablist" aria-label="Інформація про товар">
              <button
                type="button"
                className={`shop-detail-tab ${detailTab === 'description' ? 'active' : ''}`}
                onClick={() => setDetailTab('description')}
              >
                Опис
              </button>
              <button
                type="button"
                className={`shop-detail-tab ${detailTab === 'specs' ? 'active' : ''}`}
                onClick={() => setDetailTab('specs')}
              >
                Характеристики
              </button>
              <button
                type="button"
                className={`shop-detail-tab ${detailTab === 'delivery' ? 'active' : ''}`}
                onClick={() => setDetailTab('delivery')}
              >
                Доставка та оплата
              </button>
            </div>

            <div className="shop-detail-panel">
              {detailTab === 'description' && (
                <div className="shop-detail-copy">
                  {selectedProduct.description
                    ? selectedProduct.description
                    : 'Опис для цього товару ще не додано. Оновіть картку в адмін-панелі.'}
                </div>
              )}

              {detailTab === 'specs' && (
                <div className="d-flex flex-column gap-2">
                  {productSpecs.length === 0 ? (
                    <div className="text-body-secondary">Характеристики ще не заповнені.</div>
                  ) : (
                    productSpecs.map((spec) => (
                      <div className="shop-spec-row" key={spec.id || `${spec.key}-${spec.value}`}>
                        <span>{spec.key}</span>
                        <strong>{spec.value}</strong>
                      </div>
                    ))
                  )}
                </div>
              )}

              {detailTab === 'delivery' && (
                <ul className="shop-delivery-list mb-0">
                  <li>Відправлення щодня через Нову Пошту або Укрпошту.</li>
                  <li>Оплата онлайн або післяплата при отриманні.</li>
                  <li>Повернення товару протягом 14 днів з моменту покупки.</li>
                  <li>Підтримка менеджера: 09:00-20:00, без вихідних.</li>
                </ul>
              )}
            </div>
          </div>
        </div>

        {fullscreenImage && (
          <div className="fullscreen-image-overlay" onClick={() => setFullscreenImage('')}>
            <img src={fullscreenImage} alt="fullscreen product" className="fullscreen-image" />
            <button type="button" className="btn btn-light fullscreen-close-btn" onClick={() => setFullscreenImage('')}>
              <i className="bi bi-x-lg" />
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="d-flex flex-column gap-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-md-5">
              <label className="form-label">Пошук товару</label>
              <input
                className="form-control"
                placeholder="Наприклад: клавіатура, стрім, аудіо"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Категорія</label>
              <select
                className="form-select"
                value={activeCategory}
                onChange={(event) => {
                  setActiveCategory(event.target.value);
                  setPage(1);
                }}
              >
                <option value="all">Усі категорії</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label d-block">Промо-стрічка</label>
              <button
                type="button"
                className={`btn w-100 ${newOnly ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => {
                  setNewOnly((value) => !value);
                  setPage(1);
                }}
              >
                <i className="bi bi-stars me-2" />
                {newOnly ? 'Лише новинки' : 'Показати новинки'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="shop-products-grid">
        {pagination.items.map((product) => {
          const finalPrice = getProductFinalPrice(product);
          const hasDiscount = finalPrice < product.price;
          const image = resolveImages(product)[0] || '';

          return (
            <article
              className="card h-100 shadow-sm shop-card shop-grid-card"
              key={product.id}
              role="button"
              tabIndex={0}
              onClick={() => openProduct(product.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openProduct(product.id);
                }
              }}
            >
              <div className="card-body d-flex flex-column">
                <div className="product-image-wrap mb-3 position-relative">
                  {image ? (
                    <img
                      src={image}
                      alt={product.name}
                      className="product-image"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.src = 'https://placehold.co/600x400?text=TaskFlow+Shop';
                      }}
                    />
                  ) : (
                    <div className="shop-image-fallback">No photo</div>
                  )}

                  <div className="product-badges">
                    {isProductNew(product) && <span className="badge product-badge-new">Новинка</span>}
                    {hasDiscount && (
                      <span className="badge product-badge-discount">-{product.discountPercent}%</span>
                    )}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="badge text-bg-light">{product.category}</span>
                </div>

                <h6 className="card-title mb-3">{product.name}</h6>

                <div className="d-flex justify-content-between align-items-end mt-auto pt-2 gap-2">
                  <div>
                    <div className="product-price">
                      <i className="bi bi-coin me-1" />
                      {finalPrice}
                    </div>
                    {hasDiscount && (
                      <div className="product-price-old">
                        <i className="bi bi-coin me-1" />
                        {product.price}
                      </div>
                    )}
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    type="button"
                    aria-label="Додати в кошик"
                    onClick={(event) => {
                      event.stopPropagation();
                      onAddToCart(product.id);
                    }}
                  >
                    <i className="bi bi-cart-plus" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {pagination.items.length === 0 && (
          <div className="card shadow-sm">
            <div className="card-body text-body-secondary">За заданими фільтрами товари не знайдено.</div>
          </div>
        )}
      </div>

      {pagination.totalPages > 1 && (
        <div className="d-flex justify-content-center">
          <div className="btn-group" role="group" aria-label="Shop pagination">
            <button
              type="button"
              className="btn btn-outline-primary"
              disabled={pagination.page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            >
              Назад
            </button>
            <button type="button" className="btn btn-primary" disabled>
              {pagination.page} / {pagination.totalPages}
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
            >
              Далі
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
