import { Col, Divider, Form, notification, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicDatePicker from 'components/BasicDatePicker';
import BasicInput from 'components/BasicInput';
import BasicSelect from 'components/BasicSelect';
import { DATE_TIME, MESSAGE_RES, validateMessages } from 'constants/common';
import { GENDER_LIST } from 'constants/fixData';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storageFirebase } from 'firebaseSetup';
import { useGetUserInfor, useUpdateUserInfor } from 'hooks/useEmployee';
import { EmployeeModel } from 'models/employee';
import moment from 'moment-timezone';
import { useEffect, useRef, useState } from 'react';
import { getDateFormat } from 'utils/common';
import dataMock from './detailMock.json';
import { UploadAvatar } from './uploadAvatar';
import styles from './userProfile.module.less';

export default function UserProfile() {
  const [userProfileForm] = Form.useForm();
  const [imageFile, setImageFile] = useState<any>(undefined);
  const personInforRef = useRef<EmployeeModel>();
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const { data: detailUserInfo } = useGetUserInfor();
  const { mutate: updateUserInfo, isLoading } = useUpdateUserInfor({
    onSuccess: (res) => {
      const {
        metadata: { message },
      } = res;
      if (message === MESSAGE_RES.SUCCESS) {
        notification.success({ message: 'Update information successfully' });
      }
    },
  });
  useEffect(() => {
    // if (detailUserInfo && detailUserInfo.data) {
    const {
      metadata: { message },
      data: { item: userInfo },
    } = dataMock;
    if (message === MESSAGE_RES.SUCCESS && userInfo) {
      personInforRef.current = userInfo;
      userProfileForm.setFieldsValue(userInfo);
      userProfileForm.setFieldsValue({
        dateOfBirth: moment(userInfo.dateOfBirth),
      });
    }
    // }
  }, [detailUserInfo]);
  const submitHandler = async (formValues: EmployeeModel) => {
    formValues.dateOfBirth = getDateFormat(formValues.dateOfBirth, DATE_TIME);
    formValues.avatar = await uploadImage();
    updateUserInfo(formValues);
  };

  const uploadImage = async () => {
    setIsUploadingImage(true);
    let imgUrlDownload: string | undefined = undefined;
    const imageRef = ref(
      storageFirebase,
      `images/avatar/${imageFile.name}-${Math.random()}`,
    );
    await uploadBytes(imageRef, imageFile)
      .then(async () => {
        await getDownloadURL(imageRef)
          .then((url) => {
            imgUrlDownload = url;
          })
          .catch((error) => {
            notification.error({
              message: 'Get download link error',
            });
            console.error(error);
          });
      })
      .catch((error) => {
        notification.error({
          message: 'Upload file error',
        });
        console.error(error);
      });
    return imgUrlDownload;
  };
  return (
    <Form
      form={userProfileForm}
      layout="vertical"
      requiredMark
      validateMessages={validateMessages()}
      onFinish={submitHandler}
      className={styles.container}
    >
      <Row gutter={32} className={styles.content}>
        <Col xs={12} sm={12} md={10} lg={10} xl={8} xxl={6}>
          <div className={styles.left__side}>
            <UploadAvatar setImageFile={setImageFile} />
            <Divider />
            <Row className={styles.info}>
              <Col span={24}>
                <h3>{personInforRef.current?.fullName}</h3>
              </Col>
              <Col span={24}>{personInforRef.current?.rollNumber}</Col>
              <Col span={24}>{personInforRef.current?.email}</Col>
            </Row>
          </div>
        </Col>
        <Col xs={14} sm={14} md={14} lg={14} xl={16} xxl={12}>
          <div className={styles.personal__info}>
            <h2>Personnal Information</h2>
            <Row gutter={12}>
              <Col span={12}>
                <BasicInput
                  name="fullName"
                  label="Full Name"
                  rules={[{ required: true, whitespace: true }]}
                  allowClear
                  placeholder="Enter full name "
                />
              </Col>
              <Col span={12}>
                <BasicDatePicker
                  name="dateOfBirth"
                  label="Date Of Birth"
                  rules={[{ required: true }]}
                />
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <BasicSelect
                  options={GENDER_LIST}
                  name="gender"
                  label="Gender"
                  allowClear
                  placeholder="Enter address"
                  rules={[{ required: true }]}
                />
              </Col>
              <Col span={12}>
                <BasicInput
                  name="phoneNumber"
                  label="Phone Number"
                  rules={[
                    { required: true },
                    {
                      pattern: new RegExp('^(\\+84|84|0)+([0-9]{9,10})\\b'),
                      message: 'Phone Number is invalid',
                    },
                  ]}
                  allowClear
                  placeholder="Enter phone number"
                />
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <BasicInput
                  name="citizenIdentification"
                  label="Citizen Identification"
                  allowClear
                  rules={[{ required: true, whitespace: true }]}
                  placeholder="Enter Citizen Identification"
                />
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={24}>
                <BasicInput
                  label="Address"
                  name="address"
                  type="textarea"
                  allowClear
                  placeholder="Enter address"
                  rows={3}
                />
              </Col>
            </Row>
            <Row className={styles.btn__submit}>
              <BasicButton
                title="Save"
                type="filled"
                htmlType="submit"
                loading={isLoading || isUploadingImage}
              />
            </Row>
          </div>
          <div className={styles.personal__info}>
            <h2>Working Information</h2>
            <Row gutter={12} className={styles['infor--header']}>
              <Col span={10}>
                <span>Roll Number: </span>
                <span className={styles['text--bold']}>
                  {personInforRef.current?.rollNumber}
                </span>
              </Col>
              <Col span={14}>
                <span>Email: </span>
                <span className={styles['text--bold']}>
                  {personInforRef.current?.email}
                </span>
              </Col>
            </Row>
            <Row gutter={12} className={styles['infor--header']}>
              <Col span={10}>
                <span>Department: </span>
                <span className={styles['text--bold']}>
                  {personInforRef.current?.departmentName}
                </span>
              </Col>
              <Col span={14}>
                <span>Manager: </span>
                <span className={styles['text--bold']}>
                  {personInforRef.current?.managerName}
                </span>
              </Col>
            </Row>
            <Row gutter={12} className={styles['infor--header']}>
              <Col span={10}>
                <span>Ranking: </span>
                <span className={styles['text--bold']}>
                  {personInforRef.current?.rankingName}
                </span>
              </Col>
              <Col span={14}>
                <span>Position: </span>
                <span className={styles['text--bold']}>
                  {personInforRef.current?.positionName}
                </span>
              </Col>
            </Row>
            <Row gutter={12} className={styles['infor--header']}>
              <Col span={12}>
                <span>Onboard Date: </span>
                <span className={styles['text--bold']}>
                  {personInforRef.current?.onBoardDate}
                </span>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Form>
  );
}
