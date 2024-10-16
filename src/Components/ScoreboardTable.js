import axios from 'axios';
import { useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { gamingContext } from '../GlobalState/GamingContext';
import moment from "moment";
import "../App.css";
import Header from './Header';

const ScoreboardTable = () => {

    const{url} = useContext(gamingContext);
    const [winnersList , setWinnersList] = useState([]);
    const [isLoading , setIsLoading] = useState(false);

    async function getWinnersData(){
        try {
            const winnerList = await axios.get(`${url}/get/winners_list`);
            setWinnersList(winnerList.data.winnerList);
            setIsLoading(true);
        } catch (error) {
            toast.error('internal server error'.toUpperCase());
        }
    }

    function convertScoreValues(ary){
        let score = [];
        ary.map((result) => {
            if(result){
                score.push('WIN');
            } else {
                score.push('LOSS');
            }
        })
        return score.join('--')
    }

    useEffect(() => {
        getWinnersData()
    },[])



  return (
    <div id="scoreboard">
        <Header />
        <h1 id="scoreboard-title">SCOREBOARD</h1>
        {
            isLoading ? <>
            <table className="table table-striped table-hover table-bordered table-responsive table-dark">
            <thead>
                <tr className='table-primary'>
                <th scope="col">SI.NO</th>
                <th scope="col">WINNER</th>
                <th scope="col">OPPONENT</th>
                <th scope="col" style={{textAlign:"center"}}>SCORE</th>
                <th scope="col">DATE</th>
                <th scope="col" style={{textAlign:"center"}}>TIME</th>
                </tr>
            </thead>
            <tbody>
            {
             winnersList.map((winner,index) => {
             let date = new Date(winner.created_at);
             return(
                <tr key={index}>
                    <td>{index+1}</td>
                    <td style={{color:"green"}}>{winner.name}</td>
                    <td style={{color:"red"}}>{winner.opponent_name}</td>
                    <td style={{textAlign:"center"}}>{convertScoreValues(winner.score)}</td>
                    <td>{moment(date).format('ll')}</td>
                    <td style={{textAlign:"center"}}>{moment(date).format('LT')}</td>
                </tr>
            )
                })
            }
    
            </tbody>
            </table>

            </> : <p>Loading...</p>
        }
    </div>
  )
}

export default ScoreboardTable