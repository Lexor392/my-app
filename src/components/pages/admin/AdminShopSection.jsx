import { useMemo, useState } from 'react';
import { getProductFinalPrice, isProductNew } from '../../../data/constants';

const PAGE_SIZE = 10;

const createSpecDraft = () => ({
  id: `spec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  key: '',
  value: ''
});

const createProductDraft = (categories = []) => ({
  id: undefined,
  name: '',
  images: [],
  description: '',
  specs: [createSpecDraft()],
  price: '',
  discountPercent: 0,
  isNew: false,
  newDays: 5,
  category: categories[0] || '',
  createdAt: null
});

const calculateNewDays = (product) => {
  const parsed = Date.parse(product?.isNewUntil || '');
  if (!Number.isFinite(parsed) || parsed <= Date.now()) {
    return 5;
  }

  const days = Math.ceil((parsed - Date.now()) / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
};

const toProductDraft = (product, categories) => ({
  id: product.id,
  name: product.name || '',
  images: Array.isArray(product.images) ? product.images : (product.image ? [product.image] : []),
  description: product.description || '',
  specs: Array.isArray(product.specs) && product.specs.length > 0
    ? product.specs.map((spec) => ({
      id: spec.id || `spec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      key: spec.key || '',
      value: spec.value || ''
    }))
    : [createSpecDraft()],
  price: String(product.price ?? ''),
  discountPercent: Number(product.discountPercent || 0),
  isNew: isProductNew(product),
  newDays: calculateNewDays(product),
  category: product.category || categories[0] || '',
  createdAt: product.createdAt || null
});

const buildProductPayload = (draft, { forDraft = false } = {}) => {
  const now = new Date();
  const days = Math.max(1, Number(draft.newDays || 1));
  const isNewUntil = draft.isNew
    ? new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const cleanSpecs = (Array.isArray(draft.specs) ? draft.specs : [])
    .map((spec) => ({
      id: spec.id,
      key: String(spec.key || '').trim(),
      value: String(spec.value || '').trim()
    }))
    .filter((spec) => spec.key && spec.value);

  const cleanImages = (Array.isArray(draft.images) ? draft.images : [])
    .map((item) => String(item || '').trim())
    .filter(Boolean);

  const name = String(draft.name || '').trim();

  return {
    id: draft.id,
    name: forDraft ? (name || 'Чернетка без назви') : name,
    images: cleanImages,
    image: cleanImages[0] || '',
    description: String(draft.description || '').trim(),
    specs: cleanSpecs,
    price: Number(draft.price || 0),
    discountPercent: Number(draft.discountPercent || 0),
    isNew: Boolean(draft.isNew),
    isNewUntil,
    category: String(draft.category || '').trim(),
    createdAt: draft.createdAt || now.toISOString(),
    updatedAt: now.toISOString()
  };
};

const readFilesAsDataUrls = async (files) => {
  const fileList = Array.from(files || []);

  const readers = fileList.map((file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error(`Не вдалося прочитати файл ${file.name}`));
      reader.readAsDataURL(file);
    })
  );

  const loaded = await Promise.all(readers);
  return loaded.filter(Boolean);
};

export default function AdminShopSection({
  shopCategories,
  shopProducts,
  shopDraftProducts,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
  onSaveProduct,
  onDeleteProduct,
  onSaveDraftProduct,
  onDeleteDraftProduct
}) {
  const [activeTab, setActiveTab] = useState('catalog');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [categoryEdits, setCategoryEdits] = useState({});

  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [productStep, setProductStep] = useState(0);
  const [productDraft, setProductDraft] = useState(createProductDraft(shopCategories));
  const [wizardMode, setWizardMode] = useState('create');
  const [uploadingFiles, setUploadingFiles] = useState(false);

  const sourceList = activeTab === 'drafts' ? shopDraftProducts : shopProducts;

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return sourceList;
    }

    return sourceList.filter((product) => {
      const haystack = `${product.name} ${product.category} ${product.description || ''}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [search, sourceList]);

  const pagination = useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;

    return {
      page: safePage,
      totalPages,
      items: filteredProducts.slice(start, start + PAGE_SIZE)
    };
  }, [filteredProducts, page]);

  const stepTitles = ['Основне', 'Опис', 'Характеристики', 'Ціна та категорія'];

  const resetWizard = () => {
    setProductStep(0);
    setWizardMode('create');
    setProductDraft(createProductDraft(shopCategories));
    setUploadingFiles(false);
    setProductModalOpen(false);
  };

  const openCreateWizard = () => {
    setWizardMode('create');
    setProductDraft(createProductDraft(shopCategories));
    setProductStep(0);
    setProductModalOpen(true);
  };

  const openEditWizard = (product, mode = 'edit') => {
    setWizardMode(mode);
    setProductDraft(toProductDraft(product, shopCategories));
    setProductStep(0);
    setProductModalOpen(true);
  };

  const saveAsDraftAndClose = async () => {
    const payload = buildProductPayload(productDraft, { forDraft: true });
    const saved = await onSaveDraftProduct(payload);
    if (saved) {
      resetWizard();
      setActiveTab('drafts');
    }
  };

  const submitProduct = async (event) => {
    event.preventDefault();

    const payload = buildProductPayload(productDraft, { forDraft: false });
    const saved = await onSaveProduct(payload);
    if (saved) {
      resetWizard();
      setActiveTab('catalog');
    }
  };

  const goNextStep = () => {
    if (productStep === 0) {
      const hasTitle = String(productDraft.name || '').trim().length > 0;
      const hasImage = Array.isArray(productDraft.images) && productDraft.images.length > 0;
      if (!hasTitle || !hasImage) {
        return;
      }
    }

    setProductStep((prev) => Math.min(stepTitles.length - 1, prev + 1));
  };

  const goPrevStep = () => {
    setProductStep((prev) => Math.max(0, prev - 1));
  };

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    setUploadingFiles(true);
    try {
      const loaded = await readFilesAsDataUrls(files);
      setProductDraft((prev) => ({
        ...prev,
        images: [...prev.images, ...loaded].slice(0, 8)
      }));
      event.target.value = '';
    } finally {
      setUploadingFiles(false);
    }
  };

  const removeImage = (index) => {
    setProductDraft((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== index)
    }));
  };

  const updateSpec = (specId, field, value) => {
    setProductDraft((prev) => ({
      ...prev,
      specs: prev.specs.map((spec) => (spec.id === specId ? { ...spec, [field]: value } : spec))
    }));
  };

  const addSpec = () => {
    setProductDraft((prev) => ({
      ...prev,
      specs: [...prev.specs, createSpecDraft()]
    }));
  };

  const removeSpec = (specId) => {
    setProductDraft((prev) => ({
      ...prev,
      specs: prev.specs.filter((spec) => spec.id !== specId)
    }));
  };

  const categoryStats = useMemo(
    () => shopCategories.map((category) => ({
      category,
      productsCount: shopProducts.filter((product) => product.category === category).length,
      draftsCount: shopDraftProducts.filter((product) => product.category === category).length
    })),
    [shopCategories, shopDraftProducts, shopProducts]
  );

  return (
    <div className="d-flex flex-column gap-4">
      <div className="card shadow-sm">
        <div className="card-body d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <h6 className="mb-1">Управління магазином</h6>
            <div className="small text-body-secondary">
              Працюйте з каталогом та чернетками товарів у покроковому форматі.
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setCategoryModalOpen(true)}>
              <i className="bi bi-tags me-2" />
              Категорії
            </button>
            <button type="button" className="btn btn-primary" onClick={openCreateWizard}>
              <i className="bi bi-plus-circle me-2" />
              Додати товар
            </button>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <div className="btn-group" role="group" aria-label="Admin shop tabs">
              <button
                type="button"
                className={`btn btn-sm ${activeTab === 'catalog' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => {
                  setActiveTab('catalog');
                  setPage(1);
                }}
              >
                Каталог ({shopProducts.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeTab === 'drafts' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => {
                  setActiveTab('drafts');
                  setPage(1);
                }}
              >
                Чернетки ({shopDraftProducts.length})
              </button>
            </div>

            <input
              className="form-control admin-product-search"
              placeholder="Пошук товару"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
            />
          </div>

          <div className="row g-3">
            {pagination.items.map((product) => {
              const finalPrice = getProductFinalPrice(product);
              const hasDiscount = finalPrice < product.price;
              const image = Array.isArray(product.images) && product.images.length > 0
                ? product.images[0]
                : product.image;

              return (
                <div className="col-md-6 col-xl-4" key={`${activeTab}-${product.id}`}>
                  <article className="admin-product-card admin-shop-card h-100">
                    <img src={image} alt={product.name} className="admin-product-image" />

                    <div className="d-flex flex-wrap gap-1">
                      {isProductNew(product) && <span className="badge product-badge-new">Новинка</span>}
                      {hasDiscount && <span className="badge product-badge-discount">-{product.discountPercent}%</span>}
                      {activeTab === 'drafts' && <span className="badge text-bg-secondary">Чернетка</span>}
                    </div>

                    <div>
                      <div className="fw-semibold">{product.name}</div>
                      <div className="small text-body-secondary">{product.category}</div>
                      <div className="small text-primary fw-semibold mt-1">{finalPrice} балів</div>
                    </div>

                    <div className="d-flex gap-2 flex-wrap mt-auto">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => openEditWizard(product, activeTab === 'drafts' ? 'draft' : 'edit')}
                      >
                        <i className="bi bi-pencil-square me-1" />
                        Редагувати
                      </button>

                      {activeTab === 'drafts' && (
                        <button
                          type="button"
                          className="btn btn-sm btn-primary"
                          onClick={async () => {
                            const saved = await onSaveProduct(
                              buildProductPayload(toProductDraft(product, shopCategories), { forDraft: false })
                            );
                            if (saved) {
                              setActiveTab('catalog');
                            }
                          }}
                        >
                          <i className="bi bi-send-check me-1" />
                          Опублікувати
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => {
                          if (activeTab === 'drafts') {
                            onDeleteDraftProduct(product.id);
                          } else {
                            onDeleteProduct(product.id);
                          }
                        }}
                      >
                        <i className="bi bi-trash me-1" />
                        Видалити
                      </button>
                    </div>
                  </article>
                </div>
              );
            })}

            {pagination.items.length === 0 && (
              <div className="col-12">
                <div className="text-body-secondary">Товари не знайдено.</div>
              </div>
            )}
          </div>

          {pagination.totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <div className="btn-group" role="group" aria-label="Admin products pagination">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  Назад
                </button>
                <button type="button" className="btn btn-primary btn-sm" disabled>
                  {pagination.page} / {pagination.totalPages}
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((prev) => Math.min(pagination.totalPages, prev + 1))}
                >
                  Далі
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isCategoryModalOpen && (
        <div className="modal-overlay" onClick={() => setCategoryModalOpen(false)}>
          <div className="task-modal card shadow-lg" onClick={(event) => event.stopPropagation()}>
            <div className="card-body d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Категорії магазину</h5>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setCategoryModalOpen(false)}>
                  <i className="bi bi-x-lg" />
                </button>
              </div>

              <div className="input-group">
                <input
                  className="form-control"
                  value={newCategory}
                  placeholder="Нова категорія"
                  onChange={(event) => setNewCategory(event.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={async () => {
                    const saved = await onAddCategory(newCategory);
                    if (saved) {
                      setNewCategory('');
                    }
                  }}
                >
                  Додати
                </button>
              </div>

              <div className="admin-list-scroll d-flex flex-column gap-2">
                {categoryStats.map((entry) => (
                  <div className="admin-category-item" key={entry.category}>
                    <div className="flex-grow-1">
                      <input
                        className="form-control form-control-sm mb-1"
                        value={categoryEdits[entry.category] ?? entry.category}
                        onChange={(event) =>
                          setCategoryEdits((prev) => ({
                            ...prev,
                            [entry.category]: event.target.value
                          }))}
                      />
                      <div className="small text-body-secondary">
                        Товарів: {entry.productsCount} | Чернеток: {entry.draftsCount}
                      </div>
                    </div>

                    <div className="d-flex gap-2">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => onRenameCategory(entry.category, categoryEdits[entry.category] ?? entry.category)}
                      >
                        <i className="bi bi-check2" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => onDeleteCategory(entry.category)}
                      >
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {isProductModalOpen && (
        <div className="modal-overlay" onClick={saveAsDraftAndClose}>
          <div className="task-modal card shadow-lg" onClick={(event) => event.stopPropagation()}>
            <div className="card-body d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-center gap-2">
                <div>
                  <h5 className="mb-1">
                    {wizardMode === 'create' ? 'Новий товар' : 'Редагування товару'}
                  </h5>
                  <div className="small text-body-secondary">Крок {productStep + 1} з {stepTitles.length}: {stepTitles[productStep]}</div>
                </div>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={saveAsDraftAndClose}>
                  <i className="bi bi-x-lg" />
                </button>
              </div>

              <div className="wizard-stepper">
                {stepTitles.map((label, idx) => (
                  <div key={label} className={`wizard-step ${idx <= productStep ? 'active' : ''}`}>
                    <span>{idx + 1}</span>
                    <small>{label}</small>
                  </div>
                ))}
              </div>

              <form className="d-flex flex-column gap-3" onSubmit={submitProduct}>
                {productStep === 0 && (
                  <>
                    <div>
                      <label className="form-label">Назва товару</label>
                      <input
                        className="form-control"
                        value={productDraft.name}
                        onChange={(event) => setProductDraft((prev) => ({ ...prev, name: event.target.value }))}
                        placeholder="Наприклад: HyperX Cloud Orbit"
                      />
                    </div>

                    <div>
                      <label className="form-label">Фото товару</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={uploadingFiles}
                      />
                      <div className="small text-body-secondary mt-1">
                        Підтримується до 8 фото. {uploadingFiles ? 'Завантаження...' : 'Файли завантажуються у товар напряму.'}
                      </div>
                    </div>

                    <div className="admin-product-images-grid">
                      {productDraft.images.map((image, index) => (
                        <div className="admin-product-image-thumb" key={`${image.slice(0, 24)}-${index}`}>
                          <img src={image} alt={`product-${index}`} />
                          <button
                            type="button"
                            className="btn btn-sm btn-light"
                            onClick={() => removeImage(index)}
                          >
                            <i className="bi bi-x" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {productStep === 1 && (
                  <div>
                    <label className="form-label">Опис</label>
                    <textarea
                      className="form-control"
                      rows={6}
                      value={productDraft.description}
                      onChange={(event) => setProductDraft((prev) => ({ ...prev, description: event.target.value }))}
                      placeholder="Опишіть головні переваги, сценарії використання та комплект поставки."
                    />
                  </div>
                )}

                {productStep === 2 && (
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <label className="form-label mb-0">Характеристики</label>
                      <button type="button" className="btn btn-sm btn-outline-primary" onClick={addSpec}>
                        <i className="bi bi-plus-lg me-1" /> Додати
                      </button>
                    </div>

                    {productDraft.specs.map((spec) => (
                      <div className="row g-2" key={spec.id}>
                        <div className="col-md-5">
                          <input
                            className="form-control"
                            placeholder="Параметр"
                            value={spec.key}
                            onChange={(event) => updateSpec(spec.id, 'key', event.target.value)}
                          />
                        </div>
                        <div className="col-md-6">
                          <input
                            className="form-control"
                            placeholder="Значення"
                            value={spec.value}
                            onChange={(event) => updateSpec(spec.id, 'value', event.target.value)}
                          />
                        </div>
                        <div className="col-md-1 d-grid">
                          <button type="button" className="btn btn-outline-danger" onClick={() => removeSpec(spec.id)}>
                            <i className="bi bi-trash" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {productStep === 3 && (
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Ціна</label>
                      <input
                        type="number"
                        className="form-control"
                        value={productDraft.price}
                        onChange={(event) => setProductDraft((prev) => ({ ...prev, price: event.target.value }))}
                        min={0}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Знижка (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={productDraft.discountPercent}
                        onChange={(event) => setProductDraft((prev) => ({ ...prev, discountPercent: event.target.value }))}
                        min={0}
                        max={90}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Категорія</label>
                      <select
                        className="form-select"
                        value={productDraft.category}
                        onChange={(event) => setProductDraft((prev) => ({ ...prev, category: event.target.value }))}
                      >
                        {shopCategories.map((category) => (
                          <option value={category} key={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-check form-switch mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={productDraft.isNew}
                          onChange={(event) => setProductDraft((prev) => ({ ...prev, isNew: event.target.checked }))}
                        />
                        <span className="form-check-label">Позначити як новинку</span>
                      </label>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Днів підсвітки "Новинка"</label>
                      <input
                        type="number"
                        className="form-control"
                        value={productDraft.newDays}
                        min={1}
                        max={30}
                        disabled={!productDraft.isNew}
                        onChange={(event) => setProductDraft((prev) => ({ ...prev, newDays: event.target.value }))}
                      />
                    </div>
                  </div>
                )}

                <div className="d-flex justify-content-between gap-2 pt-2">
                  <button type="button" className="btn btn-outline-secondary" onClick={saveAsDraftAndClose}>
                    Скасувати у чернетку
                  </button>

                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-outline-primary" onClick={goPrevStep} disabled={productStep === 0}>
                      Назад
                    </button>
                    {productStep < stepTitles.length - 1 ? (
                      <button type="button" className="btn btn-primary" onClick={goNextStep}>
                        Далі
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-success">
                        {wizardMode === 'create' ? 'Додати товар' : 'Зберегти товар'}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
