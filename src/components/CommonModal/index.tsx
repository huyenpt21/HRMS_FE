import { CloseOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React, { ReactNode } from 'react';

interface Props {
  title?: string;
  children: JSX.Element;
  open: boolean;
  className?: string;
  footer?: ReactNode;
  closable?: boolean;
  closeIcon?: ReactNode;
  width?: string | number;
  onCancel?: () => void;
  onOk?: () => void;
  afterClose?: () => void;
}

const CommonModal = ({
  children,
  open,
  footer,
  closeIcon,
  width,
  onCancel,
  onOk,
  afterClose,
  className,
  closable,
  title,
}: Props) => {
  return (
    <Modal
      title={title}
      closeIcon={closeIcon ? closeIcon : <CloseOutlined />}
      width={width}
      open={open}
      className={`mainModal ${className}`}
      footer={footer}
      closable={closable}
      onCancel={onCancel}
      onOk={onOk}
      afterClose={afterClose}
    >
      {children}
    </Modal>
  );
};

export default CommonModal;
