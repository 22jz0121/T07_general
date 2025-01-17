import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import './QAList.css';

function QAList() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('https://loopplus.mydns.jp/api/qa');
        if (!response.ok) {
          throw new Error('データの取得に失敗しました');
        }
        const data = await response.json();
        const formattedQuestions = data.map(q => ({
          id: q.QuestionID,
          question: q.QuestionContent,
          answer: q.AnswerContent,
          displayFlag: q.DisplayFlag // DisplayFlagを保存
        }));

        // Sort questions by QuestionID in descending order (newest first)
        formattedQuestions.sort((a, b) => b.id - a.id);

        setQuestions(formattedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        alert(error.message);
      }
    };

    fetchQuestions();
  }, []);

  const handleHide = async (id) => {
    const confirmed = window.confirm('この質問を削除しますか？');
    if (!confirmed) return;

    try {
      const response = await fetch(`https://loopplus.mydns.jp/api/qa/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ DisplayFlag: 0 }), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '削除に失敗しました');
      }

      setQuestions(prevQuestions =>
        prevQuestions.map(q =>
          q.id === id ? { ...q, displayFlag: 0 } : q
        )
      );
      alert('質問が削除されました。');
    } catch (error) {
      console.error('Error hiding question:', error);
      alert(error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="columnBrake">
        <Sidebar />
        <div className='mainbody'>
          <h1>Q&A管理</h1>
          <div className="qa-list">
            <div className='add-delete-button'>
              <button className="add-button" onClick={() => navigate('/qaadd')}>
                ＋ 質問を追加
              </button>
            </div>
            <ul className="question-list">
              {questions.length > 0 ? (
                questions.filter(q => q.displayFlag === 1).map(q => (
                  <li key={q.id} className="question-item">
                    <div className="qa-content">
                      <p><strong>{q.question}</strong></p>
                      <p>{q.answer}</p>
                    </div>
                    <button className="delete-button" onClick={() => handleHide(q.id)}>削除</button>
                  </li>
                ))
              ) : (
                <li>質問がありません。</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QAList;
