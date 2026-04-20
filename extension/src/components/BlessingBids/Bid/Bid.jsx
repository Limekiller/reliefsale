import { useState, useEffect } from "react"
import './Bid.css'

function Bid({
    id,
    amount, 
    paddles, 
    updateBidData, 
    removeTier
}) {
    const [currAmount, setCurrAmount] = useState(amount)
    const [currPaddles, setCurrPaddles] = useState(paddles)

    const remove = () => {
        removeTier(id)
    }

    useEffect(() => {
        updateBidData(id, currAmount, currPaddles)
    }, [currAmount, currPaddles])

    return <div className='Bid'>
        <div className='amount'>
            <span>$</span>
            <input 
                type='number' 
                defaultValue={currAmount}
                onKeyUp={e => setCurrAmount(e.target.value)}
            />
        </div>
        <input
            type='text'
            defaultValue={currPaddles.join(', ')}
            onKeyUp={e => setCurrPaddles(e.target.value.trim().split(','))}
            placeholder="1, 59, 134, 345"
        />
        <button onClick={remove} className="remove">
            <span className="material-symbols-outlined">close</span>
        </button>
    </div>
}

export default Bid