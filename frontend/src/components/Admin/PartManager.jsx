import { useState } from 'react';
import { CATEGORIES } from '../../data/menu';
import { resizeImage } from '../../utils/image';

const PartManager = ({ parts, onUpdate }) => {
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ name: '', category: '皿・食器', image: '' });

    const handleEdit = (part) => {
        setEditingId(part.id);
        setForm(part);
    };

    const handleCreate = () => {
        setEditingId('new');
        setForm({ name: '', category: '皿・食器', image: '' });
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
        if (editingId === 'new') {
            newParts = [...parts, { ...form, id: Date.now().toString() }];
        } else {
            newParts = parts.map(p => p.id === editingId ? form : p);
        }
        onUpdate(newParts);
        setEditingId(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('このパーツを削除しますか？')) {
            onUpdate(parts.filter(p => p.id !== id));
        }
    };

    return (
        <div className="manager-pane">
            <h3>パーツ管理 ({parts.length})</h3>
            <button className="add-btn" onClick={handleCreate}>新規作成</button>

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
                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                {Object.values(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
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
                {parts.map(part => (
                    <div key={part.id} className="part-list-item">
                        <img src={part.image} alt="" />
                        <div className="info">
                            <div className="name">{part.name}</div>
                            <div className="short">{part.category}</div>
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
