import { Col, Image, Row, Upload } from 'antd';
import { RcFile } from 'antd/lib/upload';
import BasicButton from 'components/BasicButton';
import { Dispatch, memo, SetStateAction, useState } from 'react';
import styles from '../userProfile.module.less';

interface IProps {
  setImageFile: Dispatch<SetStateAction<any>>;
}
export const UploadAvatar = memo(({ setImageFile }: IProps) => {
  const [previewImage, setPreviewImage] = useState('');

  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  const handleUpload = async (info: any) => {
    const fileUpload = await getBase64(info.file.originFileObj as RcFile);
    setPreviewImage(fileUpload as string);
    setImageFile(info.file.originFileObj);
  };
  return (
    <Row className={styles.header}>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
        <Image
          src={
            !!previewImage
              ? previewImage
              : 'https://i.pinimg.com/736x/ed/c9/cb/edc9cb773659891ba03594a3a180887a.jpg'
          }
        />
      </Col>
      <Col
        xs={24}
        sm={24}
        md={24}
        lg={24}
        xl={24}
        xxl={24}
        className={styles.upload__section}
      >
        <div className={styles.upload__text}>Upload your photo</div>
        <Upload name="upload-avt" onChange={handleUpload}>
          <BasicButton title="Choose image" type="outline" />
        </Upload>
      </Col>
    </Row>
  );
});