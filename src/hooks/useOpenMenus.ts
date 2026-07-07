import { useMemo } from 'react';

import { usePathname } from 'src/i18n/routing';
import { MenuRoute } from 'src/routes';

export const useOpenMenus = (routes: MenuRoute[]): Record<string, boolean> => {
  const pathname = usePathname();

  return useMemo(() => {
    const result: Record<string, boolean> = {};

    const traverseRoutes = (routes: MenuRoute[]): boolean => {
      let isAnyActive = false;

      for (const route of routes) {
        if (pathname === route.path) {
          result[route.path] = true;
          isAnyActive = true;
        }

        if (route.children) {
          const isChildActive = traverseRoutes(route.children);
          if (isChildActive) {
            result[route.path] = true;
            isAnyActive = true;
          }
        }
      }

      return isAnyActive;
    };

    traverseRoutes(routes);
    return result;
  }, [pathname, routes]);
};
