import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import EuroIcon from '@mui/icons-material/Euro';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ViewKanbanOutlinedIcon from '@mui/icons-material/ViewKanbanOutlined';
import React from 'react';

export interface MenuRoute {
  path: string;
  name: string;
  icon: React.ReactNode;
  children?: MenuRoute[];
}

export const routes: MenuRoute[] = [
  {
    path: '/today',
    name: 'today',
    icon: <ViewKanbanOutlinedIcon />,
  },
  {
    path: '/scheduling',
    name: 'scheduling',
    icon: <CalendarMonthIcon />,
  },
  {
    path: '/estimates',
    name: 'estimates',
    icon: <EuroIcon />,
  },
  {
    path: '/canned',
    name: 'canned',
    icon: <ContentPasteOutlinedIcon />,
  },
  {
    path: '/customers',
    name: 'customers',
    icon: <PeopleAltOutlinedIcon />,
    children: [
      {
        path: '/chat',
        name: 'chat',
        icon: <QuestionAnswerOutlinedIcon />,
      },
    ],
  },
  {
    path: '/settings',
    name: 'settings',
    icon: <SettingsOutlinedIcon />,
    children: [
      {
        path: '/users',
        name: 'users',
        icon: <PeopleAltOutlinedIcon />,
      },
    ],
  },
];
