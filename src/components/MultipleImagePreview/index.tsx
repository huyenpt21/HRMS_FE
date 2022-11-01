import { Card, Image } from 'antd';
import styles from './multiImagePreview.module.less';

interface IProps {
  src: string[];
  width?: number;
  alt?: string;
  preview?: any;
  height?: number;
}
export default function MultipleImagePreview({
  src,
  width,
  height,
  alt,
  preview,
}: IProps) {
  return (
    <div className={styles.container}>
      {src.map((el: string, index: number) => (
        <Card key={index} className={styles.card__item}>
          <Image
            src={el}
            width={width ? width : '120px'}
            height={height}
            alt={alt}
            preview={preview}
          />
        </Card>
      ))}
    </div>
  );
}
