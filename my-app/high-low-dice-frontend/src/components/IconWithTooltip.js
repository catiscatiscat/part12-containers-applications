import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { IconContext } from 'react-icons';

const IconWithTooltip = props => {
  const {
    tooltip,
    placement,
    color = 'black',
    size = '1em',
    marginLeft = '0',
    marginRight = '0',
  } = props;

  return (
    <IconContext.Provider
      value={{
        color: color,
        size: size,
        className: 'global-class-name',
        style: { marginLeft: marginLeft, marginRight: marginRight },
      }}
    >
      <OverlayTrigger
        placement={placement}
        overlay={<Tooltip>{tooltip}</Tooltip>}
      >
        <div>{props.children}</div>
      </OverlayTrigger>
    </IconContext.Provider>
  );
};

export default IconWithTooltip;
