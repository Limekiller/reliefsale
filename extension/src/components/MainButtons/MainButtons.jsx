import { useState, useContext, useEffect } from 'react'
import './MainButtons.css'

import { FunctionContext } from '../../context'

function MainButtons({ auctionId }) {
    const functions = useContext(FunctionContext)
    const FIELDS = 'lot_identifier,name,buyer_name,buyer_email,sale_status,price,paddle_number,title_required,item_shipment_status'

    const [itemId, setItemId] = useState('null')

    const init = async () => {
        const response = await functions.callContentFunction('fetchItemsFromAuction', [auctionId])
        if (response.all_item_ids) {
            setItemId(response.all_item_ids[0])
        }
    }

    // Set the item ID for the URL as the first item from the auction
    // when the component is initiated and when the auctionId is updated
    useEffect(() => {
        setItemId('null')
        init()
    }, [auctionId])
    useEffect(() => {
        init()
    }, [])

    return <div className='MainButtons'>
        <a
            className={`
                button
                ${itemId === 'null' ? 'disabled' : ''}    
            `}
            href={`https://pareliefsale.bidwrangler.com/ui/clerk/${itemId}`}
        >
            <span className="material-symbols-outlined">gavel</span> Clerk (bids panel)
        </a>
        <a className='button' href={`https://pareliefsale.bidwrangler.com/ui/live_clerk/${auctionId}`}>
            <span className="material-symbols-outlined">box</span> Live clerk (items panel)
        </a>
        <a className='button' href={`https://pareliefsale.bidwrangler.com/ui/register/${auctionId}`}>
            <span className="material-symbols-outlined">person</span> Registrations
        </a>
        <a className='button' href={`https://pareliefsale.bidwrangler.com/api/auctions/${auctionId}/inventory_summary.csv?fields=${FIELDS}`}>
            <span className="material-symbols-outlined">assignment</span> Items report        
        </a>
    </div>
}

export default MainButtons