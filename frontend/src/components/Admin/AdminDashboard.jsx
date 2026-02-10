import { useState } from 'react';
import PartManager from './PartManager';
import OrderManager from './OrderManager';
import { exportData, importData } from '../../utils/storage';

const AdminDashboard = ({ data, onUpdateData, onClose }) => {
    const [tab, setTab] = useState('parts');

    const resetStats = () => {
        if (window.confirm('統計情報をリセットしてもよろしいですか？')) {
            onUpdateData({ ...data, stats: {} });
        }
    };

    // 統計情報の集計
    const statsList = data.orderMasters
        .map(order => ({
            ...order,
            errorCount: data.stats?.[order.id] || 0
        }))
        .filter(item => item.errorCount > 0)
        .sort((a, b) => b.errorCount - a.errorCount);

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <button className="close-btn" onClick={onClose}>← クイズに戻る</button>
                <h2>管理設定</h2>
            </header>

            <nav className="admin-tabs">
                <button className={tab === 'parts' ? 'active' : ''} onClick={() => setTab('parts')}>パーツ</button>
                <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>注文セット</button>
                <button className={tab === 'stats' ? 'active' : ''} onClick={() => setTab('stats')}>統計</button>
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
                {tab === 'stats' && (
                    <div className="manager-pane">
                        <div className="pane-header">
                            <h3>苦手な注文ランキング</h3>
                            <button className="reset-btn" onClick={resetStats}>統計をリセット</button>
                        </div>
                        <div className="stats-list">
                            {statsList.length === 0 ? (
                                <p className="empty-msg">まだ間違いのデータがありません。</p>
                            ) : (
                                statsList.map((item, idx) => (
                                    <div key={item.id} className="stats-item">
                                        <div className="rank">#{idx + 1}</div>
                                        <div className="info">
                                            <div className="name">{item.displayName}</div>
                                            <div className="count">間違い: {item.errorCount}回</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
                {tab === 'data' && (
                    <div className="manager-pane">
                        <h3>バックアップと復元</h3>
                        <p className="description">現在のすべての設定（画像、パーツ、統計情報含む）を保存または復元します。</p>
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
