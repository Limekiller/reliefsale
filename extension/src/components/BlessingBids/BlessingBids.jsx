import { useState, useContext } from 'react'
import './BlessingBids.css'

import { FunctionContext } from '../../context'
import Bid from './Bid/Bid'

function BlessingBids({ auctionId }) {
    const functions = useContext(FunctionContext)

    const [processing, setProcessing] = useState(false)
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

    const submit = async () => {
        let alertString = "You are about to add the following blessing bid donations to the selected auction:\n\n"
        for (const tier of bidData) {
            alertString += `Tier for $${tier.amount} with the following purchasers:\n`
            for (const paddle of tier.paddles) {
                alertString += `${paddle}, `
            }
            alertString = alertString.substring(0, alertString.length - 2)
            alertString += "\n\n"
        }
        alertString += "Does this look correct?"
        if (confirm(alertString)) {
            setProcessing(true)
            const response = await functions.callContentFunction('addBlessingBids', [bidData, auctionId])
            setProcessing(false)
        }
    }

    return <div className='BlessingBids'>
        {processing ?
            <div class="processingMask">
                <span>Processing...</span>
            </div>
            : ""
        }
        
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
                <div className='bottomButtons'>
                    <button class="addTier" onClick={addTier}>
                        Add tier
                        <span className="material-symbols-outlined">add</span>
                    </button>
                    <button 
                        class={`
                            submit
                            ${bidData.flatMap(obj => obj.paddles).length === 0 ? 'disabled' : ''}
                        `} 
                        onClick={submit}
                    >
                        Submit
                        <span className="material-symbols-outlined">arrow_right</span>
                    </button>
                </div>
            </div>
            : ""
        }
    </div>
}

export default BlessingBids