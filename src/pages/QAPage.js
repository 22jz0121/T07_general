import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import '../css/QAPage.css';

function QAPage() {
    const navigate = useNavigate();
    const [faqData, setFaqData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://loopplus.mydns.jp/qa');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setFaqData(data);
            } catch (error) {
                setError(error.message);
            }
            finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }


    return (
        <div className="qa-page">
            <div className="top-navigation">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <ArrowBackIcon className="back-icon" />
                </button>
                <h1 className="page-title">Q&A</h1>
            </div>
            {loading ? (
                <div className='loading'>
                    <img src='/Loading.gif' alt="Loading"/>
                </div>
            ) : (
                <div className="faq-section">
                    {faqData.map((faq, index) => (
                        <div key={index} className="faq-item">
                            <h3 className="faq-question">{faq.QuestionContent}</h3>
                            <p className="faq-answer">{faq.AnswerContent}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default QAPage;
