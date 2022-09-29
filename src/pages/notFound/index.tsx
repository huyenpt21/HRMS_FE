import { Button, Col, Result, Row } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  document.title = '404: This page could not be found';

  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <Col>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Button type="primary" onClick={() => navigate('/')}>
              Back Home
            </Button>
          }
        />
      </Col>
    </Row>
  );
};

export default NotFound;
