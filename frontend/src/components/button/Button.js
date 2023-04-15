import './Button.css'
import React from 'react';

function Button(props) {
  const { text, onClick, disabled } = props;

  return (
    <button onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
}

export default Button;
