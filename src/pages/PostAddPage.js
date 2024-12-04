import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageIcon from '@mui/icons-material/Image';
import '../css/RequestPage.css';

const MAX_IMAGE_SIZE_MB = 5; // 最大画像サイズを5MBに設定

function PostAddPage({ onRequestAdded }) {
  const navigate = useNavigate();
  const [postText, setPostText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadError, setUploadError] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        setUploadError("サポートされていないファイル形式です。JPEG, PNG, または GIF のみが許可されています。");
        return;
      }

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_IMAGE_SIZE_MB) {
        setUploadError(`ファイルサイズが大きすぎます。最大サイズは ${MAX_IMAGE_SIZE_MB} MB です。`);
        return;
      }

      setUploadError(null);
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePostSubmit = async () => {
    if (postText.trim() || image) {
      const formData = new FormData();
      formData.append('RequestContent', postText);
      formData.append('RequestImage', image);

      try {
        // CSRFトークンを取得
        await fetch('https://loopplus.mydns.jp/sanctum/csrf-cookie', {
          credentials: 'include',
        });

        const response = await fetch('https://loopplus.mydns.jp/api/request', {
          method: 'POST',
          body: formData,
          credentials: 'include', // 必要に応じてクッキーを送信
        });

        if (response.ok) {
          const newRequest = await response.json(); // 新しいリクエストデータを取得
          onRequestAdded(newRequest); // onRequestAddedを呼び出して新しいリクエストを親に通知
          alert("投稿が完了しました！"); // 成功時のアラート
          navigate('/request'); // リクエスト一覧にリダイレクト
        } else {
          const errorData = await response.json();
          alert(errorData.message || "エラーが発生しました。");
        }
      } catch (error) {
        console.error('Error uploading request:', error);
        alert("ネットワークエラーが発生しました。");
      }
    } else {
      alert('テキストか画像を入力してください！');
    }
  };

  return (
    <div className="post-add-container">
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">リクエスト</h1>
      </div>

      {/* Text Input */}
      <textarea
        className="post-textarea"
        placeholder="どんなものが欲しいかリクエストしてみましょう"
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
      ></textarea>

      {/* Image Upload */}
      <div className="uploads-button">
        <label htmlFor="image-upload" className="image-upload-label">
          <ImageIcon className="mr-2" />
          画像を追加してください
        </label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        {uploadError && <p className="upload-error">{uploadError}</p>}
      </div>

      {imagePreview && (
        <div className="image-preview-container">
          <img src={imagePreview} alt="プレビュー画像" className="image-preview" />
        </div>
      )}

      {/* Submit Button */}
      <button className="post-submit-button" onClick={handlePostSubmit}>
        リクエストする
      </button>
    </div>
  );
}

export default PostAddPage;
