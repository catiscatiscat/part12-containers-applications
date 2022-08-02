import React from 'react';
import Button from 'react-bootstrap/Button';

export const HLDButton = props => {
  const {
    title,
    className,
    disabled,
    handleClick
  } = props;
  return (
    <Button
      variant = 'btn-hld'
      className={className}
      disabled={disabled}
      onClick={handleClick}
    >
      {title}
    </Button>
  );
};
