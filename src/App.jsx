import { useContext, useEffect, useState } from 'react'
import Layout from './components/Layout';
import UserDeleted from './components/UserDeleted';
import GolfGame from './components/GolfGame';
import { AppContext, GOLFING_MODE, DELETED_MODE, PROFILE_MODE } from './state/AppContext';
import UserProfile from './components/UserProfile';

export default function App() {

  const { mode } = useContext(AppContext);
  const [current, setCurrent] = useState(null);
  const views = {
    DELETED_MODE: <UserDeleted />,
    GOLFING_MODE: <GolfGame />,
    PROFILE_MODE: <UserProfile />
  }

  useEffect(() => {
    switch (mode) {
      case DELETED_MODE:
        setCurrent(views.DELETED_MODE)
        break;
      case GOLFING_MODE:
        setCurrent(views.GOLFING_MODE)
        break;
      default:
        setCurrent(views.PROFILE_MODE)
    }
  }, [mode])

  return (
    <Layout>
      {current}
    </Layout>
  )
}

