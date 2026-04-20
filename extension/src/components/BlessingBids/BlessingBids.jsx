import { useState, useEffect } from 'react'
import './BlessingBids.css'

import Bid from './Bid/Bid'

let nextId = 0

function BlessingBids({ auctionId }) {
    const [active, setActive] = useState(false)
    const [bidData, setBidData] = useState([
        {id: '6rdyfevik', amount: 500, paddles: []}
    ])

    const getKey = () => {
        return (Math.random() + 1).toString(36).substring(3)
    }

    const updateBidData = (id, amount, paddles) => {
        const updatedArray = bidData.map(tier => {
            if (tier.id === id) {
                return { id: id, amount: amount, paddles: paddles }
            }
            return tier
        })
        setBidData(updatedArray)
    }

    const removeTier = id => {
        setBidData(bidData => bidData.filter(tier => tier.id !== id))
    }

    const addTier = () => {
        setBidData([...bidData, {
            id: getKey(),
            amount: bidData.length > 0 ? bidData.slice(-1)[0].amount - 50 : 500,
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
                        key={tier.id}
                        id={tier.id}
                        amount={tier.amount} 
                        paddles={tier.paddles} 
                        updateBidData={updateBidData}
                        removeTier={removeTier}
                    />
                })}
                <button class="addTier" onClick={addTier}>Add tier</button>
            </div>

        : ""}
    </div>
}

export default BlessingBids