import { useAppSelector } from 'hooks';
import { personalUrl } from 'layouts/Menu/menu';
import { MenuItemType } from 'models/menu';
import { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function PermissionRoute({ children }: any) {
  const menuList = useAppSelector((state) => state.auth.menus);
  const router = useLocation();
  const isAllowAccess: boolean = useMemo(() => {
    if (router.pathname === '/') return true;
    const urlPathArray = menuList?.flatMap((item: MenuItemType) => {
      if (item?.children) {
        return item?.children.flatMap((el: MenuItemType) => {
          return el?.path;
        });
      }
      return item?.path;
    });
    urlPathArray.splice(0, 1);
    const accessUrls = [...urlPathArray, ...personalUrl];
    const isAllowAccess = !!accessUrls.find((item?: string) => {
      return router.pathname?.includes(item ?? '');
    });
    return isAllowAccess;
  }, [menuList, personalUrl, router]);

  return isAllowAccess ? children : <Navigate to="403" />;
}
