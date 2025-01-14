import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { AuthContext } from './../../context/AuthContext';
import { auth, db } from '../../firebase';
import './login.scss';
import { getUserData } from './../../api/user';

function Login() {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const userData = await getUserData(user.uid);
      const userWithUserData = {
        ...user,
        userData
      };
      dispatch({ type: 'LOGIN', payload: userWithUserData });
      navigate('/');
    } catch (err) {
      console.log({ err });
    }
  }

  return (
    <div className="login">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-container">
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
            type="text"
            name="email"
            id="email"
          />
        </div>
        <div className="input-container">
          <input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            type="password"
            name="password"
            id="password"
          />
        </div>
        <Link to="/register" className="link">
          Don't you have an account?
        </Link>
        <button>login</button>
      </form>
      {error && <p className="error-text">Wrong password or email!</p>}
    </div>
  );
}

export default Login;
