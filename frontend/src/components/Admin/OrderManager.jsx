import { useState } from 'react';
import { CATEGORIES } from '../../data/menu';

const OrderManager = ({ orderMasters, parts, onUpdate }) => {
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ displayName: '', shortName: '', category: Object.values(CATEGORIES)[0], requiredPartIds: [] });
    const [activeCategory, setActiveCategory] = useState(Object.values(CATEGORIES)[0]);
    const [activePartCategory, setActivePartCategory] = useState(Object.values(CATEGORIES)[0]);

    const handleEdit = (order) => {
        setEditingId(order.id);
        setForm(order);
    };

    const handleCreate = () => {
        setEditingId('new');
        setForm({ displayName: '', shortName: '', category: activeCategory, requiredPartIds: [] });
    };

    const addPartToOrder = (partId) => {
        setForm({ ...form, requiredPartIds: [...form.requiredPartIds, partId] });
    };

    const removePartAt = (index) => {
        const next = [...form.requiredPartIds];
        next.splice(index, 1);
        setForm({ ...form, requiredPartIds: next });
    };

    const handleSave = () => {
        let newMasters;
        if (editingId === 'new') {
            newMasters = [...orderMasters, { ...form, id: Date.now().toString() }];
        } else {
            newMasters = orderMasters.map(o => o.id === editingId ? form : o);
        }
        onUpdate(newMasters);
        setEditingId(null);
    };

    const handleDelete = (id) => {
        if (window.confirm('この注文セットを削除しますか？')) {
            onUpdate(orderMasters.filter(o => o.id !== id));
        }
    };

    const filteredOrders = orderMasters.filter(o => (o.category || Object.values(CATEGORIES)[0]) === activeCategory);

    return (
        <div className="manager-pane">
            <div className="pane-header-with-tabs">
                <h3>注文セット管理 ({orderMasters.length})</h3>
                <div className="admin-category-tabs">
                    {Object.values(CATEGORIES).map(cat => (
                        <button
                            key={cat}
                            className={activeCategory === cat ? 'active' : ''}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <button className="add-btn" onClick={handleCreate}>新規作成</button>
            </div>

            {editingId && (
                <div className="modal-overlay">
                    <div className="modal order-modal-redesign">
                        <header className="modal-header-lite">
                            <h4>{editingId === 'new' ? '注文セット新規登録' : '注文セット編集'}</h4>
                        </header>

                        <div className="modal-scroll-content">
                            <div className="form-group-row">
                                <div className="form-group">
                                    <label>注文名称</label>
                                    <input value={form.displayName} onChange={e => setForm({ ...form, displayName: e.target.value })} placeholder="例: コメダブレンド" />
                                </div>
                                <div className="form-group">
                                    <label>伝票略称</label>
                                    <input value={form.shortName} onChange={e => setForm({ ...form, shortName: e.target.value })} placeholder="例: ホット" />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>表示カテゴリ</label>
                                <select value={form.category || Object.values(CATEGORIES)[0]} onChange={e => setForm({ ...form, category: e.target.value })}>
                                    {Object.values(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="editor-tray-section">
                                <label>現在の構成（タップで削除）</label>
                                <div className="tray-preview-lite">
                                    {form.requiredPartIds.length === 0 && <p className="empty-hint">パーツを選択してください</p>}
                                    {form.requiredPartIds.map((id, idx) => {
                                        const part = parts.find(p => p.id === id);
                                        return (
                                            <div key={idx} className="tray-item-lite" onClick={() => removePartAt(idx)}>
                                                <img src={part?.image} alt="" />
                                                <span>{part?.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="editor-selection-section">
                                <label>パーツを選択（タップして追加）</label>
                                <div className="category-tabs-lite">
                                    {Object.values(CATEGORIES).map(cat => (
                                        <button
                                            key={cat}
                                            className={activePartCategory === cat ? 'active' : ''}
                                            onClick={() => setActivePartCategory(cat)}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                                <div className="parts-grid-lite">
                                    {parts.filter(p => p.category === activePartCategory).map(part => (
                                        <div
                                            key={part.id}
                                            className="menu-card-lite"
                                            onClick={() => addPartToOrder(part.id)}
                                        >
                                            <div className="menu-image-lite">
                                                <img src={part.image} alt="" />
                                            </div>
                                            <div className="menu-name-lite">{part.name}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="save-btn" onClick={handleSave}>保存</button>
                            <button className="cancel-btn" onClick={() => setEditingId(null)}>キャンセル</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="order-list-admin">
                {filteredOrders.length === 0 && <p className="empty-msg">このカテゴリに注文セットはありません</p>}
                {filteredOrders.map(order => (
                    <div key={order.id} className="order-list-item">
                        <div className="info">
                            <div className="name">{order.displayName} ({order.shortName})</div>
                            <div className="details">カテゴリ: {order.category || '未設定'} / パーツ数: {order.requiredPartIds.length}</div>
                        </div>
                        <div className="actions">
                            <button onClick={() => handleEdit(order)}>編</button>
                            <button onClick={() => handleDelete(order.id)}>削</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderManager;
