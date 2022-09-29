import styles from './index.module.less';

interface IProps {
  sidebarWidth: number;
}
const Footer = ({ sidebarWidth }: IProps) => {
  return (
    <div
      style={{ width: `calc(100% - ${sidebarWidth}px )` }}
      className={styles.footer}
    >
      Footer
    </div>
  );
};

export default Footer;
