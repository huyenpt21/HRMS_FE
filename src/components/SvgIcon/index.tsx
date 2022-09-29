import React from 'react';
import IcomoonReact from 'icomoon-react';
import selection from './selection.json';

interface Props {
  color?: string;
  size: string | number;
  icon: string;
  className?: string;
  iconSet?: object;
}

const SvgIcon = (props: Props) => {
  const {
    color,
    size = '100%',
    iconSet = selection,
    icon,
    className = '',
  } = props;

  return (
    <IcomoonReact
      className={className}
      iconSet={iconSet}
      size={size}
      icon={icon}
      style={{ stroke: color, fill: color }}
    />
  );
};

export default SvgIcon;
