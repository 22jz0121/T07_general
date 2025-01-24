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
  const [isSubmitting, setIsSubmitting] = useState(false); // 送信中のフラグ

  const handleImageUpload = async(e) => {
    const file = e.target.files[0];

    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/heic"];
      if (!validTypes.includes(file.type)) {
        setUploadError("サポートされていないファイル形式です。JPEG, PNG, または GIF のみが許可されています。");
        return;
      }

      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > MAX_IMAGE_SIZE_MB) {
        setUploadError(`ファイルサイズが大きすぎます。最大サイズは ${MAX_IMAGE_SIZE_MB} MB です。`);
        return;
      }

      const base64 = await convertToBase64(file);
      setUploadError(null);
      setImage(base64);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  //画像ファイルをbase64形式に変換
  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.onerror = () => {
        reject(new Error('Failed to read the file.'));
    };
    reader.readAsDataURL(file);
    });
  }

  const handlePostSubmit = async () => {
    if (postText.trim() || image) {
      setIsSubmitting(true); // 送信中フラグをオン
      const formData = new FormData();
      formData.append('RequestContent', postText);
      if(image) {
        formData.append('RequestImage', image);
      }

      try {
        const response = await fetch('https://loopplus.mydns.jp/api/request', {
          method: 'POST',
          body: formData,
          credentials: 'include',
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
      } finally {
        setIsSubmitting(false); // 送信中フラグをオフ
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
      <button
        className="post-submit-button"
        onClick={handlePostSubmit}
        disabled={isSubmitting} // 送信中はボタンを無効化
      >
        {isSubmitting ? 'リクエスト中...' : 'リクエストする'}
      </button>
    </div>
  );
}

export default PostAddPage;
