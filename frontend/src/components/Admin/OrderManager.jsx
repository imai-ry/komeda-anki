import { useState } from 'react';

const OrderManager = ({ orderMasters, parts, onUpdate }) => {
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ displayName: '', shortName: '', requiredPartIds: [] });

    const handleEdit = (order) => {
        setEditingId(order.id);
        setForm(order);
    };

    const handleCreate = () => {
        setEditingId('new');
        setForm({ displayName: '', shortName: '', requiredPartIds: [] });
    };

    const togglePart = (partId) => {
        const current = [...form.requiredPartIds];
        if (current.includes(partId)) {
            setForm({ ...form, requiredPartIds: current.filter(id => id !== partId) });
        } else {
            setForm({ ...form, requiredPartIds: [...current, partId] });
        }
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

    return (
        <div className="manager-pane">
            <h3>注文セット管理 ({orderMasters.length})</h3>
            <button className="add-btn" onClick={handleCreate}>新規作成</button>

            {editingId && (
                <div className="modal-overlay">
                    <div className="modal order-modal">
                        <h4>{editingId === 'new' ? '注文セット新規登録' : '注文セット編集'}</h4>
                        <div className="form-group">
                            <label>注文名称（フルネーム）</label>
                            <input value={form.displayName} onChange={e => setForm({ ...form, displayName: e.target.value })} placeholder="例: コメダブレンド" />
                        </div>
                        <div className="form-group">
                            <label>略称（注文伝票用）</label>
                            <input value={form.shortName} onChange={e => setForm({ ...form, shortName: e.target.value })} placeholder="例: ホット" />
                        </div>
                        <div className="form-group">
                            <label>正解パーツを選択</label>
                            <div className="part-selector">
                                {parts.map(part => (
                                    <div
                                        key={part.id}
                                        className={`selector-item ${form.requiredPartIds.includes(part.id) ? 'active' : ''}`}
                                        onClick={() => togglePart(part.id)}
                                    >
                                        <img src={part.image} alt="" />
                                        <span>{part.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleSave}>保存</button>
                            <button onClick={() => setEditingId(null)}>キャンセル</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="order-list-admin">
                {orderMasters.map(order => (
                    <div key={order.id} className="order-list-item">
                        <div className="info">
                            <div className="name">{order.displayName} ({order.shortName})</div>
                            <div className="details">パーツ数: {order.requiredPartIds.length}</div>
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
