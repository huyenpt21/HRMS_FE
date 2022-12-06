import { Button } from 'antd';
import { SHAPE_TYPE, SIZE_TYPE } from 'constants/enums/common';
import { ReactNode, MouseEvent } from 'react';
import styles from './index.module.less';

export interface IButtonProps {
  title?: string;
  type: 'filled' | 'outline';
  disabled?: boolean;
  block?: boolean;
  danger?: boolean;
  ghost?: boolean;
  href?: string;
  htmlType?: 'button' | 'submit' | 'reset' | undefined;
  icon?: ReactNode;
  loading?: boolean | { delay: number };
  shape?: SHAPE_TYPE;
  size?: SIZE_TYPE;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

const BasicButton = (props: IButtonProps) => {
  return (
    <Button
      className={`${
        props.type === 'outline'
          ? styles['btn--outline']
          : styles['btn--filled']
      } ${props.className}`}
      type="primary"
      disabled={props.disabled}
      block={props.block}
      danger={props.danger}
      ghost={props.ghost}
      href={props.href}
      icon={props.icon}
      loading={props.loading}
      shape={props.shape}
      size={props.size || 'large'}
      onClick={props.onClick}
      htmlType={props.htmlType}
    >
      {props.title}
    </Button>
  );
};

export default BasicButton;
