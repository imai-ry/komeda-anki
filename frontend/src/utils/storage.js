const STORAGE_KEY = 'komeda_anki_data';

export const loadData = (initialData) => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
        saveData(initialData);
        return initialData;
    }
    const data = JSON.parse(saved);
    // Migration: ensure category lists exist
    if (!data.partCategories) data.partCategories = initialData.partCategories || [];
    if (!data.orderCategories) data.orderCategories = initialData.orderCategories || [];
    return data;
};

export const saveData = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const exportData = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `komeda-anki-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
};

export const importData = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                saveData(data);
                resolve(data);
            } catch (err) {
                reject(err);
            }
        };
        reader.readAsText(file);
    });
};
