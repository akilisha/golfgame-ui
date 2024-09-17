import { useContext, useEffect, useState } from 'react'
import Layout from './components/Layout';
import UserDeleted from './components/UserDeleted';
import GolfGame from './components/GolfGame';
import { AppContext, GOLFING_MODE, DELETED_MODE, HISTORY_MODE } from './state/AppContext';
import UserProfile from './components/UserProfile';
import ScoreHistory from './components/ScoreHistory';

export default function App() {

  const { mode } = useContext(AppContext);
  const [current, setCurrent] = useState(null);
  const views = {
    DELETED_MODE: <UserDeleted />,
    GOLFING_MODE: <GolfGame />,
    PROFILE_MODE: <UserProfile />,
    HISTORY_MODE: <ScoreHistory />,
  }

  useEffect(() => {
    switch (mode) {
      case DELETED_MODE:
        setCurrent(views.DELETED_MODE)
        break;
      case GOLFING_MODE:
        setCurrent(views.GOLFING_MODE)
        break;
      case HISTORY_MODE:
        setCurrent(views.HISTORY_MODE)
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

