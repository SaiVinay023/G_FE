import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs as MUIBreadcrumbs, Link as MuiLink } from '@mui/material';

export interface Breadcrumb {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
  return (
    <MUIBreadcrumbs separator={<NavigateNextIcon fontSize="small" sx={{ color: 'grey.500' }} />}>
      {breadcrumbs.map((b, i) => (
        <MuiLink
          key={i}
          href={b.href || '#'}
          underline={b.href ? 'hover' : 'none'}
          sx={{
            fontWeight: i === breadcrumbs.length - 1 ? 'normal' : 'bold',
            fontSize: 15,
            color: b.href ? 'primary.main' : 'text.secondary',
            cursor: b.href ? 'pointer' : 'default',
          }}
        >
          {b.name}
        </MuiLink>
      ))}
    </MUIBreadcrumbs>
  );
};
