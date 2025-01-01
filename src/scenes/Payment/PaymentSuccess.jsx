// PaymentSuccess.jsx
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const PaymentSuccess = () => {
    const location = useLocation()
    const navigate = useNavigate()
    const [orderDetails, setOrderDetails] = useState(null)

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search)
        const transactionId = queryParams.get('transactionId')

            setOrderDetails(transactionId)
        // if (transactionId) {
        // } else {
        //     navigate('/payment/invalid') // Redirect if parameters are missing
        // }
    }, [location, navigate])

    return (
        <div>
            <h1>Payment Successful!</h1>
            {orderDetails}
        </div>
    )
}

export default PaymentSuccess
