import React from 'react';
import IcomoonReact from 'icomoon-react';
import selection from './selection.json';
import { DEFAULT_SIZE_ICON } from 'constants/common';

interface Props {
  color?: string;
  size?: string | number;
  icon: string;
  className?: string;
  iconSet?: object;
  style?: any;
}

const SvgIcon = (props: Props) => {
  const {
    color,
    size = DEFAULT_SIZE_ICON,
    iconSet = selection,
    icon,
    className = '',
    style = '',
  } = props;

  return (
    <IcomoonReact
      className={className}
      iconSet={iconSet}
      size={size}
      icon={icon}
      style={style ? style : { stroke: color, fill: color }}
    />
  );
};

export default SvgIcon;
