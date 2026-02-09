export const CATEGORIES = {
    DRINK: 'ドリンク',
    FOOD: 'フード',
    SNACK: 'サイド・スナック',
    PLATE: '皿・食器',
};

// Initial parts data
export const INITIAL_PARTS = [
    {
        id: 'komeda-coffee',
        name: 'コメダ珈琲',
        shortName: 'ホット',
        category: CATEGORIES.DRINK,
        image: '/images/komeda-coffee.png',
    },
    {
        id: 'ice-coffee',
        name: 'アイスコーヒー',
        shortName: 'アイス',
        category: CATEGORIES.DRINK,
        image: '/images/ice-coffee.png',
    },
    {
        id: 'bean-snack',
        name: '豆菓子',
        shortName: 'マメ',
        category: CATEGORIES.SNACK,
        image: '/images/bean-snack.png',
    },
    {
        id: 'coffee-cup-plate',
        name: 'コーヒーカップ用ソーサー',
        shortName: 'ソーサー',
        category: CATEGORIES.PLATE,
        image: '/images/saucer.png',
    },
    {
        id: 'ice-coffee-cup-plate',
        name: 'アイスコーヒー用コースター',
        shortName: 'コースター',
        category: CATEGORIES.PLATE,
        image: '/images/coaster.png',
    },
    {
        id: 'shiro-noir',
        name: 'シロノワール',
        shortName: 'シロ',
        category: CATEGORIES.FOOD,
        image: '/images/shiro-noir.png',
    },
    {
        id: 'fork',
        name: 'フォーク',
        shortName: 'フォーク',
        category: CATEGORIES.SNACK,
        image: '/images/fork.png',
    },
    {
        id: 'dessert-plate',
        name: '中皿',
        shortName: '中皿',
        category: CATEGORIES.PLATE,
        image: '/images/plate-medium.png',
    }
];

// Initial order masters (Answers)
export const INITIAL_ORDER_MASTERS = [
    {
        id: 'order-1',
        displayName: 'コメダ珈琲',
        shortName: 'ホット',
        requiredPartIds: ['komeda-coffee', 'bean-snack', 'coffee-cup-plate']
    },
    {
        id: 'order-2',
        displayName: 'アイスコーヒー',
        shortName: 'アイス',
        requiredPartIds: ['ice-coffee', 'bean-snack', 'ice-coffee-cup-plate']
    },
    {
        id: 'order-3',
        displayName: 'シロノワール',
        shortName: 'シロ',
        requiredPartIds: ['shiro-noir', 'fork', 'dessert-plate']
    }
];

export const INITIAL_DATA = {
    parts: INITIAL_PARTS,
    orderMasters: INITIAL_ORDER_MASTERS
};
