import { DeleteOutlined } from '@ant-design/icons';
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
  handleRemoveFile?: (url: string) => Promise<void>;
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
  const [openConfirmPopup, setOpenConfirmPopup] = useState<number>(-1);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const handleOk = async (el: string) => {
    setConfirmLoading(true);
    handleRemoveFile && (await handleRemoveFile(el));
    setConfirmLoading(false);
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
                    mask: (
                      <Popconfirm
                        title="Are you sure? It cannot be reverse?"
                        open={openConfirmPopup === index}
                        onConfirm={(e) => {
                          e?.stopPropagation();
                          handleOk(el);
                          setOpenConfirmPopup(-1);
                        }}
                        okButtonProps={{ loading: confirmLoading }}
                        onCancel={(e) => {
                          e?.stopPropagation();
                          setOpenConfirmPopup(-1);
                        }}
                      >
                        <Tooltip title="Remove file" placement="bottom">
                          <DeleteOutlined
                            style={{ fontSize: 16 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenConfirmPopup(index);
                            }}
                          />
                        </Tooltip>
                      </Popconfirm>
                    ),
                  }
                : preview
            }
          />
        </Card>
      ))}
    </div>
  );
}
