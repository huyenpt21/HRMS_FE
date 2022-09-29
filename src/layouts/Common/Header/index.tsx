import styles from './index.module.less';

interface IProps {
  sidebarWidth: number;
}
const Header = ({ sidebarWidth }: IProps) => {
  return (
    <div
      style={{ width: `calc(100% - ${sidebarWidth}px )` }}
      className={styles.header}
    >
      Header
    </div>
  );
};

export default Header;
