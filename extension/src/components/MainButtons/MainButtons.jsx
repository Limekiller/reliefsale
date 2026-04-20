import { useState, useContext } from 'react'
import './MainButtons.css'

import { FunctionContext } from '../../context'

function MainButtons({ auctionId }) {
    const functions = useContext(FunctionContext)
    console.log(functions)
    const FIELDS = 'lot_identifier,name,buyer_name,buyer_email,sale_status,price,paddle_number,title_required,item_shipment_status'

    const [itemId, setItemId] = useState('null')

    const init = async () => {
        console.log(functions)
        const response = await functions.callContentFunction('fetchItemsFromAuction', [auctionId])
        if (response.all_item_ids) {
            setItemId(response.all_item_ids[0])
        }
    }

    init()

    return <div className='MainButtons'>
        <a className='button' href={`https://pareliefsale.bidwrangler.com/ui/clerk/${itemId}`}>
            Clerk panel
        </a>
        <a className='button' href={`https://pareliefsale.bidwrangler.com/ui/live_clerk/${auctionId}`}>
            Live clerk panel
        </a>
        <a className='button' href={`https://pareliefsale.bidwrangler.com/ui/register/${auctionId}`}>
            Registrations
        </a>
        <a className='button' href={`https://pareliefsale.bidwrangler.com/api/auctions/${auctionId}/inventory_summary.csv?fields=${FIELDS}`}>
            Items
        </a>
    </div>
}

export default MainButtons