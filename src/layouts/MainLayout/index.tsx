import { Drawer, Grid, Layout } from 'antd';
import BreadcrumbLayout from 'layouts/Common/Breadcrumb/BreadcrumbLayout';
import ContentPage from 'layouts/Common/ContentPage';
import FooterContent from 'layouts/Common/FooterContent';
import HeaderContent from 'layouts/Common/HeaderContent';
import MenuSidebar from 'layouts/Menu';
import { useState } from 'react';
import { Link } from 'react-router-dom';
const { Content, Sider } = Layout;

const { useBreakpoint } = Grid;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const { xs, sm, lg } = useBreakpoint();

  let siderWidth = 280;
  let collapsedWidth = 80;
  let marginLeft = 280;

  if (xs) {
    collapsedWidth = 0;
    marginLeft = 0;

    if (!collapsed) {
      setCollapsed(true);
    }
  } else if (sm || lg) {
    if (collapsed) {
      marginLeft = collapsedWidth;
    } else {
      marginLeft = siderWidth;
    }
  }

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  const onVisible = (toggle: boolean) => {
    setVisible(toggle);
  };

  const getImageSource = () => {
    const imageLink = '/images/fileName.svg';

    if (xs) {
      return imageLink?.replace('fileName', 'main-logo');
    }

    return imageLink?.replace(
      'fileName',
      collapsed ? 'small-logo' : 'main-logo',
    );
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={(e) => onCollapse(e)}
        breakpoint="xl"
        collapsedWidth={collapsedWidth}
        width={siderWidth}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          fontSize: 15,
        }}
      >
        <div
          style={{
            padding: collapsed ? '14px 24px' : '32px 40px',
          }}
        >
          <Link to="/">
            <img
              src={getImageSource()}
              style={{
                width: '100%',
              }}
              alt="Minswap"
            />
          </Link>
        </div>
        <MenuSidebar collapsed={collapsed} />
      </Sider>
      {xs && (
        <Drawer
          closeIcon={null}
          placement="left"
          width={siderWidth}
          visible={visible}
          onClose={() => onVisible(false)}
          drawerStyle={{
            padding: 0,
          }}
          bodyStyle={{
            padding: 0,
          }}
        >
          <div
            style={{
              padding: `${collapsed ? '14px' : '18px'} 24px`,
            }}
          >
            <Link to="/">
              <img
                src={getImageSource()}
                style={{
                  width: '100%',
                }}
                alt=""
              />
            </Link>
          </div>
          <MenuSidebar />
        </Drawer>
      )}
      <Layout
        style={{
          marginLeft: marginLeft,
          transition: 'all 0.2s',
        }}
      >
        <HeaderContent marginLeft={marginLeft} />
        <Content style={{ margin: '80px 28px 0px 28px' }}>
          <BreadcrumbLayout xs={xs} visible={visible} onVisible={onVisible} />
          <ContentPage />
        </Content>
        <FooterContent marginLeft={marginLeft} />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
