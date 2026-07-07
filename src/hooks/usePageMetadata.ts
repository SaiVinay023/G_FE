import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { usePathname } from 'src/i18n/routing';

export interface Breadcrumb {
  name: string;
  href?: string;
}

export const usePageMetadata = (isMobile: boolean) => {
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations();

  return useMemo(() => {
    if (isMobile) {
      return {
        heading: '',
        disableSearch: false,
        breadcrumbs: [],
      };
    }

    let heading = '';
    let disableSearch = false;
    let breadcrumbs: Breadcrumb[] = [];

    switch (pathname) {
      case '/today':
        heading = t('Today.title');
        break;

      case '/scheduling':
        heading = t('Sidebar.calendar');
        break;

      case '/canned':
        heading = t('Canned.pageTitle');
        // breadcrumbs = [{ name: 'CANNED JOBS', href: '/canned' }, { name: 'ALL' }];
        break;

      case '/chat':
        heading = t('Sidebar.chat');
        // breadcrumbs = [{ name: 'CANNED JOBS', href: '/canned' }, { name: 'ALL' }];
        break;

      case '/customers':
        heading = t('customers.allCustomers');
        break;

      case `/customers/${params.id}`:
        heading = t('customers.customerDetails');
        disableSearch = true;
        // breadcrumbs = [{ name: t('customers.allCustomers'), href: '/customers' }, { name: params.id as string }];
        break;

      case '/estimates':
        heading = t('Estimates.allestimates');
        break;

      case `/estimates/${params.id}`:
        heading = t('Estimates.estimateDetails');
        // breadcrumbs = [{ name: 'ALL ESTIMATES', href: '/estimates' }, { name: 'ESTIMATE DETAILS' }];
        break;
      case `/estimates/create/${params.contactId}/${params.id}`:
        heading = t('page.create_estimate');
        disableSearch = true;
        // breadcrumbs = [{ name: 'ALL ESTIMATES', href: '/estimates' }, { name: 'ESTIMATE DETAILS' }];
        break;

      case '/settings':
        heading = t('Settings.title');
        disableSearch = true;
        break;

      case '/users':
        heading = t('ShopUsersPage.pageTitle');
        break;

      default:
        heading = t('pageTitle');
        disableSearch = true;
        break;
    }

    if (params.action) {
      heading =
        params.action === 'create' || params.action === 'copy'
          ? t('createCanned.createCannedJob')
          : params.action === 'edit'
            ? t('Added.editCanned')
            : '';

      // breadcrumbs = [
      //   { name: t('Canned.pageTitle'), href: '/canned' },
      //   {
      //     name:
      //       params.action === 'create' || params.action === 'copy'
      //         ? t('Users.create')
      //         : params.action === 'edit'
      //           ? t('Single.edit')
      //           : '',
      //   },
      // ];
    }

    return {
      heading,
      disableSearch,
      breadcrumbs: breadcrumbs.length > 1 ? breadcrumbs : [],
    };
  }, [pathname, params, t, isMobile]);
};
