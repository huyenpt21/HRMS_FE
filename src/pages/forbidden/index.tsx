import { Col, Result, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import { useNavigate } from 'react-router-dom';

const ForbiddenPage = () => {
  const navigate = useNavigate();

  document.title = '403: This page could not be access';
  return (
    <>
      <Row justify="center" align="middle" style={{ height: '100vh' }}>
        <Col>
          <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={
              <BasicButton
                title="Back home"
                type="filled"
                onClick={() => navigate('/')}
              />
            }
          />
        </Col>
      </Row>
    </>
  );
};

export default ForbiddenPage;
