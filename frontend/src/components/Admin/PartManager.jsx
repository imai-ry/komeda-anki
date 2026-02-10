import { useState } from 'react';
import { resizeImage } from '../../utils/image';

const PartManager = ({ parts, categoryList, onUpdate }) => {
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: '', category: '', image: '' });

    // Derive dynamic categories (pre-defined + any already in parts)
    const categories = Array.from(new Set([...categoryList, ...parts.map(p => p.category || '未分類')]));
    const [activeCategory, setActiveCategory] = useState(categories[0] || '未分類');

    const handleEdit = (part) => {
        setEditingId(part.id);
        setForm({ ...part, category: part.category || '' });
    };

    const handleCreate = () => {
        setEditingId('new');
        setForm({ name: '', category: activeCategory === '未分類' ? '' : activeCategory, image: '' });
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64 = await resizeImage(file);
            setForm({ ...form, image: base64 });
        }
    };

    const handleSave = () => {
        let newParts;
        const finalForm = { ...form, category: form.category.trim() };
        if (editingId === 'new') {
            newParts = [...parts, { ...finalForm, id: Date.now().toString() }];
        } else {
            newParts = parts.map(p => p.id === editingId ? finalForm : p);
        }
        onUpdate(newParts);
        setEditingId(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('このパーツを削除しますか？')) {
            onUpdate(parts.filter(p => p.id !== id));
        }
    };

    const filteredParts = parts.filter(p => (p.category || '未分類') === activeCategory);

    return (
        <div className="manager-pane">
            <div className="pane-header-with-tabs">
                <h3>パーツ管理 ({parts.length})</h3>
                <div className="admin-category-tabs">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={activeCategory === cat ? 'active' : ''}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <button className="add-btn" onClick={handleCreate}>新規登録</button>
            </div>

            {editingId && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h4>{editingId === 'new' ? 'パーツ新規登録' : 'パーツ編集'}</h4>
                        <div className="form-group">
                            <label>名称</label>
                            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="例: コーヒーカップ" />
                        </div>
                        <div className="form-group">
                            <label>カテゴリ</label>
                            <select
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                            >
                                <option value="">未分類</option>
                                {categoryList.map(c => <option key={c} value={c}>{c}</option>)}
                                {form.category && !categoryList.includes(form.category) && (
                                    <option value={form.category}>{form.category} (削除済み)</option>
                                )}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>画像</label>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            {form.image && <img src={form.image} className="preview-img" />}
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleSave}>保存</button>
                            <button onClick={() => setEditingId(null)}>キャンセル</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="parts-list">
                {filteredParts.length === 0 && <p className="empty-msg">このカテゴリにパーツはありません</p>}
                {filteredParts.map(part => (
                    <div key={part.id} className="part-list-item">
                        <img src={part.image} alt="" />
                        <div className="info">
                            <div className="name">{part.name}</div>
                            <div className="short">{part.category || '未分類'}</div>
                        </div>
                        <div className="actions">
                            <button onClick={() => handleEdit(part)}>編</button>
                            <button onClick={() => handleDelete(part.id)}>削</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PartManager;
