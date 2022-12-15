import { Col, Divider, Form, notification, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import BasicDatePicker from 'components/BasicDatePicker';
import BasicInput from 'components/BasicInput';
import BasicSelect from 'components/BasicSelect';
import {
  DATE_TIME,
  MESSAGE_RES,
  USER_INFO,
  US_DATE_FORMAT,
  validateMessages,
} from 'constants/common';
import { GENDER_LIST } from 'constants/fixData';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storageFirebase } from 'firebaseSetup';
import { useAppDispatch, useAppSelector } from 'hooks';
import { useUpdateUserInfor } from 'hooks/useEmployee';
import { EmployeeModel } from 'models/employee';
import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { getUserInfo } from 'store/slice/auth';
import { getDateFormat } from 'utils/common';
// import dataMock from './detailMock.json';
import { UploadAvatar } from './uploadAvatar';
import styles from './userProfile.module.less';

export default function UserProfile() {
  const [userProfileForm] = Form.useForm();
  const dispatch = useAppDispatch();
  const userInfor = useAppSelector((state) => state.auth.user);
  const [imageFile, setImageFile] = useState<any>(undefined);
  const [personInfor, setPersonInfor] = useState<EmployeeModel>();
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const { mutate: updateUserInfo, isLoading } = useUpdateUserInfor({
    onSuccess: (res) => {
      const {
        metadata: { message },
        data: { item: detailData },
      } = res;
      if (message === MESSAGE_RES.SUCCESS && detailData) {
        notification.success({ message: 'Update information successfully' });
        dispatch(getUserInfo({ newUserInfor: detailData }));
        localStorage.setItem(USER_INFO, JSON.stringify(detailData));
      }
    },
  });
  useEffect(() => {
    if (userInfor) {
      setPersonInfor(userInfor);
      userProfileForm.setFieldsValue(userInfor);
      userProfileForm.setFieldsValue({
        dateOfBirth: moment(userInfor.dateOfBirth),
      });
    }
  }, [userInfor]);
  const submitHandler = async (formValues: EmployeeModel) => {
    formValues.dateOfBirth = getDateFormat(formValues.dateOfBirth, DATE_TIME);
    if (imageFile) {
      formValues.avatarImg = await uploadImage();
      setIsUploadingImage(false);
    }
    if (!formValues?.avatarImg && personInfor?.avatarImg) {
      formValues.avatarImg = personInfor?.avatarImg;
    }
    updateUserInfo(formValues);
  };
  const uploadImage = async () => {
    setIsUploadingImage(true);
    let imgUrlDownload: string | undefined = undefined;
    const imageRef = ref(
      storageFirebase,
      `images/avatar/${imageFile?.name}-${Math.random()}`,
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
            <UploadAvatar
              setImageFile={setImageFile}
              avtUrl={
                personInfor?.avatarImg ?? 'https://joeschmoe.io/api/v1/random'
              }
            />
            <Divider />
            <Row>
              <Col span={24}>
                <div className={styles.title__name}>
                  {personInfor?.fullName}
                </div>
              </Col>
              <Col span={24}>{personInfor?.rollNumber}</Col>
              <Col span={24}>{personInfor?.email}</Col>
            </Row>
          </div>
        </Col>
        <Col xs={14} sm={14} md={14} lg={14} xl={16} xxl={12}>
          <div className={styles.personal__info}>
            <div className={styles.title__text}>Personnal Information</div>
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
                  placeholder="Choose gender"
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
                      pattern: new RegExp(
                        '^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$',
                      ),
                      message: 'Phone Number is invalid',
                    },
                  ]}
                  allowClear
                  placeholder="Enter phone number"
                  showCount
                />
              </Col>
            </Row>
            <Row gutter={12}>
              <Col span={12}>
                <BasicInput
                  name="citizenIdentification"
                  label="Citizen Identification"
                  allowClear
                  rules={[
                    { required: true, whitespace: true },
                    {
                      pattern: new RegExp('^[0-9]{9}$|^[0-9]{12}$'),
                      message: 'Citizen Identification is invalid',
                    },
                  ]}
                  placeholder="Enter Citizen Identification"
                  showCount
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
            <div className={styles.title__text}>Working Information</div>
            <Row gutter={12} className={styles['infor--header']}>
              <Col span={10}>
                <span>Roll Number: </span>
                <span className={styles['text--bold']}>
                  {personInfor?.rollNumber}
                </span>
              </Col>
              <Col span={14}>
                <span>Email: </span>
                <span className={styles['text--bold']}>
                  {personInfor?.email}
                </span>
              </Col>
            </Row>
            <Row gutter={12} className={styles['infor--header']}>
              <Col span={10}>
                <span>Department: </span>
                <span className={styles['text--bold']}>
                  {personInfor?.departmentName}
                </span>
              </Col>
              <Col span={14}>
                <span>Manager: </span>
                <span className={styles['text--bold']}>
                  {personInfor?.managerName}
                </span>
              </Col>
            </Row>
            <Row gutter={12} className={styles['infor--header']}>
              <Col span={10}>
                <span>Ranking: </span>
                <span className={styles['text--bold']}>
                  {personInfor?.rankingName}
                </span>
              </Col>
              <Col span={14}>
                <span>Position: </span>
                <span className={styles['text--bold']}>
                  {personInfor?.positionName}
                </span>
              </Col>
            </Row>
            <Row gutter={12} className={styles['infor--header']}>
              <Col span={12}>
                <span>Onboard Date: </span>
                <span className={styles['text--bold']}>
                  {getDateFormat(personInfor?.onBoardDate, US_DATE_FORMAT)}
                </span>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Form>
  );
}
