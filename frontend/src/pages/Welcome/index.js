import logo from './logo.svg';
import './Welcome.css';
import {Link} from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="Welcome">
      <header className="Welcome-header">
        <img src={logo} className="Welcome-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Link className="Welcome-link" to="/main" rel="noopener noreferrer">Enter</Link>
      </header>
    </div>
  );
}

export default Welcome;
