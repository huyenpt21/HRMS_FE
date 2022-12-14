import { Col, Result, Row } from 'antd';
import BasicButton from 'components/BasicButton';
import { useNavigate } from 'react-router-dom';

const ServerErrorPage = () => {
  const navigate = useNavigate();
  return (
    <>
      <Row justify="center" align="middle" style={{ height: '100vh' }}>
        <Col>
          <Result
            status="500"
            title="500"
            subTitle="Sorry, something went wrong."
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

export default ServerErrorPage;
