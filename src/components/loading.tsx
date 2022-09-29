import { Spin } from 'antd';

interface Props {
  text?: string;
}

const Loading = ({ text }: Props) => {
  return (
    <div
      style={{
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Spin tip={text} size="large" />
      </div>
    </div>
  );
};

export default Loading;
