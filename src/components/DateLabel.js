import React from 'react';

function DateLabel({ date }) {
  return (
    <div className="talk date">
      <p contentEditable="true">{formatDate(date)}</p>
      <i className="close"></i>
    </div>
  );
}

export default DateLabel;
