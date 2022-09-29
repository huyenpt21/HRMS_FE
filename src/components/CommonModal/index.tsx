import { CloseOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import React, { ReactNode } from 'react';

interface Props {
  title?: string;
  children: JSX.Element;
  visible: boolean;
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
  visible,
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
      visible={visible}
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
