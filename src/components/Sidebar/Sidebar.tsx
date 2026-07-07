import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuIcon from '@mui/icons-material/Menu';
import {
  Box,
  darken,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Collapse,
} from '@mui/material';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FC, Fragment } from 'react';

import miniLogoSrc from 'public/carsulogo.png';
import logoSrc from 'public/mainLogo.png';
import { SidebarTranslationKeys, translateNavigationItem } from 'src/components/Sidebar/translateNavigationItem';
import { useOpenMenus } from 'src/hooks/useOpenMenus';

import { usePathname, Link } from '../../i18n/routing';
import { routes } from '../../routes';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const drawerWidth = 340;
export const collapsedWidth = 68;

const Sidebar: FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const t = useTranslations() as (key: SidebarTranslationKeys) => string;
  const theme = useTheme();
  const pathname = usePathname();
  const openMenus = useOpenMenus(routes);

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const textColor = theme.palette.getContrastText(theme.palette.primary.main);

  const handleToggleMenu = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    <Box
      component="nav"
      sx={{
        height: '100%',
        width: {
          sm: isMobile ? 0 : isOpen ? drawerWidth : collapsedWidth,
        },
        flexShrink: { sm: 0 },
        zIndex: 1202,
      }}
    >
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isOpen}
        onClose={toggleSidebar}
        ModalProps={{
          keepMounted: true,
        }}
        sx={(theme) => ({
          'display': 'block',
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: isOpen ? drawerWidth : collapsedWidth,
            background: theme.palette.primary.main,
            borderRight: `1px solid ${theme.palette.primary.main}`,
            overflowX: 'hidden',
            overflowY: 'auto',
            height: '100%',
            transition: theme.transitions.create(['width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          },
        })}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          width={isOpen ? drawerWidth : collapsedWidth}
          height={64}
          minHeight={64}
          overflow="hidden"
        >
          <Box
            component={Image}
            width={isMobile ? 142 : isOpen ? 200 : collapsedWidth}
            height={isMobile ? 30 : 48}
            src={isOpen ? logoSrc : miniLogoSrc}
            alt="Carsu Technologies"
            sx={{ objectFit: 'contain' }}
          />

          {isOpen && (
            <IconButton aria-label="open drawer" edge="start" onClick={toggleSidebar} sx={{ color: 'white' }}>
              <MenuIcon />
            </IconButton>
          )}
        </Box>

        <List>
          {routes.map((menuRoute) => {
            const isActive = pathname === menuRoute.path || pathname.includes(menuRoute.path);
            const isExpanded = openMenus[menuRoute.path] || false;
            const hasChildren = (menuRoute.children ?? []).length > 0;

            return (
              <Fragment key={menuRoute.path}>
                <ListItem
                  component={Link}
                  href={menuRoute.path}
                  passHref
                  sx={{
                    'minHeight': 72,
                    'backgroundColor': isActive ? darken(theme.palette.primary.main, 0.2) : 'transparent',
                    'borderLeft': isActive ? `4px solid ${theme.palette.warning.main}` : 'none',
                    'textDecoration': 'none',
                    'color': 'inherit',
                    'display': 'flex',
                    'alignItems': 'center',
                    'padding': '8px 16px',
                    '&:hover': {
                      backgroundColor: darken(theme.palette.primary.main, 0.15),
                    },
                  }}
                  onClick={(e) => {
                    if (!hasChildren) {
                      handleToggleMenu();
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: isActive ? theme.palette.common.white : textColor }}>
                    {menuRoute.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={translateNavigationItem(menuRoute.name, t)}
                    slotProps={{
                      primary: {
                        sx: { fontSize: 18 },
                      },
                    }}
                    sx={{ color: isActive ? theme.palette.common.white : textColor }}
                  />

                  {hasChildren &&
                    (isExpanded ? (
                      <ExpandLessIcon sx={{ color: textColor }} />
                    ) : (
                      <ExpandMoreIcon sx={{ color: textColor }} />
                    ))}
                </ListItem>

                {menuRoute.children && (
                  <Collapse in={isExpanded || isActive} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {menuRoute.children.map((childRoute) => {
                        const isChildActive = pathname === childRoute.path || pathname.includes(childRoute.path);

                        return (
                          <ListItem
                            component={Link}
                            href={childRoute.path}
                            passHref
                            key={childRoute.path}
                            sx={{
                              'minHeight': 64,
                              'pl': 4,
                              'backgroundColor': isChildActive
                                ? darken(theme.palette.primary.main, 0.15)
                                : 'transparent',
                              'borderLeft': isChildActive ? `4px solid ${theme.palette.warning.light}` : 'none',
                              'textDecoration': 'none',
                              'color': 'inherit',
                              'display': 'flex',
                              'alignItems': 'center',
                              'padding': '8px 16px',
                              'paddingLeft': '32px',
                              '&:hover': {
                                backgroundColor: darken(theme.palette.primary.main, 0.1),
                              },
                            }}
                            onClick={handleToggleMenu}
                          >
                            <ListItemIcon sx={{ color: isChildActive ? theme.palette.common.white : textColor }}>
                              {childRoute.icon}
                            </ListItemIcon>

                            <ListItemText
                              primary={translateNavigationItem(childRoute.name, t)}
                              slotProps={{
                                primary: {
                                  sx: { fontSize: 18 },
                                },
                              }}
                              sx={{ color: isChildActive ? theme.palette.common.white : textColor }}
                            />
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </Fragment>
            );
          })}
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
