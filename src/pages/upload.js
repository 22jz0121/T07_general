import React from 'react';
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom
import Footer from '../components/Footer'; // Correct relative path for Footer
import ArrowBackIcon from '@mui/icons-material/ArrowBack';  // Import Arrow Back icon from Material UI
import ImageIcon from '@mui/icons-material/Image';  // Import Image icon from Material UI
import '../css/upload.css'; // Ensure you have appropriate CSS for custom styling

const Upload = () => {
  const navigate = useNavigate();  // Initialize the navigation hook

  return (
    <div className="upload-container">
      {/* Top navigation */}
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate('/')}> {/* Navigate to "/" on click */}
          <ArrowBackIcon className="back-icon" /> {/* Use Material UI ArrowBackIcon */}
        </button>
        <h1 className="page-title">出品</h1>
      </div>

      {/* Main content */}
      <div className="flex-grow p-4 space-y-4">
        {/* Input for item name */}
        <input
          type="text"
          placeholder="この出品物の名前を入力してください"
          className="w-full p-3 border rounded-lg"
        />

        {/* Textarea for item description */}
        <textarea
          placeholder="買い手の方々へこの物品を紹介してください"
          rows="4"
          className="w-full p-3 border rounded-lg"
        ></textarea>

        {/* Image upload button */}
        <div className="upload-button">
          <ImageIcon className="mr-2" /> {/* Use Material UI ImageIcon */}
          画像を追加してください
        </div>

        {/* Select transaction methods */}
        <div>
          <label className="block mb-2 text-gray-700">
            希望取引方法を選んでください(複数選択可)
          </label>
          <div className="transaction-method-buttons">
            <button className="transaction-button giveaway">
              譲渡
            </button>
            <button className="transaction-button rental">
              レンタル
            </button>
            <button className="transaction-button exchange">
              交換
            </button>
          </div>
        </div>

        {/* Input for optional location */}
        <div>
          <label className="label">受け渡し場所を選択してください</label>
          <select className="location-select">
            <option value="">選択してください</option>
            {Array.from({ length: 13 }, (_, i) => (
              <option key={i} value={`${i + 1}号館`}>{`${i + 1}号館`}</option>
            ))}
          </select>
        </div>

        {/* Confirm button */}
        <div className="p-4">
          <button className="confirm-button">
            確認画面へ
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer /> {/* Ensure Footer component works properly */}
    </div>
  );
};

export default Upload;
