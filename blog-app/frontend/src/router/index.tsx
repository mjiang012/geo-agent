import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import ArticleDetail from '../pages/ArticleDetail';
import ArticleEdit from '../pages/ArticleEdit';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Profile from '../pages/Profile';
import MyArticles from '../pages/MyArticles';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/article/:id',
        element: <ArticleDetail />
      },
      {
        path: '/article/edit',
        element: <ArticleEdit />
      },
      {
        path: '/article/edit/:id',
        element: <ArticleEdit />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/my-articles',
        element: <MyArticles />
      }
    ]
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export default router;
