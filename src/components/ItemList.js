import React from 'react';
import Item from './Item';
import tvImage from '../img/tv-image.png';
import '../css/top.css';

function ItemList() {
  return (
    <div className="listing">
      <Item
        name="日本電子"
        time="3秒前"
        imageSrc={tvImage}
        title="55インチのスマートテレビ"
        description="最新の4K対応で、55インチのスマートテレビ"
        location="受け渡し場所：12号館"
      />
      <Item
        name="日本電子"
        time="3秒前"
        imageSrc={tvImage}
        title="55インチのスマートテレビ"
        description="最新の4K対応で、55インチのスマートテレビ"
        location="受け渡し場所：12号館"
      />
      <Item
        name="日本電子"
        time="3秒前"
        imageSrc={tvImage}
        title="55インチのスマートテレビ"
        description="最新の4K対応で、55インチのスマートテレビ"
        location="受け渡し場所：12号館"
      />
    </div>
  );
}

export default ItemList;
