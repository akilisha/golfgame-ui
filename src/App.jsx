import { useContext, useEffect, useState } from 'react'
import Layout from './components/Layout';
import UserDeleted from './components/UserDeleted';
import PlayActivities from './components/PlayActivities';
import { AppContext, GOLFING_MODE, DELETED_MODE, PROFILE_MODE, QR_CODE_MODE } from './state/AppContext';
import UserProfile from './components/UserProfile';
import ScanQRCode from './components/ScanQRCode';

export default function App() {

  const { mode } = useContext(AppContext);
  const [current, setCurrent] = useState(null);
  const views = {
    DELETED_MODE: <UserDeleted />,
    GOLFING_MODE: <PlayActivities />,
    PROFILE_MODE: <UserProfile />,
    QR_CODE_MODE: <ScanQRCode />
  }

  useEffect(() => {
    switch (mode) {
      case DELETED_MODE:
        setCurrent(views.DELETED_MODE)
        break;
      case GOLFING_MODE:
        setCurrent(views.GOLFING_MODE)
        break;
      case QR_CODE_MODE:
        setCurrent(views.QR_CODE_MODE)
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

