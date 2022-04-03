import axios from 'axios';
import './App.css'

//Context
import { AuthContextProvider } from './context/AuthContext';

//Main page
import Main from './pages/Main';

axios.defaults.withCredentials = true;

function App() {
  return (
    <AuthContextProvider authKey1={'iaAuth1'} authKey2={'isAuth2'}>
      <Main />
    </AuthContextProvider>
  );
}

export default App;
