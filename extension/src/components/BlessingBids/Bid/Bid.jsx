import { useState, useEffect } from "react"
import './Bid.css'

function Bid({amount, paddles, index, updateBidData}) {
    const [currAmount, setCurrAmount] = useState(amount)
    const [currPaddles, setCurrPaddles] = useState(paddles)

    useEffect(() => {
        updateBidData(index, amount, paddles)
    }, [currAmount, currPaddles])

    return <div className='Bid'>
        <input 
            type='number' 
            defaultValue={currAmount}
            onChange={e => setCurrAmount(e.target.value)}
        />
        <input
            type='text'
            defaultValue={currPaddles.join(', ')}
            onChange={e => setCurrPaddles(e.target.value.trim().split(','))}
        />
    </div>
}

export default Bid