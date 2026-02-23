import { useCallback, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { DEFAULT_SHOP_CATEGORIES, DEFAULT_SHOP_PRODUCTS, sanitizeShopCategory, sanitizeShopProduct } from '../data/constants';
import { db, hasFirebaseConfig } from '../lib/firebase';

const APP_COLLECTION = 'app';
const SHOP_DOCUMENT_ID = 'shop';
const LEGACY_DEMO_PRODUCT_IDS = new Set([1, 2, 3, 4, 5, 6]);

const normalizeShopState = (raw) => {
  const categoriesRaw = Array.isArray(raw?.categories)
    ? raw.categories.map((category) => sanitizeShopCategory(category)).filter(Boolean)
    : [];

  const categories = Array.from(new Set(categoriesRaw));
  const safeCategories = categories.length > 0 ? categories : DEFAULT_SHOP_CATEGORIES;

  const productsRaw = Array.isArray(raw?.products)
    ? raw.products
      .map((product) => sanitizeShopProduct(product))
      .filter((product) => product.name && Number.isFinite(product.price))
    : [];

  const draftProductsRaw = Array.isArray(raw?.draftProducts)
    ? raw.draftProducts
      .map((product) => sanitizeShopProduct(product))
      .filter((product) => product.name && Number.isFinite(product.price))
    : [];

  const fallbackCategory = safeCategories[0];
  const products = (productsRaw.length > 0 ? productsRaw : DEFAULT_SHOP_PRODUCTS).map((product) => ({
    ...product,
    category: safeCategories.includes(product.category) ? product.category : fallbackCategory
  }));

  const draftProducts = draftProductsRaw.map((product) => ({
    ...product,
    category: safeCategories.includes(product.category) ? product.category : fallbackCategory
  }));

  return {
    categories: safeCategories,
    products,
    draftProducts
  };
};

const isLegacyDemoCatalog = (rawProducts) => {
  if (!Array.isArray(rawProducts) || rawProducts.length === 0) {
    return false;
  }

  return rawProducts.every((product) => {
    const id = Number(product?.id);
    return Number.isFinite(id) && LEGACY_DEMO_PRODUCT_IDS.has(id);
  });
};

export default function useShopStore({ sessionUser, currentUser, showAlert }) {
  const [isShopReady, setShopReady] = useState(!hasFirebaseConfig);
  const [shopCategories, setShopCategories] = useState(DEFAULT_SHOP_CATEGORIES);
  const [shopProducts, setShopProducts] = useState(DEFAULT_SHOP_PRODUCTS);
  const [shopDraftProducts, setShopDraftProducts] = useState([]);
  const canManageShop = Boolean(
    currentUser?.isAdmin
      || currentUser?.roles?.includes('shop_moderator')
      || currentUser?.roles?.includes('operator')
  );

  useEffect(() => {
    if (!hasFirebaseConfig || !sessionUser || !db) {
      if (!sessionUser) {
        setShopReady(true);
      }
      return;
    }

    const shopRef = doc(db, APP_COLLECTION, SHOP_DOCUMENT_ID);

    const unsubscribe = onSnapshot(
      shopRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          if (canManageShop) {
            const fallback = normalizeShopState({
              categories: DEFAULT_SHOP_CATEGORIES,
              products: DEFAULT_SHOP_PRODUCTS,
              draftProducts: []
            });

            setDoc(
              shopRef,
              {
                categories: fallback.categories,
                products: fallback.products,
                draftProducts: fallback.draftProducts,
                updatedAt: new Date().toISOString()
              },
              { merge: false }
            ).catch(() => {
              showAlert('warning', 'Не вдалося ініціалізувати магазин у базі даних.');
            });
          }

          setShopCategories(DEFAULT_SHOP_CATEGORIES);
          setShopProducts(DEFAULT_SHOP_PRODUCTS);
          setShopDraftProducts([]);
          setShopReady(true);
          return;
        }

        const snapshotData = snapshot.data();
        const normalized = normalizeShopState(snapshotData);

        if (canManageShop && isLegacyDemoCatalog(snapshotData?.products)) {
          setDoc(
            shopRef,
            {
              categories: normalized.categories,
              products: [],
              draftProducts: normalized.draftProducts,
              updatedAt: new Date().toISOString()
            },
            { merge: false }
          ).catch(() => {
            showAlert('warning', 'Не вдалося очистити демонстраційні товари магазину.');
          });

          setShopCategories(normalized.categories);
          setShopProducts([]);
          setShopDraftProducts(normalized.draftProducts);
          setShopReady(true);
          return;
        }

        setShopCategories(normalized.categories);
        setShopProducts(normalized.products);
        setShopDraftProducts(normalized.draftProducts);
        setShopReady(true);
      },
      () => {
        setShopReady(true);
        setShopCategories(DEFAULT_SHOP_CATEGORIES);
        setShopProducts(DEFAULT_SHOP_PRODUCTS);
        setShopDraftProducts([]);
        showAlert('warning', 'Не вдалося завантажити магазин із бази. Використовуються локальні дані.');
      }
    );

    return unsubscribe;
  }, [sessionUser, canManageShop, showAlert]);

  const persistShop = useCallback(
    async ({ categories, products, draftProducts = [], successMessage }) => {
      if (!canManageShop || !db) {
        showAlert('danger', 'Недостатньо прав для зміни магазину.');
        return false;
      }

      const normalized = normalizeShopState({
        categories,
        products,
        draftProducts
      });

      try {
        await setDoc(
          doc(db, APP_COLLECTION, SHOP_DOCUMENT_ID),
          {
            categories: normalized.categories,
            products: normalized.products,
            draftProducts: normalized.draftProducts,
            updatedAt: new Date().toISOString()
          },
          { merge: false }
        );

        if (successMessage) {
          showAlert('success', successMessage);
        }

        return true;
      } catch {
        showAlert('danger', 'Не вдалося зберегти зміни магазину.');
        return false;
      }
    },
    [canManageShop, showAlert]
  );

  return {
    isShopReady,
    shopCategories,
    shopProducts,
    shopDraftProducts,
    persistShop
  };
}
