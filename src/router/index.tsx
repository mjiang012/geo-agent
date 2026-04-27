import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard';
import Keywords from '../pages/Keywords';
import Diagnosis from '../pages/Diagnosis';
import AIAnalysis from '../pages/AIAnalysis';
import Strategy from '../pages/Strategy';
import Content from '../pages/Content';
import Distribution from '../pages/Distribution';
import Monitoring from '../pages/Monitoring';
import Settings from '../pages/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/keywords',
        element: <Keywords />,
      },
      {
        path: '/diagnosis',
        element: <Diagnosis />,
      },
      {
        path: '/ai-analysis',
        element: <AIAnalysis />,
      },
      {
        path: '/strategy',
        element: <Strategy />,
      },
      {
        path: '/content',
        element: <Content />,
      },
      {
        path: '/distribution',
        element: <Distribution />,
      },
      {
        path: '/monitoring',
        element: <Monitoring />,
      },
      {
        path: '/settings',
        element: <Settings />,
      },
    ],
  },
]);
