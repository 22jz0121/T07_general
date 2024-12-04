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
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // データ取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // リクエストデータ
        const requestResponse = await fetch(`https://loopplus.mydns.jp/request/${id}`);
        if (!requestResponse.ok) throw new Error('Failed to fetch request details');
        const requestData = await requestResponse.json();
        setRequest(requestData);
        setLiked(requestData.isLiked);

        // コメントデータ
        const commentsResponse = await fetch(`https://loopplus.mydns.jp/request/${id}/comment`);
        if (!commentsResponse.ok) throw new Error('Failed to fetch comments');
        const commentsData = await commentsResponse.json();
        setComments(commentsData);

        // 現在のユーザー情報
        const userResponse = await fetch('https://loopplus.mydns.jp/whoami', { credentials: 'include' });
        if (!userResponse.ok) throw new Error('Failed to fetch current user');
        const userData = await userResponse.json();
        setCurrentUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // いいね切り替え
  const toggleLike = async () => {
    setLiked(!liked);
    // 必要に応じてバックエンドリクエスト
  };

  // コメント投稿
const handleCommentSubmit = async () => {
  if (newComment.trim()) {
    try {
      // CSRF トークン取得
      const csrfResponse = await fetch('https://loopplus.mydns.jp/sanctum/csrf-cookie', {
        credentials: 'include',
      });
      if (!csrfResponse.ok) throw new Error('Failed to fetch CSRF token');

      // コメント送信
      const response = await fetch(`https://loopplus.mydns.jp/api/request/${id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newComment }),
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to send comment: ${errorData.message || 'Unknown error'}`);
      }
      const createdComment = await response.json();
      setComments([...comments, { ...createdComment, id: createdComment.id || Date.now() }]);
      setNewComment('');
    } catch (err) {
      console.error('Error submitting comment:', err.message);
    }
  }
};


  if (loading) return <div className="loading"><img src="/Loading.gif" alt="Loading" /></div>;
  if (error) return <div>Error: {error}</div>;

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
        {comments.map((comment) => (
          <React.Fragment key={comment.id || comment.time}>
            <div className={`comment ${currentUser && currentUser.name === comment.name ? 'user-comment' : 'other-comment'}`}>
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
            <div className="divider"></div>
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
