import { UploadOutlined } from '@ant-design/icons';
import { notification, Upload, UploadProps } from 'antd';
import BasicButton from 'components/BasicButton';
import { useTranslation } from 'react-i18next';
import styles from './index.module.less';
import urls from 'constants/url';
import { acceptFile, fileTypeExcel } from 'constants/common';
const { REACT_APP_API_URL }: any = urls;

interface IProps {
  service: string;
  nameFormData?: string;
  fileType?: string[];
  refetch?: any;
  accept?: string;
}
const ImportExcel = ({
  service,
  nameFormData,
  fileType = fileTypeExcel,
  refetch,
  accept = acceptFile,
}: IProps) => {
  const { t } = useTranslation();
  const validateFile = (file: any) => {
    if (fileType) {
      const checkFile = fileType.find((type) => type === file.type);
      if (!checkFile) {
        notification.error({
          message: t('timeLeaveManagement.importFaild'),
        });
        return false;
      }
      return true;
    }
  };

  const propsUpload: UploadProps = {
    customRequest: async (options) => {
      const file = options.file;
      if (validateFile(file)) {
        const formData: any = new FormData();
        formData.append(nameFormData ? nameFormData : 'file', file);

        const oidcAuth: any = localStorage.getItem(
          `oidc.user:${process.env.REACT_APP_AUTH_URL}:${process.env.REACT_APP_IDENTITY_CLIENT_ID}`,
        );
        const oidcStorage = JSON.parse(oidcAuth);
        const url: string = REACT_APP_API_URL + service;
        const data = await fetch(url, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${oidcStorage.access_token}`,
          },
        });
        const response = await data.json();
        if (response.metadata?.code === 200) {
          notification.success({
            message: t('timeLeaveManagement.importSuccess'),
          });
          refetch();
        } else {
          notification.error({
            message: t('timeLeaveManagement.importFaild'),
          });
        }
      }
    },
  };

  return (
    <div className={styles.import}>
      <Upload accept={accept} {...propsUpload}>
        <BasicButton
          title={t('timeLeaveManagement.importFile')}
          type="filled"
          className={styles.button}
          icon={<UploadOutlined />}
        />
      </Upload>
    </div>
  );
};
export default ImportExcel;
