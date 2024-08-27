import { useContext } from 'react'
import Layout from './components/Layout';
import LocationCode from './components/LocationCode';
import InvitationCode from './components/InvitationCode';
import { AppContext, LOCATION_MODE } from './state/AppContext';


function App() {

  const { session, mode } = useContext(AppContext);

  return (
    <Layout>
      {mode !== LOCATION_MODE ? <LocationCode /> : <InvitationCode />}
    </Layout>
  )
}

export default App
