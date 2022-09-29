import { HomeOutlined } from '@ant-design/icons';
import { Breadcrumb, Drawer, Grid, Layout } from 'antd';
import Breadcrumbs from 'layouts/Common/Breadcrumb';
import Footer from 'layouts/Common/Footer';
import Header from 'layouts/Common/Header';
import MenuSidebar from 'layouts/Menu';
import { useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import ucwords from 'utils/ucwords';
const { Content, Sider } = Layout;

const { useBreakpoint } = Grid;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const { xs, sm, lg } = useBreakpoint();
  const router = useLocation();

  document.title = useMemo(() => {
    const paths = router.pathname.split('/');
    const pathName = paths[paths.length - 1];

    if (router.pathname === '/') return 'Dashboard';

    return `${ucwords(paths[1])} | ${ucwords(pathName)}`;
  }, [router]);

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
    const imageLink = process.env.REACT_APP_IMAGE_FILE_LINK;

    if (xs) {
      return imageLink?.replace('fileName', 'main-logo');
    }

    return imageLink?.replace(
      'fileName',
      collapsed ? 'small-logo' : 'main-logo',
    );
  };

  const itemRender = () => {
    const bc = getBreadcrumb();

    return bc.map((r: any, i: number) => {
      if (r.path) {
        return (
          <Breadcrumb.Item key={i}>
            <Link to={r.path}>{r.title}</Link>
          </Breadcrumb.Item>
        );
      }

      return <Breadcrumb.Item key={i}>{r.title}</Breadcrumb.Item>;
    });
  };

  const getBreadcrumb = () => {
    const path = router.pathname;

    if (path === '/')
      return [
        {
          title: 'Dashboard',
        },
      ];

    const newBreadcrumbs =
      Breadcrumbs.find((bc) => path.includes(bc.path))?.breadcrumbs || [];

    return newBreadcrumbs;
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
            padding: `${collapsed ? '14px' : '18px'} 24px`,
          }}
        >
          <Link to="/">
            <img
              src="/images/logo-company.svg"
              style={{
                width: '100%',
              }}
              alt="Minswap"
            />
          </Link>
        </div>
        {/* <MenuSidebar collapsed={collapsed} /> */}
        <MenuSidebar />
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
        <Header sidebarWidth={marginLeft} />
        <Content style={{ margin: '80px 16px 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>
              <Link to="/">
                <HomeOutlined />
              </Link>
            </Breadcrumb.Item>
            {itemRender()}
          </Breadcrumb>
          <Outlet />
        </Content>
        <Footer sidebarWidth={marginLeft} />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
