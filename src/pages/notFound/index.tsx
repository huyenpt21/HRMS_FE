import { Col, Result, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Row justify="center" align="middle" style={{ height: '100vh' }}>
      <Col>
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <BasicButton
              title="Back Home"
              type="filled"
              onClick={() => navigate('/')}
            />
          }
        />
      </Col>
    </Row>
  );
};

export default NotFound;
