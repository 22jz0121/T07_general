import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  Favorite,
  FavoriteBorder,
  Send as SendIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import '../css/RequestDetail.css';

function RequestDetail() {
  const { id } = useParams(); // URLからリクエストIDを取得
  const navigate = useNavigate();

  // 状態管理
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);

  // リクエスト詳細データを取得
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await fetch(`https://loopplus.mydns.jp/request/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch request details');
        }
        const data = await response.json();
        setRequest(data);
        setLiked(data.isLiked); // サーバーからの初期いいね状態を反映
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRequestDetails();
  }, [id]);

  const toggleLike = () => {
    setLiked(!liked);
    // 必要に応じてバックエンドにlike状態を更新するリクエストを送信
  };

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const newCommentEntry = {
        id: Date.now(),
        name: '自分の名前', // ユーザー名を動的に取得する必要がある
        text: newComment,
        time: '今',
        isUser: true,
      };
      setComments([...comments, newCommentEntry]);
      setNewComment('');
    }
  };

  if (loading) {
    return <div className='loading'><img src='/Loading.gif' alt="Loading"/></div>;  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="request-detail-container">
      {/* トップナビゲーション */}
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">リクエスト</h1>
      </div>

      {/* メインリクエスト詳細 */}
      {request && (
        <div className="request-item">
          <div className="profile">
            <AccountCircleIcon className="avatar-icon" style={{ fontSize: '36px' }} />
            <div className="profile-info">
              <span className="name">{request.UserName}</span>
              <span className="time">{request.createdAt}</span>
            </div>
          </div>
          <div className="content">
            <p>{request.RequestContent}</p>
            {request.RequestImage && (
              <img
                src={`https://loopplus.mydns.jp/${request.RequestImage}`}
                alt="Request"
                className="request-images"
              />
            )}
          </div>
          <div className="interaction-bar">
            <span className="comment-count">コメント {comments.length}</span>
            <div onClick={toggleLike} className="likes-button">
              {liked ? (
                <Favorite className="heart-icon liked" />
              ) : (
                <FavoriteBorder className="heart-icon" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* コメントセクション */}
      <div className="comments-section">
        <div className="divider"></div>
        {comments.map((comment, index) => (
          <React.Fragment key={comment.id}>
            <div className={`comment ${comment.isUser ? 'user-comment' : 'other-comment'}`}>
              <div className="comment-header-wrapper">
                <AccountCircleIcon className="avatar-icon small-avatar" />
                <div className="comment-header">
                  <span className="name">{comment.name}</span>
                  <span className="time">{comment.time}</span>
                </div>
              </div>
              <div className="comment-content">
                <p className="comment-text">{comment.text}</p>
              </div>
            </div>
            {index < comments.length - 1 && <div className="divider"></div>}
          </React.Fragment>
        ))}
      </div>

      {/* コメント入力 */}
      <div className="dm-input">
        <button className="image-upload-button">
          <AddIcon className="add-icon" />
        </button>
        <input
          type="text"
          placeholder="メッセージを入力..."
          className="input-box"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button
          className="send-button"
          onClick={handleCommentSubmit}
          disabled={!newComment.trim()}
        >
          <SendIcon className="send-icon" />
        </button>
      </div>
    </div>
  );
}

export default RequestDetail;
