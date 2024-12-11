import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageIcon from '@mui/icons-material/Image';
import '../css/upload.css';

const MAX_IMAGE_SIZE_MB = 5; // Set max image size to 5MB

const Upload = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    transactionMethods: [],
    location: '',
  });

  const [image, setImage] = useState(null); // Separate state for image file
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [uploadError, setUploadError] = useState(null); // State for upload error

  // Load data from localStorage if it's coming back from confirmation page
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('formData'));
    if (savedData) {
      setFormData(savedData);
    }
    return () => localStorage.removeItem('formData'); // Clear saved data when leaving page
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const toggleTransactionMethod = (method) => {
    setFormData({
      ...formData,
      transactionMethods: formData.transactionMethods.includes(method)
        ? formData.transactionMethods.filter((m) => m !== method)
        : [...formData.transactionMethods, method],
    });
  };

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

  const handleConfirm = async () => {
    const { name, description, transactionMethods, location } = formData;

    if (!name || !description || transactionMethods.length === 0 || !image) {
      alert("すべてのフィールドを入力してください。");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('ItemName', name);
    formDataToSend.append('Description', description);
    formDataToSend.append('Category', 1); // ここは適宜選択したカテゴリのIDに変更
    formDataToSend.append('ItemImage', image); // 画像ファイルを追加

    navigate('/confirmation', { state: { ...formData, image } });
  };

  return (
    <div className="upload-container">
      <div className="top-navigation">
        <button className="back-button" onClick={() => navigate('/')}>
          <ArrowBackIcon className="back-icon" />
        </button>
        <h1 className="page-title">出品</h1>
      </div>

      <div className="flex-grow p-4 space-y-4">
        <input
          type="text"
          name="name"
          placeholder="この出品物の名前を入力してください"
          className="w-full p-3 border rounded-lg"
          value={formData.name}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="買い手の方々へこの物品を紹介してください"
          rows="4"
          className="w-full p-3 border rounded-lg"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <div className="upload-button">
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

        <div>
          <label className="block mb-2 text-gray-700">
            希望取引方法を選んでください(複数選択可)
          </label>
          <div className="transaction-method-buttons">
            <button
              type="button"
              className={`transaction-button giveaway ${formData.transactionMethods.includes('譲渡') ? 'selected' : ''}`}
              onClick={() => toggleTransactionMethod('譲渡')}
            >
              譲渡
            </button>
            <button
              type="button"
              className={`transaction-button rental ${formData.transactionMethods.includes('レンタル') ? 'selected' : ''}`}
              onClick={() => toggleTransactionMethod('レンタル')}
            >
              レンタル
            </button>
            <button
              type="button"
              className={`transaction-button exchange ${formData.transactionMethods.includes('交換') ? 'selected' : ''}`}
              onClick={() => toggleTransactionMethod('交換')}
            >
              交換
            </button>
          </div>
        </div>

        {/* <div>
          <label className="label">受け渡し場所を選択してください</label>
          <select
            name="location"
            className="location-select"
            value={formData.location}
            onChange={handleChange}
          >
            <option value="">選択してください</option>
            {Array.from({ length: 13 }, (_, i) => (
              <option key={i} value={`${i + 1}号館`}>{`${i + 1}号館`}</option>
            ))}
          </select>
        </div> */}

        <div className="p-4">
          <button className="confirm-button" onClick={handleConfirm}>
            確認画面へ
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Upload;


