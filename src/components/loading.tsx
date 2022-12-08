import { Spin } from 'antd';

interface Props {
  text?: string;
}

const Loading = ({ text }: Props) => {
  return (
    <div
      style={{
        margin: '30%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Spin tip={text} size="large" />
    </div>
  );
};

export default Loading;
