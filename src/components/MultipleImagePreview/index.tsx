import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Image, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import styles from './multiImagePreview.module.less';

interface IProps {
  src: string[];
  width?: number;
  alt?: string;
  preview?: any;
  height?: number;
  allowRemove?: boolean;
  handleRemoveFile: (src: any) => void;
}
export default function MultipleImagePreview({
  src,
  width,
  height,
  alt,
  preview,
  allowRemove,
  handleRemoveFile,
}: IProps) {
  const [open, setOpen] = useState<number>(-1);
  const [visibelPreview, setVisiblePreview] = useState(-1);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const showPopconfirm = (index: number) => {
    setOpen(index);
  };
  const handleOk = (el: string) => {
    setConfirmLoading(true);
    handleRemoveFile(el);
  };
  const handleCancel = () => {
    setOpen(-1);
  };
  return (
    <div className={styles.container}>
      {src.map((el: string, index: number) => (
        <Card key={index} className={styles.card__item}>
          <Image
            src={el}
            width={width}
            height={height}
            alt={alt}
            preview={
              allowRemove
                ? {
                    visible: visibelPreview === index,
                    mask: (
                      <>
                        <Tooltip title="Preview file">
                          <EyeOutlined
                            style={{ marginRight: '8px', fontSize: 16 }}
                            onClick={() => {
                              setVisiblePreview(index);
                            }}
                          />
                        </Tooltip>
                        <Popconfirm
                          title="Are you sure?"
                          open={open === index}
                          onConfirm={() => {
                            handleOk(el);
                          }}
                          okButtonProps={{ loading: confirmLoading }}
                          onCancel={handleCancel}
                        >
                          <Tooltip title="Remove file">
                            <DeleteOutlined
                              style={{ fontSize: 16 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                showPopconfirm(index);
                              }}
                            />
                          </Tooltip>
                        </Popconfirm>
                      </>
                    ),
                    current: index,
                  }
                : preview
            }
          />
        </Card>
      ))}
    </div>
  );
}
