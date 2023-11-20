import { lazy } from 'react';

const Calendar = lazy(() => import('../pages/Calendar'));
const Chart = lazy(() => import('../pages/Chart'));
const FormElements = lazy(() => import('../pages/FormElements'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Tables = lazy(() => import('../pages/Tables'));

const coreRoutes = [
  {
    path: '/panel/calendar',
    title: 'Calendar',
    component: Calendar,
  },
  {
    path: '/panel/profile',
    title: 'Profile',
    component: Profile,
  },
  {
    path: '/panel/forms',
    title: 'Forms Elements',
    component: FormElements,
  },
  {
    path: '/panel/tables',
    title: 'Tables',
    component: Tables,
  },
  {
    path: '/panel/settings',
    title: 'Settings',
    component: Settings,
  },
  {
    path: '/panel/chart',
    title: 'Chart',
    component: Chart,
  },
];

const routes = [...coreRoutes];
export default routes;
