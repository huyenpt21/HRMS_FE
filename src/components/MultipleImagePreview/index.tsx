import { Image } from 'antd';
import styles from './multiImagePreview.module.less';

interface IProps {
  src: string[];
  width?: number;
  alt?: string;
  preview?: boolean;
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
    <div className={styles.card__container}>
      {src.map((el: string, index: number) => (
        <Image
          key={index}
          src={el}
          width={width ? width : '120px'}
          height={height}
          alt={alt}
          preview={preview}
        />
      ))}
    </div>
  );
}
