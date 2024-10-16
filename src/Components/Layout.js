import { useContext , useEffect , useState } from 'react'
import ReactConfetti from 'react-confetti'
import { gamingContext } from '../GlobalState/GamingContext'
import CreateOrJoinGame from './CreateOrJoinGame';
import PlayArea from './PlayArea';
import ResultConatiner from './ResultConatiner';
import Header from './Header';

const Layout = () => {
    const {blastPop,isLoading,playerData,socket} = useContext(gamingContext);
    const[windowSize , setWindowSize] = useState({height:window.innerHeight , width:window.innerWidth});


    // detect window size
    function findWindowSize(){
        setWindowSize({height:window.innerHeight , width:window.innerWidth})
    }

    // confetti effect
    useEffect(() => {
        window.addEventListener("resize" , findWindowSize);

        return () => {
            window.removeEventListener("resize" , findWindowSize);
        }
    },[windowSize])

  return (
    <div>
        {
            blastPop ?
            <ReactConfetti
            height = {windowSize.height}
            width = {windowSize.width}
            run = {blastPop}
            /> : ""
            
        }

        {
            isLoading  ? <p>LOADING....</p> : <>
            <Header />
            <CreateOrJoinGame />
            {socket && playerData? <PlayArea /> : "Loading..."}
            <ResultConatiner />
            </>
        }
        
    </div>
  )
}

export default Layout