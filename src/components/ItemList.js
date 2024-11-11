import React from 'react';
import Item from './Item';
import tvImage from '../img/tv-image.png';

function ItemList() {
  return (
    <div className="listing">
      <Item
        itemId="1"
        name="日本電子"
        time="3秒前"
        imageSrc={tvImage}
        title="55インチのスマートテレビ"
        description="最新の4K対応で、55インチのスマートテレビです。"
        location="受け渡し場所：12号館"
      />
      <Item
        itemId="2"
        name="日本電子"
        time="3秒前"
        imageSrc={tvImage}
        title="55インチのスマートテレビ"
        description="最新の4K対応で、55インチのスマートテレビです。"
        location="受け渡し場所：12号館"
      />
      <Item
        itemId="3"
        name="日本電子"
        time="3秒前"
        imageSrc={tvImage}
        title="55インチのスマートテレビ"
        description="最新の4K対応で、55インチのスマートテレビです。"
        location="受け渡し場所：12号館"
      />
      {/* Add additional items with different `itemId`s */}
    </div>
  );
}

export default ItemList;
