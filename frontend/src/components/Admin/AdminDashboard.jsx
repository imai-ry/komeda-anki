import { useState } from 'react';
import PartManager from './PartManager';
import OrderManager from './OrderManager';
import { exportData, importData } from '../../utils/storage';

const AdminDashboard = ({ data, onUpdateData, onClose }) => {
    const [tab, setTab] = useState('parts');

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <button className="close-btn" onClick={onClose}>← クイズに戻る</button>
                <h2>管理設定</h2>
            </header>

            <nav className="admin-tabs">
                <button className={tab === 'parts' ? 'active' : ''} onClick={() => setTab('parts')}>パーツ</button>
                <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>注文セット</button>
                <button className={tab === 'data' ? 'active' : ''} onClick={() => setTab('data')}>データ</button>
            </nav>

            <div className="admin-content">
                {tab === 'parts' && (
                    <PartManager
                        parts={data.parts}
                        onUpdate={(newParts) => onUpdateData({ ...data, parts: newParts })}
                    />
                )}
                {tab === 'orders' && (
                    <OrderManager
                        orderMasters={data.orderMasters}
                        parts={data.parts}
                        onUpdate={(newOrders) => onUpdateData({ ...data, orderMasters: newOrders })}
                    />
                )}
                {tab === 'data' && (
                    <div className="manager-pane">
                        <h3>バックアップと復元</h3>
                        <p className="description">現在のすべての設定（画像、パーツ、注文セット）を保存または復元します。</p>
                        <div className="data-actions">
                            <button className="action-btn" onClick={exportData}>バックアップをダウンロード</button>
                            <div className="import-box">
                                <label>復元（JSONファイルを選択）</label>
                                <input type="file" accept=".json" onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        try {
                                            const newData = await importData(file);
                                            onUpdateData(newData);
                                            alert('復元が完了しました。');
                                        } catch (err) {
                                            alert('エラー: ファイルが正しくありません。');
                                        }
                                    }
                                }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
