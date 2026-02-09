import { useState, useEffect, useCallback } from 'react';
import { INITIAL_DATA, CATEGORIES } from './data/menu';
import { loadData, saveData } from './utils/storage';
import AdminDashboard from './components/Admin/AdminDashboard';

function App() {
  const [data, setData] = useState(null);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [selections, setSelections] = useState({}); // { orderIndex: [parts] }
  const [activeOrderIndex, setActiveOrderIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeCategory, setActiveCategory] = useState(Object.values(CATEGORIES)[0]);

  // 初期化ロード
  useEffect(() => {
    const loaded = loadData(INITIAL_DATA);
    setData(loaded);
  }, []);

  const onUpdateData = (newData) => {
    setData(newData);
    saveData(newData);
  };

  // 注文生成
  const generateQuestion = useCallback(() => {
    if (!data || data.orderMasters.length === 0) return;
    const count = Math.floor(Math.random() * 3) + 1;
    const orders = [];
    for (let i = 0; i < count; i++) {
      orders.push(data.orderMasters[Math.floor(Math.random() * data.orderMasters.length)]);
    }
    setCurrentOrders(orders);
    setSelections({});
    setActiveOrderIndex(0);
    setFeedback(null);
  }, [data]);

  useEffect(() => {
    if (data && currentOrders.length === 0) {
      generateQuestion();
    }
  }, [data, currentOrders.length, generateQuestion]);

  const addPart = (part) => {
    const currentParts = selections[activeOrderIndex] || [];
    setSelections({
      ...selections,
      [activeOrderIndex]: [...currentParts, { ...part, instanceId: Date.now() + Math.random() }]
    });
  };

  const removePartAtIndex = (orderIdx, partIdx) => {
    const currentParts = selections[orderIdx] || [];
    setSelections({
      ...selections,
      [orderIdx]: currentParts.filter((_, i) => i !== partIdx)
    });
  };

  const handleServe = () => {
    if (!data) return;

    let allCorrect = true;
    const detailedAnswers = currentOrders.map((order, idx) => {
      const requiredIds = [...order.requiredPartIds];
      const selectedPartsForOrder = selections[idx] || [];
      const selectedIds = selectedPartsForOrder.map(p => p.id);

      const countById = (arr) => arr.reduce((acc, id) => {
        acc[id] = (acc[id] || 0) + 1;
        return acc;
      }, {});

      const reqCounts = countById(requiredIds);
      const selCounts = countById(selectedIds);

      const isOrderCorrect =
        Object.keys(reqCounts).length === Object.keys(selCounts).length &&
        Object.keys(reqCounts).every(id => reqCounts[id] === selCounts[id]);

      if (!isOrderCorrect) allCorrect = false;

      return {
        displayName: order.displayName,
        shortName: order.shortName,
        requiredParts: order.requiredPartIds.map(id => data.parts.find(p => p.id === id)?.name || '未定義'),
        isCorrect: isOrderCorrect
      };
    });

    setFeedback({
      status: allCorrect ? 'success' : 'error',
      message: allCorrect ? 'すべてのセットが正解です！' : '一部のセットが間違っています。',
      answers: detailedAnswers
    });
  };

  const nextQuestion = () => {
    generateQuestion();
  };

  if (!data) return <div className="loading">ロード中...</div>;

  if (isAdmin) {
    return <AdminDashboard data={data} onUpdateData={onUpdateData} onClose={() => setIsAdmin(false)} />;
  }

  const activeParts = selections[activeOrderIndex] || [];

  return (
    <div className="app">
      <header>
        <h1>コメダセット暗記</h1>
        <button className="admin-toggle" onClick={() => setIsAdmin(true)}>⚙️</button>
      </header>

      <main>
        <section className="order-section scrollable-orders">
          <div className="receipt-title">注文伝票（タップして選択）</div>
          <div className="order-grid">
            {currentOrders.map((order, idx) => (
              <div
                key={idx}
                className={`order-card ${activeOrderIndex === idx ? 'active' : ''} ${selections[idx]?.length > 0 ? 'furnished' : ''}`}
                onClick={() => setActiveOrderIndex(idx)}
              >
                <div className="order-header">
                  <span className="order-num">{idx + 1}</span>
                  <span className="order-name">{order.displayName}</span>
                </div>
                <div className="mini-tray">
                  {selections[idx]?.map((p, pIdx) => (
                    <img key={p.instanceId || pIdx} src={p.image} className="mini-part" alt="" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="tray-section">
          <div className="tray-header">
            選択中: 注文 {activeOrderIndex + 1} のトレイ
          </div>
          <div className="tray-items">
            {activeParts.length === 0 && <div className="tray-placeholder">アイテムをタップして追加</div>}
            {activeParts.map((part, index) => (
              <div key={part.instanceId || index} className="tray-item" onClick={() => removePartAtIndex(activeOrderIndex, index)}>
                <img src={part.image} alt="" />
                <span>{part.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="selection-area">
          <div className="category-tabs">
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
          <div className="parts-grid">
            {data.parts.filter(p => p.category === activeCategory).map(part => (
              <div
                key={part.id}
                className="menu-card"
                onClick={() => addPart(part)}
              >
                <div className="menu-image">
                  <img src={part.image} alt="" />
                </div>
                <div className="menu-name">{part.name}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        {feedback ? (
          <button className="serve-button next-btn" onClick={nextQuestion}>次へ進む</button>
        ) : (
          <button className="serve-button" onClick={handleServe}>提供 (Serve)</button>
        )}
      </footer>

      {feedback && (
        <div className={`feedback-overlay ${feedback.status}`}>
          <div className="feedback-content full-feedback">
            <div className="feedback-status-icon">{feedback.status === 'success' ? '✅' : '❌'}</div>
            <h2>{feedback.message}</h2>

            <div className="answers-box">
              <h3>判定結果:</h3>
              {feedback.answers.map((ans, i) => (
                <div key={i} className={`answer-item-row ${ans.isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="order-label">
                    {ans.isCorrect ? '◯' : '×'} {ans.displayName}
                  </div>
                  <div className="parts-label">正解: {ans.requiredParts.join(' / ')}</div>
                </div>
              ))}
            </div>

            <button className="modal-next-btn" onClick={nextQuestion}>次へ進む</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
