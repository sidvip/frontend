import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import { useEffect, useState } from 'react';
import History from './History';
import axios from 'axios';

function App() {

  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const login = useGoogleLogin({
    onSuccess: token => {
      axios.get(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${token?.access_token}`)
        .then((response) => {
          localStorage.setItem('email', response?.data?.email);
          window.location.reload();
        }).catch((error) => {
          setError(error?.message)
        })
    },
    onError: errorMessage => setError(errorMessage)
  });

  useEffect(() => {
    if (localStorage.getItem('email')) {
      axios.get(`http://localhost:8000/history?email=${localStorage.getItem('email')}`)
        .then(({ data }) => {
          setData(data);
        }).catch((error) => {
          setError(error.message);
        })
    }
  }, []);

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {localStorage.getItem('email') && <label style={{ margin: 10 }}>Email: {localStorage.getItem('email')}</label>}
      <div style={{ width: '200px', display: 'flex', gap: 10 }}>
        <button onClick={() => login()}>Sign In</button>
        {localStorage.getItem('email') ? <button onClick={() => {
          googleLogout();
          localStorage.removeItem('email');
          window.location.reload();
        }}>Logout</button> : null}
      </div>
      {
        error && <span style={{ color: 'red', fontSize: '20px', margin: 10 }}>{error}</span>
      }
      {localStorage.getItem('email') ? <History data={data} /> : <>You are not logged in</>}

    </div>
  );
}

export default App;
