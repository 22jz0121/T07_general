// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageIcon from '@mui/icons-material/Image';
import '../css/upload.css';


const MAX_IMAGE_SIZE_MB = 5; // 最大画像サイズを5MBに設定

const Upload = () => {
    const navigate = useNavigate();
    const location = useLocation(); // ルートからの状態を取得
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [transactionMethods, setTransactionMethods] = useState([]);
    const [image, setImage] = useState(null); // 画像ファイルの状態
    const [imagePreview, setImagePreview] = useState(null); // 画像プレビューの状態
    const [uploadError, setUploadError] = useState(null); // アップロードエラーの状態

    // 取引方法のトグル処理
    const toggleTransactionMethod = (method) => {
        const updatedMethods = transactionMethods.includes(method)
            ? transactionMethods.filter((m) => m !== method)
            : [...transactionMethods, method];

        setTransactionMethods(updatedMethods);
    };

    // 画像アップロード処理
    const handleImageUpload = (e) => {
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

            setUploadError(null);
            setImage(file);
            setImagePreview(URL.createObjectURL(file)); // 画像のプレビューを作成
        }
    };

    // 確認ボタンがクリックされたときの処理
    const handleConfirm = () => {
        // 必要なフィールドがすべて入力されているか確認
        if (!name || !description || transactionMethods.length === 0 || !image) {
            alert("すべてのフィールドを入力してください。");
            return;
        }

        // データをlocation.stateで渡す
        navigate('/confirmation', {
            state: {
                name,
                description,
                transactionMethods, // 取引方法の配列を渡す
                image // 画像ファイルを渡す
            }
        });
    };

    useEffect(() => {
        // location.stateからデータを受け取る
        if (location.state) {
            const { name, description, transactionMethods, image } = location.state;
            setName(name);
            setDescription(description);
            setTransactionMethods(transactionMethods);
            setImage(image);
            if (image) {
                setImagePreview(URL.createObjectURL(image)); // 画像プレビューを設定
            }
        }
    }, [location.state]);
    
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
                    value={name}
                    onChange={(e) => setName(e.target.value)} // 名前の変更時に呼び出す
                />

                <textarea
                    name="description"
                    placeholder="買い手の方々へこの物品を紹介してください"
                    rows="4"
                    className="w-full p-3 border rounded-lg"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} // 説明の変更時に呼び出す
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
                        onChange={handleImageUpload} // 画像アップロード時に呼び出す
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
                            className={`transaction-button giveaway ${transactionMethods.includes('譲渡') ? 'selected' : ''}`}
                            onClick={() => toggleTransactionMethod('譲渡')}
                        >
                            譲渡
                        </button>
                        <button
                            type="button"
                            className={`transaction-button rental ${transactionMethods.includes('レンタル') ? 'selected' : ''}`}
                            onClick={() => toggleTransactionMethod('レンタル')}
                        >
                            レンタル
                        </button>
                        <button
                            type="button"
                            className={`transaction-button exchange ${transactionMethods.includes('交換') ? 'selected' : ''}`}
                            onClick={() => toggleTransactionMethod('交換')}
                        >
                            交換
                        </button>
                    </div>
                </div>

                <div className="p-4">
                    <button className="confirm-button" onClick={handleConfirm}>
                        確認画面へ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Upload;


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import ImageIcon from '@mui/icons-material/Image';
// import '../css/upload.css';

// const MAX_IMAGE_SIZE_MB = 5; // 最大画像サイズを5MBに設定

// const Upload = () => {
//   const navigate = useNavigate();
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [transactionMethods, setTransactionMethods] = useState([]);
//   const [image, setImage] = useState(null); // 画像ファイルの状態
//   const [imagePreview, setImagePreview] = useState(null); // 画像プレビューの状態
//   const [uploadError, setUploadError] = useState(null); // アップロードエラーの状態

//   // 取引方法のトグル処理
//   const toggleTransactionMethod = (method) => {
//     const updatedMethods = transactionMethods.includes(method)
//       ? transactionMethods.filter((m) => m !== method)
//       : [...transactionMethods, method];

//     setTransactionMethods(updatedMethods);
//   };

//   // 画像アップロード処理
//   const handleImageUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = ["image/jpeg", "image/png", "image/gif"];
//       if (!validTypes.includes(file.type)) {
//         setUploadError("サポートされていないファイル形式です。JPEG, PNG, または GIF のみが許可されています。");
//         return;
//       }

//       const fileSizeMB = file.size / (1024 * 1024);
//       if (fileSizeMB > MAX_IMAGE_SIZE_MB) {
//         setUploadError(`ファイルサイズが大きすぎます。最大サイズは ${MAX_IMAGE_SIZE_MB} MB です。`);
//         return;
//       }

//       setUploadError(null);
//       setImage(file);
//       setImagePreview(URL.createObjectURL(file)); // 画像のプレビューを作成
//     }
//   };

//   // 確認ボタンがクリックされたときの処理
//   const handleConfirm = () => {
//     // 必要なフィールドがすべて入力されているか確認
//     if (!name || !description || transactionMethods.length === 0 || !image) {
//       alert("すべてのフィールドを入力してください。");
//       return;
//     }

//     // データをlocation.stateで渡す
//     navigate('/confirmation', {
//       state: {
//         name,
//         description,
//         transactionMethods, // 取引方法の配列を渡す
//         image // 画像ファイルを渡す
//       }
//     });
//   };

//   return (
//     <div className="upload-container">
//       <div className="top-navigation">
//         <button className="back-button" onClick={() => navigate('/')}>
//           <ArrowBackIcon className="back-icon" />
//         </button>
//         <h1 className="page-title">出品</h1>
//       </div>

//       <div className="flex-grow p-4 space-y-4">
//         <input
//           type="text"
//           name="name"
//           placeholder="この出品物の名前を入力してください"
//           className="w-full p-3 border rounded-lg"
//           value={name}
//           onChange={(e) => setName(e.target.value)} // 名前の変更時に呼び出す
//         />

//         <textarea
//           name="description"
//           placeholder="買い手の方々へこの物品を紹介してください"
//           rows="4"
//           className="w-full p-3 border rounded-lg"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)} // 説明の変更時に呼び出す
//         ></textarea>

//         <div className="upload-button">
//           <label htmlFor="image-upload" className="image-upload-label">
//             <ImageIcon className="mr-2" />
//             画像を追加してください
//           </label>
//           <input
//             id="image-upload"
//             type="file"
//             accept="image/*"
//             style={{ display: 'none' }}
//             onChange={handleImageUpload} // 画像アップロード時に呼び出す
//           />
//           {uploadError && <p className="upload-error">{uploadError}</p>}
//         </div>

//         {imagePreview && (
//           <div className="image-preview-container">
//             <img src={imagePreview} alt="プレビュー画像" className="image-preview" />
//           </div>
//         )}

//         <div>
//           <label className="block mb-2 text-gray-700">
//             希望取引方法を選んでください(複数選択可)
//           </label>
//           <div className="transaction-method-buttons">
//             <button
//               type="button"
//               className={`transaction-button giveaway ${transactionMethods.includes('譲渡') ? 'selected' : ''}`}
//               onClick={() => toggleTransactionMethod('譲渡')}
//             >
//               譲渡
//             </button>
//             <button
//               type="button"
//               className={`transaction-button rental ${transactionMethods.includes('レンタル') ? 'selected' : ''}`}
//               onClick={() => toggleTransactionMethod('レンタル')}
//             >
//               レンタル
//             </button>
//             <button
//               type="button"
//               className={`transaction-button exchange ${transactionMethods.includes('交換') ? 'selected' : ''}`}
//               onClick={() => toggleTransactionMethod('交換')}
//             >
//               交換
//             </button>
//           </div>
//         </div>

//         <div className="p-4">
//           <button className="confirm-button" onClick={handleConfirm}>
//             確認画面へ
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Upload;
