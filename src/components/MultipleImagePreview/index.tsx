import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Image, Tooltip } from 'antd';
import styles from './multiImagePreview.module.less';

interface IProps {
  src: string[];
  width?: number;
  alt?: string;
  preview?: any;
  height?: number;
  allowRemove?: boolean;
  handleRemoveFile?: (src: string) => void;
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
                      <>
                        <Tooltip title="Preview file">
                          <EyeOutlined
                            style={{ marginRight: '8px', fontSize: 16 }}
                          />
                        </Tooltip>
                        <Tooltip title="Remove file">
                          <DeleteOutlined
                            style={{ fontSize: 16 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile && handleRemoveFile(el);
                            }}
                          />
                        </Tooltip>
                      </>
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
