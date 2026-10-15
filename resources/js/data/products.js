export const products = [
    {
        slug: 'structured-linen-blazer',
        name: 'Structured linen blazer',
        category: 'WOMAN',
        price: 149.9,
        color: 'Natural white',
        image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Model wearing a light neutral tailored jacket',
        label: 'NEW',
    },
    {
        slug: 'fluid-trousers',
        name: 'Fluid wide-leg trousers',
        category: 'WOMAN',
        price: 89.9,
        color: 'Black',
        image: 'https://images.unsplash.com/photo-1506629905607-d9d5c7c54e78?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Black tailored trousers styled for an editorial look',
    },
    {
        slug: 'leather-shoulder-bag',
        name: 'Leather shoulder bag',
        category: 'WOMAN',
        price: 119.9,
        color: 'Dark brown',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Minimal leather shoulder bag',
    },
    {
        slug: 'oversized-cotton-shirt',
        name: 'Oversized cotton shirt',
        category: 'MAN',
        price: 79.9,
        color: 'Sky blue',
        image: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Relaxed light blue cotton shirt',
        label: 'NEW',
    },
    {
        slug: 'textured-knit-polo',
        name: 'Textured knit polo',
        category: 'MAN',
        price: 69.9,
        color: 'Ecru',
        image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Textured knit polo shirt in a light neutral shade',
    },
    {
        slug: 'soft-leather-loafers',
        name: 'Soft leather loafers',
        category: 'MAN',
        price: 139.9,
        color: 'Black',
        image: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Classic black leather loafers',
    },
    {
        slug: 'draped-midi-dress',
        name: 'Draped midi dress',
        category: 'STUDIO',
        price: 179.9,
        color: 'Deep burgundy',
        image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Elegant draped evening dress',
        label: 'LIMITED EDITION',
    },
    {
        slug: 'sculptural-earrings',
        name: 'Sculptural earrings',
        category: 'STUDIO',
        price: 49.9,
        color: 'Gold',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85',
        imageAlt: 'Sculptural gold-tone earrings',
    },
];

export const categories = ['WOMAN', 'MAN', 'STUDIO'];

export function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(price);
}
