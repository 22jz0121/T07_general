import React from 'react';
import Footer from '../components/Footer'; // Correct relative path for Footer
import ArrowBackIcon from '@mui/icons-material/ArrowBack';  // Import Arrow Back icon from Material UI
import ImageIcon from '@mui/icons-material/Image';  // Import Image icon from Material UI
import '../css/upload.css'; // Ensure you have appropriate CSS for custom styling

const Upload = () => {
  return (
    <div className="h-screen flex flex-col justify-between bg-white">
      {/* Top navigation */}
      <div className="items-center justify-start p-4 border-b">
        <button className="mr-4">
          <ArrowBackIcon className="text-gray-700" /> {/* Use Material UI ArrowBackIcon */}
        </button>
        <h1 className="text-lg ">出品</h1>
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
        <div className="w-full p-3 border rounded-lg flex items-center justify-center text-gray-500">
          <ImageIcon className="mr-2" /> {/* Use Material UI ImageIcon */}
          画像を追加してください
        </div>

        {/* Select transaction methods */}
        <div>
          <label className="block mb-2 text-gray-700">
            希望取引方法を選んでください(複数選択可)
          </label>
          <div className="flex space-x-2">
            <button className="flex-grow p-3 bg-green-100 text-green-600 rounded-lg">
              譲渡
            </button>
            <button className="flex-grow p-3 bg-blue-100 text-blue-600 rounded-lg">
              レンタル
            </button>
            <button className="flex-grow p-3 bg-orange-100 text-orange-600 rounded-lg">
              交換
            </button>
          </div>
        </div>

        {/* Input for optional location */}
        <input
          type="text"
          placeholder="受け渡し場所を入力してください(任意)"
          className="w-full p-3 border rounded-lg"
        />
      </div>

      {/* Confirm button */}
      <div className="p-4">
        <button className="w-full p-3 bg-white text-blue-500 border border-blue-500 rounded-lg">
          確認画面へ
        </button>
      </div>

      {/* Footer */}
      <Footer /> {/* Ensure Footer component works properly */}
    </div>
  );
};

export default Upload;
