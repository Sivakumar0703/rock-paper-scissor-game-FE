
import "../App.css";
import axios from 'axios';
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { gamingContext } from '../GlobalState/GamingContext';
import { toast } from "react-toastify";

const RegisterPage = () => {
    const navigate = useNavigate();
    const {url,setPlayerId,playerName,setPlayerName,setTrigger} = useContext(gamingContext);


    async function createGamer(){
        try {
            const gamerId = await axios.post(`${url}/create_gamer` , {name:playerName});
            setPlayerId(gamerId.data.data.id);
            let data = {
                name:playerName,
                id:gamerId.data.data.id,
                isPlayer1:null,
                result:[]
            }
            sessionStorage.setItem("playerId",JSON.stringify({id:gamerId.data.data.id}))
            sessionStorage.setItem("gamer",JSON.stringify(data));     
            navigate('/game-page');
            setTrigger((prev) => !prev);
        } catch (error) {
            toast.error("internal error occured".toUpperCase());
            console.log('error in saving gamer detail',error)
        }

    }


    function handleClick(){

        if(playerName && playerName.length>3){
            createGamer();
        } else {
            alert("User Name should be more than 3 characters")
            return
        }
    }


  return (
    <div id="register-page">

        <h3>ROCK  -  PAPER  -  SCISSOR</h3>

        <div id="register-card">
            <div id="img-container">
            <div>
                <label htmlFor="playerName" style={{color:"white"}}>ENTER YOUR NAME</label>
            </div>

            <div>
                <input id="playerName" placeholder="" type="text" value={playerName} onChange={(e)=> setPlayerName(e.target.value)} style={{padding:"5px",borderRadius:"5px"}} />
            </div>

            <div>
                <button className="btn btn-success" onClick={handleClick}>ENTER GAME</button>
            </div>
            </div>
        </div>


    </div>
  )
}

export default RegisterPage







