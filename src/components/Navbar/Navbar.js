import React, { useEffect, useState } from "react";
import "./Navbar.css";
import { Nav } from "react-bootstrap";
import logo from '../../img/logo.png';

export default function Navbar() {
    const [userName, setUserName] = useState("");  // userNameの状態を管理

    useEffect(() => {
        // ログインしているユーザー情報をサーバーから取得する
        const fetchUserData = async () => {
            try {
                const response = await fetch(`https://loopplus.mydns.jp/api/whoami`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                // console.log('ユーザー情報:', data);  // レスポンスの構造を確認

                // Username フィールドを使用して userName を設定
                if (data && data.Username) {
                    setUserName(data.Username);  // ユーザー名を状態に設定
                    // console.log('ユーザー名:', data.Username);  // ここで値が取得できるか確認
                } else {
                    console.log('Usernameが取得できませんでした');
                }
            } catch (error) {
                console.error("ユーザー情報の取得に失敗しました", error);
            }
        };

        fetchUserData();
    }, []);  // コンポーネントの初回レンダリング時に実行

    return (
        <Nav className="NavbarItems">
            <h1 className="Navbar-logo">
                <img src={logo} alt="Logo" />
             </h1>
            {userName ? (
                <div className="user-name">
                    <p>ようこそ {userName} さん </p>
                </div>
            ) : (
                <div className="user-name">
                    <p>ユーザー情報の取得中...</p>                 
                </div>
            )}
        </Nav>
    );
}
