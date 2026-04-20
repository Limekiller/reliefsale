import { useState } from 'react'
import './App.css'

import { FunctionContext } from './context'
import MainButtons from './components/MainButtons/MainButtons'
import BlessingBids from './components/BlessingBids/BlessingBids'

function App() {
    const [loading, setLoading] = useState(true)
    const [auctions, setAuctions] = useState([])
    const [activeAuctionId, setActiveAuctionId] = useState(0)

    const callContentFunction = (name, args, callback) => {
        return new Promise((resolve, reject) => {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { action: name, args: args }, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError)
                        return
                    }
                    resolve(response)
                })
            })
        })
    }

    const init = async () => {
        const response = await callContentFunction('fetchAuctions', [])
        if (response.auctions) {
            setAuctions(response.auctions)
        }
    }

    if (auctions.length === 0) {
        init()
    }

    return <FunctionContext.Provider functions={{callContentFunction: callContentFunction}}>
        {auctions.length > 0 ?
            <select
                value={activeAuctionId}
                onChange={e => setActiveAuctionId(e.target.value)}
                name='active_auction'
            >
                <option value="0" disabled>Select an auction</option>
                {auctions.map(auction => {
                    return <option value={auction.id}>{auction.name}</option>
                })}
            </select>
            : loading ? 
                <span>Loading...</span>
                : <span>Failed to fetch auctions. Make sure you're logged in and currently on the BidWrangler website.</span>
        }

        {activeAuctionId ? <>
                <MainButtons auctionId={activeAuctionId} />
                <BlessingBids />
            </>
        : ""}
    </FunctionContext.Provider>
}

export default App
