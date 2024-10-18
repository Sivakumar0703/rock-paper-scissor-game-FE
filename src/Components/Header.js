import "../App.css";
import logo from "../assets/logo.png";
import { NavLink, useNavigate } from 'react-router-dom';

const Header = () => {

    const navigate = useNavigate();

    function restartGame(){
      sessionStorage.clear();
      navigate('/',{replace:true});
      window.location.reload();
    }

  return (
    <div id="header">
        <div id="logo">
          <div onClick={()=>navigate('/game-page')}> <img src={logo} alt="logo" />  </div>
        </div>

        <div id="button-group">
          <NavLink  className={({isActive}) => isActive ? 'nav-options active-nav' : 'nav-options'} to='/game-page' >Game Area</NavLink>
          <NavLink  className={({isActive}) => isActive ? 'nav-options active-nav' : 'nav-options'} to='/scoreboard'  >Scoreboard</NavLink>
          <NavLink  className={({isActive}) => isActive ? 'nav-options active-nav' : 'nav-options'} to='/'   onClick={restartGame} >Restart</NavLink>

        </div>
    </div>
  )
}

export default Header