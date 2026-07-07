export type SidebarTranslationKeys =
  | 'Sidebar.today'
  | 'Sidebar.scheduling'
  | 'Sidebar.estimates'
  | 'Sidebar.canned'
  | 'Sidebar.customers'
  | 'Sidebar.settings'
  | 'Sidebar.users'
  | 'Sidebar.chat';

export const translateNavigationItem = (title: string, t: (key: SidebarTranslationKeys) => string): string => {
  switch (title) {
    case 'today':
      return t('Sidebar.today');
    case 'scheduling':
      return t('Sidebar.scheduling');
    case 'estimates':
      return t('Sidebar.estimates');
    case 'canned':
      return t('Sidebar.canned');
    case 'customers':
      return t('Sidebar.customers');
    case 'settings':
      return t('Sidebar.settings');
    case 'users':
      return t('Sidebar.users');
    case 'chat':
      return t('Sidebar.chat');
    default:
      return title;
  }
};
