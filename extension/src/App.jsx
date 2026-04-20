import { useState } from 'react'

function App() {
    const [auctions, setAuctions] = useState([])

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
        console.log(response)
        setAuctions(response.auctions)
    }

    if (auctions.length === 0) {
        init()
    }

    return <>
        {auctions.length > 0 ?
            <span>Have auctions</span>
            : <span>Failed to fetch auctions. Make sure you're logged in and currently on the BidWrangler website.</span>
        }
    </>
}

export default App
