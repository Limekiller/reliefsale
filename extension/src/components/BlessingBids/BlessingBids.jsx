import { useState, useEffect } from 'react'
import './BlessingBids.css'

import Bid from './Bid/Bid'

let nextId = 0

function BlessingBids({ auctionId }) {
    const [active, setActive] = useState(false)
    const [bidData, setBidData] = useState([
        {amount: 500, paddles: [1, 2, 3]}
    ])

    const updateBidData = (i, amount, paddles) => {
        const updatedArray = bidData.map((item, index) => {
            if (index === i) {
                return { amount: amount, paddles: paddles }
            }
            return item
        })
        setBidData(updatedArray)
    }

    const addTier = () => {
        setBidData([...bidData, {
            amount: bidData.slice(-1)[0].amount - 50,
            paddles: []
        }])
    }

    return <div className='BlessingBids'>
        <button onClick={() => setActive(!active)}>
            {active ? "Hide" : "Show"} Blessing Bids
        </button>
        {active ? 
            <div className='bidForm'>
                {bidData.map((tier, i) => {
                    return <Bid 
                        amount={tier.amount} 
                        paddles={tier.paddles} 
                        index={i}
                        updateBidData={updateBidData}
                        key={i} 
                    />
                })}
                <button class="addTier" onClick={addTier}>Add tier</button>
            </div>

        : ""}
    </div>
}

export default BlessingBids