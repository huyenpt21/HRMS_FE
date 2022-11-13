import { InboxOutlined } from '@ant-design/icons';
import { Modal, Upload, UploadFile } from 'antd';
import { RcFile, UploadProps } from 'antd/lib/upload';
import { useState, Dispatch, SetStateAction } from 'react';

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

interface IProps {
  fileUpload: any;
  setFileUpload: Dispatch<SetStateAction<any>>;
}
export default function UploadFilePictureWall({
  fileUpload,
  setFileUpload,
}: IProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const handleCancel = () => setPreviewOpen(false);
  const [fileList, setFileList] = useState<any>([]);
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1),
    );
  };
  const handleChange: UploadProps['onChange'] = ({ file, fileList, event }) => {
    if (file.status === 'removed') {
      const newFileList = fileUpload.filter((el: any) => {
        return el.name !== file.name;
      });
      setFileUpload(newFileList);
    } else {
      setFileUpload((prev: any) => {
        return [...prev, file];
      });
    }
    setFileList(fileList);
  };
  return (
    <>
      <Upload.Dragger
        action="http://localhost:3000/"
        listType="picture-card"
        fileList={fileList}
        multiple
        accept="image/*"
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={() => {
          return false;
        }}
      >
        <div>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
        </div>
      </Upload.Dragger>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
}
