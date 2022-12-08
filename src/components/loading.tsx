import { Spin } from 'antd';

interface Props {
  text?: string;
}

const Loading = ({ text }: Props) => {
  return (
    <div
      style={{
        minHeight: '100%',
      }}
    >
      <div
        style={{
          minHeight: '100%',
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
