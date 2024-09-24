import Layout from './components/Layout';
import UserDeleted from './components/UserDeleted';
import UserProfile from './components/UserProfile';
import ScoreHistory from './components/ScoreHistory';
import ErrorPage from './components/tabbed/ErrorPage'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import TabbedView from './components/tabbed/TabbedView';
import Launcher from './components/tabbed/Launcher';
import GolfGame from './components/tabbed/GolfGame';
import MboxLocation from './components/tabbed/MboxLocation';

export default function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <TabbedView />,
          children: [
            {
              path: "/",
              element: <Launcher text={window.location.origin} />
            },
            {
              path: "/location",
              element: <MboxLocation />
            },
            {
              path: "/playing",
              element: <GolfGame />
            },
          ]
        },
        {
          path: "/profile",
          element: <UserProfile />,
        },
        {
          path: "/history",
          element: <ScoreHistory />,
        },
        {
          path: "/confirmation",
          element: <UserDeleted />,
        }
      ],
    },

  ]);

  return (
    <RouterProvider router={router} />
  )
}

