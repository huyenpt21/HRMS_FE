import { Button, Col, Result, Row } from 'antd';
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
              <Button type="primary" onClick={() => navigate('/')}>
                Back Home
              </Button>
            }
          />
        </Col>
      </Row>
    </>
  );
};

export default ForbiddenPage;
