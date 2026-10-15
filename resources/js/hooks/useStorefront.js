import { useEffect, useState } from 'react';

const isCart = (value) =>
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.entries(value).every(
        ([key, quantity]) =>
            typeof key === 'string' &&
            Number.isInteger(quantity) &&
            quantity > 0,
    );
const isWishlist = (value) =>
    Array.isArray(value) && value.every((slug) => typeof slug === 'string');

function readStoredValue(key, fallback) {
    try {
        const storedValue = window.localStorage.getItem(key);

        return storedValue ? JSON.parse(storedValue) : fallback;
    } catch (error) {
        console.error(`Unable to read ${key} from local storage.`, error);

        return fallback;
    }
}

function usePersistedState(key, fallback, isValid) {
    const [value, setValue] = useState(() => {
        if (typeof window === 'undefined') {
            return fallback;
        }

        const storedValue = readStoredValue(key, fallback);

        if (!isValid(storedValue)) {
            console.error(`Stored ${key} data has an invalid format.`);

            return fallback;
        }

        return storedValue;
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Unable to save ${key} to local storage.`, error);
        }

        window.dispatchEvent(
            new CustomEvent('omnishop:storage', { detail: { key, value } }),
        );
    }, [key, value]);

    useEffect(() => {
        const updateFromStorage = (event) => {
            if (event.key === key) {
                if (event.newValue === null) {
                    setValue(fallback);

                    return;
                }

                try {
                    const nextValue = JSON.parse(event.newValue);

                    if (isValid(nextValue)) {
                        setValue(nextValue);
                    } else {
                        console.error(
                            `Stored ${key} data has an invalid format.`,
                        );
                    }
                } catch (error) {
                    console.error(`Unable to read ${key} from local storage.`, error);
                }
            }
        };
        const updateFromPage = (event) => {
            if (event.detail.key === key && isValid(event.detail.value)) {
                setValue(event.detail.value);
            }
        };

        window.addEventListener('storage', updateFromStorage);
        window.addEventListener('omnishop:storage', updateFromPage);

        return () => {
            window.removeEventListener('storage', updateFromStorage);
            window.removeEventListener('omnishop:storage', updateFromPage);
        };
    }, [fallback, isValid, key]);

    return [value, setValue];
}

export default function useStorefront() {
    const [cart, setCart] = usePersistedState(
        'omnishop-cart',
        {},
        isCart,
    );
    const [wishlist, setWishlist] = usePersistedState(
        'omnishop-wishlist',
        [],
        isWishlist,
    );

    const addToCart = (slug, quantity = 1, size = '') => {
        const itemKey = size ? `${slug}::${size}` : slug;

        setCart((currentCart) => ({
            ...currentCart,
            [itemKey]: (currentCart[itemKey] ?? 0) + quantity,
        }));
    };

    const setQuantity = (slug, quantity) => {
        setCart((currentCart) => {
            if (quantity <= 0) {
                const nextCart = { ...currentCart };
                delete nextCart[slug];

                return nextCart;
            }

            return { ...currentCart, [slug]: quantity };
        });
    };

    const removeFromCart = (slug) => setQuantity(slug, 0);

    const toggleWishlist = (slug) => {
        setWishlist((currentWishlist) =>
            currentWishlist.includes(slug)
                ? currentWishlist.filter((item) => item !== slug)
                : [...currentWishlist, slug],
        );
    };

    return {
        cart,
        cartCount: Object.values(cart).reduce(
            (total, quantity) => total + quantity,
            0,
        ),
        wishlist,
        addToCart,
        setQuantity,
        removeFromCart,
        toggleWishlist,
    };
}
