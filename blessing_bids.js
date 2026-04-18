/**
 * Add blessing bids to the auction via a data object. Should look like:
 * {
 *    $amount1: [$paddle1, $paddle2, $paddle3],
 *    $amount2: [$paddle4, $paddle5]
 * }
 * where amounts are the monetary donation amounts and the paddles are the paddle numbers of those who donated
 *
 * @param {obj} data The blessing bid data to add to the auction
 * @param {int} auctionId The auction ID that we want to add items to
 */
const main = async (data, auctionId) => {
    let lot = 5000
    for (const key in data) {
        for (const paddle of data[key]) {
            // Attempt to fetch the user ID for the paddle number in this auction
            let userId
            try {
                userId = await getUserIdFromPaddle(auctionId, paddle)
            } catch (error) {
                console.error("Blessing bid failed to add:", error)
                continue
            }

            const itemData = await addItem(auctionId, key, lot)
            if (!itemData.id) {
                console.error("Failed to add item for some reason")
                continue
            }

            await sellItem(itemData.id, key, userId)
            lot += 1
        }
    }

    window.location.reload()
}

/**
 * Add a blessing bid to an auction. Amount usually wouldn't be required for adding an item, but we want to include the blessing bid amount in the name.
 *
 * @param {int} auctionId The ID of the auction to add the item to
 * @param {int} amount The amount in dollars that the blessing bid was for
 * @param {int} lot The lot number to use for the created item
 * @returns {obj} The JSON response object
 */
const addItem = async (auctionId, amount, lot) => {
    let result = await fetch(`/api/auctions/${auctionId}/items`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "lot_identifier": String(lot),
            "name": `Blessing Bid – ${amount}`,
            "description": "",
            "start_amount": "",
            "reserve_amount": "",
            "quantity": "1",
            "seller_id": ""
        })
    })
    result = await result.json()
    return result
}

/**
 * Given a paddle number in a specific auction, return that user ID (needed for placing a final bid)
 *
 * @param {int} auctionId The ID of the relevant auction
 * @param {int} paddleNum The number of the paddle that is donating
 * @returns {int} The ID of the user in BidWrangler
 */
const getUserIdFromPaddle = async (auctionId, paddleNum) => {
    let result = await fetch(`/api/auctions/${auctionId}/bidders?query=${paddleNum}&clerk_quick_search=true`)
    result = await result.json()

    if (result.bidders_user_ids.length === 0) {
        throw new Error(`No user ID found for paddle ${paddleNum} in auction ${auctionId}`)
    }
    return result.bidders_user_ids[0]
}

/**
 * "Sell" an item by placing a final bid
 *
 * @param {int} itemId The ID of the item to sell
 * @param {int} amount The amount to sell the item for
 * @param {int} userId The user ID (not paddle num) of the user to sell the item to
 * @returns {obj} The JSON response object
 */
const sellItem = async (itemId, amount, userId) => {
    let result = await fetch(`/api/bids/place_final`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "item_id": itemId,
            "amount": amount,
            "user_id": userId,
            "finish_status": "sold"
        })
    })
    result = await result.json()
    return result
}

// Example. 149 is Bryce's non-admin user (bryoder@outlook.com); 179 is "Jason Sprunger Test 3"
// Manually assigned those users these paddle numbers in the auction mentioned below
const data = {
    50: [149],
    100: [149, 179]
}

// Execute script on data object -- example auction here is "Bryce Test Auction" in BW
//main(data, 160728)
