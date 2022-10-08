import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import BreadcrumbsContent from './BreadcrumbsContent';

interface IProps {
  xs: boolean | undefined;
  visible: boolean;
  onVisible: (toggle: boolean) => void;
}
export default function BreadcrumbLayout({ xs, visible, onVisible }: IProps) {
  const router = useLocation();

  const getBreadcrumb = () => {
    const path = router.pathname;

    if (path === '/')
      return [
        {
          title: 'Home',
        },
      ];

    const newBreadcrumbs =
      BreadcrumbsContent.find((bc) => path.includes(bc.path))?.breadcrumbs ||
      [];

    return newBreadcrumbs;
  };

  const renderItemBreadcrubHandler = () => {
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
  return (
    <>
      {xs &&
        React.createElement(visible ? MenuUnfoldOutlined : MenuFoldOutlined, {
          onClick: () => onVisible(!visible),
        })}
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>
          <Link to="/">
            <HomeOutlined />
          </Link>
        </Breadcrumb.Item>
        {renderItemBreadcrubHandler()}
      </Breadcrumb>
    </>
  );
}
