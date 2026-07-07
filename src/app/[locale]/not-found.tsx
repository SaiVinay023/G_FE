/* eslint-disable react-hooks/rules-of-hooks */
import { useTranslations } from 'next-intl';

const NotFoundPage = () => {
  const t = useTranslations();
  return <div>{t('not-found.404_not_found')}</div>;
};

export default NotFoundPage;
