import { useState } from 'react';

const CategoryManager = ({ partCategories, orderCategories, onUpdatePartCategories, onUpdateOrderCategories }) => {
    const [newPartCategory, setNewPartCategory] = useState('');
    const [newOrderCategory, setNewOrderCategory] = useState('');

    const addPartCategory = () => {
        if (!newPartCategory.trim()) return;
        if (partCategories.includes(newPartCategory.trim())) {
            alert('このカテゴリは既に存在します');
            return;
        }
        onUpdatePartCategories([...partCategories, newPartCategory.trim()]);
        setNewPartCategory('');
    };

    const addOrderCategory = () => {
        if (!newOrderCategory.trim()) return;
        if (orderCategories.includes(newOrderCategory.trim())) {
            alert('このカテゴリは既に存在します');
            return;
        }
        onUpdateOrderCategories([...orderCategories, newOrderCategory.trim()]);
        setNewOrderCategory('');
    };

    const removePartCategory = (cat) => {
        if (window.confirm(`カテゴリ「${cat}」を削除しますか？\n※このカテゴリに属するパーツは「未分類」になります。`)) {
            onUpdatePartCategories(partCategories.filter(c => c !== cat));
        }
    };

    const removeOrderCategory = (cat) => {
        if (window.confirm(`カテゴリ「${cat}」を削除しますか？\n※このカテゴリに属する注文セットは「未分類」になります。`)) {
            onUpdateOrderCategories(orderCategories.filter(c => c !== cat));
        }
    };

    return (
        <div className="manager-pane category-manager">
            <div className="category-section">
                <h3>パーツカテゴリ管理</h3>
                <div className="category-input-group">
                    <input
                        value={newPartCategory}
                        onChange={e => setNewPartCategory(e.target.value)}
                        placeholder="新しいパーツカテゴリ名"
                    />
                    <button onClick={addPartCategory}>追加</button>
                </div>
                <div className="category-tag-list">
                    {partCategories.map(cat => (
                        <div key={cat} className="category-tag">
                            <span>{cat}</span>
                            <button className="remove-tag" onClick={() => removePartCategory(cat)}>×</button>
                        </div>
                    ))}
                    {partCategories.length === 0 && <p className="empty-msg">登録されているカテゴリはありません</p>}
                </div>
            </div>

            <hr className="divider" />

            <div className="category-section">
                <h3>注文カテゴリ管理</h3>
                <div className="category-input-group">
                    <input
                        value={newOrderCategory}
                        onChange={e => setNewOrderCategory(e.target.value)}
                        placeholder="新しい注文カテゴリ名"
                    />
                    <button onClick={addOrderCategory}>追加</button>
                </div>
                <div className="category-tag-list">
                    {orderCategories.map(cat => (
                        <div key={cat} className="category-tag">
                            <span>{cat}</span>
                            <button className="remove-tag" onClick={() => removeOrderCategory(cat)}>×</button>
                        </div>
                    ))}
                    {orderCategories.length === 0 && <p className="empty-msg">登録されているカテゴリはありません</p>}
                </div>
            </div>
        </div>
    );
};

export default CategoryManager;
