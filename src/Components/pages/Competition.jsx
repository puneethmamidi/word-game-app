import React, { useEffect, useState, useRef} from 'react'
import '../pages/Practice.css';
import '../pages/Competition.css';
import { Icon } from 'react-icons-kit';
import {chevronRight} from 'react-icons-kit/typicons/chevronRight';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Practice_validations from './Practice_validation';



function Competition() {
  const navigate = useNavigate();
  const [values,setValues] = useState({
    user_data:''
  })
  
  const [score, setScore] = useState(null);
  const [competitorScore, setCompScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [errors, setErrors] = useState({});
  const [isScoreGenerated, setIsScoreGenerated] = useState(false);
  const [isScore, setIsScore] = useState(true);
  const [currentId, setCurrentId] = useState(11);
  const [isStart, setIsStart] = useState(true)
  const [competitors, setCompetitors] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0)
  const [objects, setObject] = useState({});
  const textareaRef = useRef();
  const [auth,setAuth] = useState(false)
  const [username, setName] = useState('');
  const [player_id, setUserId] = useState('');
  const [count, setCount] = useState(1);
  const handlePaste = (event) => {
        event.preventDefault();
      };
  const handleCopy = (event) => {
        event.preventDefault();
  }; 
  const handleCut = (event) => {
    event.preventDefault();
};
 // HandleScore
 const handleScore = (event) => {
  event.preventDefault();
  const err = Practice_validations(values);
  setErrors(err);
  const data = { username };
  const player = data.username;
  const competitor = competitors[currentIndex].trim();
  const word = objects.word;
  const word_id = currentId;
  const user_ans = values.user_data;

  setLoading(true);

  axios.post('http://localhost:8081/humanCompetition-score', { values, player, competitor, word, word_id, user_ans })
  .then(response => {
      const { score, competitorScore, message } = response.data;
      if (response.data === 'NaN') {
        setIsScoreGenerated(false);
      } else {
        setIsScoreGenerated(true);
        textareaRef.current.disabled = true;
        setIsScore(false);
      }
      setScore(score);
      setCompScore(competitorScore);
      setLoading(false);
      Swal.fire({
        title: `Total Score:`,
        width: 600,
        padding: "3em",
        color: "#716add",
        html: `
          <div style="border: 1px solid #ddd; border-radius: 10px; padding: 20px; text-align: center;">
            <table class="table table-striped" style="margin: 0 auto; width: 100%; border-collapse: separate; border-spacing: 0 10px;">
              <thead style="background-color: #f7f7f7; border-bottom: 1px solid #ddd;">
                <tr>
                  <th style="padding: 10px; border-right: 1px solid #ddd;">Username</th>
                  <th style="padding: 10px;">Score</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="padding: 10px; border-right: 1px solid #ddd; word-break: break-word;">${player}</td>
                  <td style="padding: 10px;">${score}</td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-right: 1px solid #ddd; word-break: break-word;">${competitor}</td>
                  <td style="padding: 10px;">${competitorScore}</td>
                </tr>
              </tbody>
            </table>
          </div>
        `,
        backdrop: `
          rgba(0, 0, 0, 0.65)
        `,
      });
      console.log(message); // log the message from the backend
    })
  .catch(error => {
      console.error(error);
      setLoading(false);
    });  
};
    
  // Fetching Objects
  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(`http://localhost:8081/object/${currentId}`);
      setObject(result.data);
      
    };

    fetchData();
  }, [currentId]);
  
  const current_user = username;
  useEffect(() => {
    axios.get('http://localhost:8081')
      .then(res => {
        if (res.data.Status === "Success") {
          setAuth(true)
          setName(res.data.username);
          setUserId(res.data.id);
        } else {
          console.log(res.data.Error)
        }
      });
  }, []);  
// Fetching Competitors
useEffect(() => {
 
  const data = {username}
  fetch('http://localhost:8081/fetchCompetitors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      const uniqueCompetitors = [...new Set(data.filter(competitor => competitor !== current_user))];
      setCompetitors(uniqueCompetitors);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}, [current_user]);
// Timer
const Ref = useRef(null);

	// The state for our timer
	const [timer, setTimer] = useState("00:00:00");

	const getTimeRemaining = (e) => {
		const total =
			Date.parse(e) - Date.parse(new Date());
		const seconds = Math.floor((total / 1000) % 60);
		const minutes = Math.floor(
			(total / 1000 / 60) % 60
		);
		const hours = Math.floor(
			(total / 1000 / 60 / 60) % 24
		);
		return {
			total,
			hours,
			minutes,
			seconds,
		};
	};

	const startTimer = (e) => {
		let { total, hours, minutes, seconds } =
			getTimeRemaining(e);
		if (total >= 0) {
			// update the timer
			// check if less than 10 then we need to
			// add '0' at the beginning of the variable
			setTimer(
				(hours > 9 ? hours : "0" + hours) +
				":" +
				(minutes > 9
					? minutes
					: "0" + minutes) +
				":" +
				(seconds > 9 ? seconds : "0" + seconds)
			);
		}
	};

	const clearTimer = (e) => {
		// If you adjust it you should also need to
		// adjust the Endtime formula we are about
		// to code next
		setTimer("00:02:00");

		// If you try to remove this line the
		// updating of timer Variable will be
		// after 1000ms or 1sec
		if (Ref.current) clearInterval(Ref.current);
		const id = setInterval(() => {
			startTimer(e);
		}, 1000);
		Ref.current = id;
	};

	const getDeadTime = () => {
		let deadline = new Date();

		// This is where you need to adjust if
		// you endtend to add more time
		deadline.setMinutes(deadline.getMinutes() + 2);
		return deadline;
	};
// Disable the Textarea
useEffect(() => {
  if (timer === "00:00:00") {
    textareaRef.current.disabled = true;
      setIsScore(true);
    } else {
      textareaRef.current.disabled = false;
      setIsScore(false);
    }
}, [timer]);
  
// Start button
const handleStart = () =>{
  clearTimer(getDeadTime());
  setIsStart(false)
}
// Handle Next 
const handleNext = () => {
  if (currentId < 31 ){
    textareaRef.current.value = '';
      setScore(null);
      //const randomIndex = Math.floor(Math.random() * 21);
      
      setCurrentIndex(currentIndex + 1);
      setCurrentId(currentId + 1);
      setIsScoreGenerated(false)
      setCount(count + 1);
      setIsStart(true)
  }else if(currentId===30){
    textareaRef.current.value = '';
    setScore(null);
    axios.post('http://localhost:8081/leave_competition', { username })
      .then(response => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: response.data,
          showConfirmButton: true,
        });
        navigate('/human')
      })
      .catch(error => {
        console.error(error);
      });
  };
    
  
}

  
  return (
    <div>
      <div className = 'practice-card'>
        <div className='word'>
          <p id='word-p'>{objects.word}</p>
        </div>
        <div className = 'explain'>
          <p>Explain the value of this word to someone in simple terms in English. You will be assessed based on how easily understandable your answer is</p>
        </div>
        <div >
          <textarea className='text-area'onCopy={handleCopy} onPaste={handlePaste} onCut={handleCut} placeholder='Write the answer here (The word limit is 120 words)'minLength='1' maxLength='600' name='user_data'ref={textareaRef}  onChange={e => setValues({...values,user_data:e.target.value})}>
          </textarea>
        </div>
        <div className='gbt-cont'>
          <button onClick={handleScore} disabled={!isScore} className={`gbt ${!isScore? 'disabled' : ''} ${loading? 'loading' : ''}`}>{loading ? 'Loading...' : 'Generate Score'}</button>
        </div>
        <div className='score'> 
            <span id="score-d">Score: {score}</span>
          </div>
        <div className='nb-comp'>
          <button onClick={handleNext} disabled={!isScoreGenerated} className={`nbd ${!isScoreGenerated ? 'disabled' : ''}`}>Next<Icon className='chevron' icon={chevronRight} size={22} /></button>
        </div>
        <div>
          <span className='page-comp'>{count}/21</span>
        </div>
      </div>
      <div className='comp-cont'>
        <p className='comp'>Competing with: {competitors[currentIndex]}</p>
      </div>
      <div>
        <p className='time'>{timer}</p>
      </div>
      <div>
        <button onClick={handleStart} disabled={!isStart} className={`start ${!isStart ? 'disabled' : ''}`}>Start</button>
      </div>
      {errors.user_data && <span className='comp-error-p'>{errors.user_data}</span>}
    </div>  
  )
}

export default Competition;
