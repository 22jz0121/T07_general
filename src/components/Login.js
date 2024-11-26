import React from 'react';

const MyComponent = () => {
    const handleButtonClick = () => {
        window.location.href = 'https://loopplus.mydns.jp/login/google';
    };

  return (
    <div style={{ textAlign: "center", marginTop: "20vh" }}>
      <div className='login-form'>
          <h1>Loop+</h1>
          <div className='login-button'>
            <button onClick={handleButtonClick}>ロォグイィン！！</button>
          </div>
      </div>
    </div>
  );
};

export default MyComponent;


// import React from 'react'
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
// import '../css/login.css';

// function Login() {
//     const handleLoginSuccess = (response) => {
//       const idToken = response.credential;
      
//       // IDトークンをバックエンドに送信
//       fetch("http://localhost:8000/api/auth/google", {     //変更が必要かもしれない
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ id_token: idToken }),
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.success) {
//             console.log("ログイン成功");
//             // ログイン成功後の処理（例：ユーザー情報の保存、リダイレクトなど）
//           } else {
//             console.log("認証に失敗しました:", data.message);
//           }
//         });
//     };

// //   YOUR_GOOGLE_CLIENT_ID にGoogle Cloud Consoleで取得したクライアントIDを設定
// // handleLoginSuccess関数で、Googleから取得したIDトークンをLaravelバックエンドに送信
//     return (
//         <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">   
//         <div style={{ textAlign: "center", marginTop: "20vh" }}>
//             <div className='login-form'>
//                 <h1>Loop+</h1>
//                 <div className='login-button'>
//                     <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.log("ログインエラー")} />
//                 </div>
//             </div>
//         </div>
//       </GoogleOAuthProvider>
      
//     );
//   }
  
//   export default Login;




// // ステップ 1: Reactでフロントエンドを構築
// // まず、Reactアプリケーションにreact-oauth/googleパッケージを追加します。

// // npm install @react-oauth/google

// // ステップ 2: Laravelでバックエンドを構築
// // 1. Laravelプロジェクトの準備

// // php artisan make:controller AuthController

// // 2. Google認証APIルートを設定
// // routes/api.php に、Google認証用のルートを追加します。

// // php
// // コードをコピーする
// // use App\Http\Controllers\AuthController;

// // Route::post('/auth/google', [AuthController::class, 'googleLogin']);

// // 3. AuthControllerの実装
// // AuthController.php に、GoogleのIDトークンを検証してユーザーを認証するメソッドを実装します。
// // GoogleのAPIクライアントでIDトークンを検証するには、google/apiclientパッケージをインストールします。

// // composer require google/apiclient


// // AuthController.php に以下のコードを追加します。

// // app/Http/Controllers/AuthController.php

// // namespace App\Http\Controllers;

// // use Google_Client;
// // use Illuminate\Http\Request;
// // use App\Models\User;
// // use Illuminate\Support\Facades\Auth;

// // class AuthController extends Controller
// // {
// //     public function googleLogin(Request $request)
// //     {
// //         $idToken = $request->input('id_token');

// //         $client = new Google_Client(['client_id' => 'YOUR_GOOGLE_CLIENT_ID']);
// //         $payload = $client->verifyIdToken($idToken);

// //         if ($payload) {
// //             $googleId = $payload['sub'];
// //             $email = $payload['email'];
// //             $name = $payload['name'];

// //             // ユーザーが存在しない場合は作成
// //             $user = User::firstOrCreate(
// //                 ['google_id' => $googleId],
// //                 ['email' => $email, 'name' => $name]
// //             );

// //             // ログイン状態にする
// //             Auth::login($user);

// //             return response()->json(['success' => true, 'message' => 'ログイン成功']);
// //         } else {
// //             return response()->json(['success' => false, 'message' => 'IDトークンの検証に失敗しました'], 401);
// //         }
// //     }
// // }