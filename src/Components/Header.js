import "../App.css";
import logo from "../assets/logo.png";
import { NavLink, useNavigate } from 'react-router-dom';

const Header = () => {

    const navigate = useNavigate();

  return (
    <div id="header">
        <div id="logo">
            <div onClick={()=>navigate('/game-page')}> <img src={logo} alt="logo" />  </div>
        </div>

        <div id="button-group">
            <NavLink  className={({isActive}) => isActive ? 'nav-options active-nav' : 'nav-options'} to='/game-page' >Game Area</NavLink>
            <NavLink  className={({isActive}) => isActive ? 'nav-options active-nav' : 'nav-options'} to='/scoreboard' activeClassName='active-nav' >Scoreboard</NavLink>
            <NavLink  className={({isActive}) => isActive ? 'nav-options active-nav' : 'nav-options'} to='/' activeClassName='active-nav' >Restart</NavLink>

        </div>
    </div>
  )
}

export default Header