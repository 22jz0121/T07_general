import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import '../css/QAPage.css';

function QAPage() {
    const navigate = useNavigate();

    const faqData = [
        {
            question: 'アカウントを作成するにはどうすればいいですか？',
            answer: 'トップページから「サインアップ」をクリックし、必要な情報を入力してください。',
        },
        {
            question: 'パスワードを忘れた場合は？',
            answer: 'ログイン画面で「パスワードを忘れた場合」をクリックし、再設定してください。',
        },
        {
            question: '取引手続きはどのように行うのですか？',
            answer: '商品ページから「取引手続き」を選択し、出品者と直接メッセージを送ることができます。',
        },
    ];

    return (
        <div className="qa-page">
            {/* Top Navigation */}
            <div className="top-navigation">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowBackIcon className="back-icon" />
                </button>
                <h1 className="page-title">Q&A</h1>
            </div>

            {/* FAQ Section */}
            <div className="faq-section">
                {faqData.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <h3 className="faq-question">{faq.question}</h3>
                        <p className="faq-answer">{faq.answer}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default QAPage;
