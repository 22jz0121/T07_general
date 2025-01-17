// QAadd.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import './QAadd.css';

function QAadd({ addQuestion }) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // バリデーションチェック
    if (!question.trim() || !answer.trim()) {
      alert('質問と回答を入力してください。');
      return;
    }

    try {
      const response = await fetch('https://loopplus.mydns.jp/api/qa/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          QuestionContent: question,
          AnswerContent: answer,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Q&Aの追加に失敗しました');
      }

      const responseData = await response.json();
      console.log('Q&A追加成功:', responseData);

      // 新しい質問を親コンポーネントに渡す
      if (addQuestion) {
        const newQuestion = {
          id: responseData.id || Date.now(),
          question: question,
          answer: answer,
        };
        addQuestion(newQuestion);
      }

      navigate('/qalist');
    } catch (error) {
      console.error('Error adding Q&A:', error);
      alert(`質問の追加に失敗しました: ${error.message}`);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="columnBrake">
        <Sidebar />
        <div className="mainbody">
          <div className="qaedit-form">
            <h2>新しい質問追加</h2>
            <form onSubmit={handleSubmit} className="qaedit-question-form">
              <div className="qaedit-question">
                <label>質問</label>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="質問を入力"
                  required
                />
              </div>
              <div className="qaedit-question">
                <label>回答</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="回答を入力"
                  required
                />
              </div>
              <div className="qaedit-button">
                <button type="submit">追加する</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QAadd;
