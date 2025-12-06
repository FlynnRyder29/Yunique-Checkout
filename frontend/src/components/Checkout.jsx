import { useEffect, useState, useRef } from 'react'
import { loadScript } from '@yuno-payments/sdk-web'
import { useNavigate } from 'react-router-dom'

export const Checkout = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const yunoRef = useRef(null)
    const initializedRef = useRef(false)
    const navigate = useNavigate()

    useEffect(() => {
        // Prevent double initialization in StrictMode
        if (initializedRef.current) return;
        initializedRef.current = true;

        const initializeCheckout = async () => {
            try {
                // 1. Get Public API Key
                const apiKeyRes = await fetch('http://localhost:8080/public-api-key')
                const { publicApiKey } = await apiKeyRes.json()

                // 2. Create Checkout Session
                const sessionRes = await fetch('http://localhost:8080/checkout/sessions?country=CO', {
                    method: 'POST'
                })
                if (!sessionRes.ok) throw new Error('Failed to create session')
                const sessionData = await sessionRes.json()

                // 3. Initialize Yuno SDK
                const yunoSdk = await loadScript({
                    version: 'latest',
                    // optional: min: true 
                })
                const yuno = await yunoSdk.initialize(publicApiKey)
                yunoRef.current = yuno

                // 4. Start Checkout
                yuno.startCheckout({
                    checkoutSession: sessionData.checkout_session,
                    elementSelector: '#yuno-checkout',
                    countryCode: 'CO',
                    language: 'es',
                    onLoading: (args) => {
                        console.log('Loading:', args)
                    },
                    yunoError: (error) => {
                        console.error('Yuno Error:', error)
                        setError(error.message)
                    },
                    async yunoCreatePayment(oneTimeToken) {
                        try {
                            const paymentRes = await fetch('http://localhost:8080/payments?country=CO', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    checkoutSession: sessionData.checkout_session,
                                    oneTimeToken: oneTimeToken
                                })
                            })
                            const paymentResult = await paymentRes.json()
                            console.log('Payment Result:', paymentResult)

                            // Continue flow - let SDK handle visual state based on payment result
                            yuno.continuePayment()

                        } catch (e) {
                            console.error(e)
                        }
                    },
                    renderMode: {
                        type: 'element',
                        elementSelector: {
                            apmForm: "#yuno-checkout",
                            actionForm: "#action-form-element"
                        }
                    },
                    yunoPaymentResult(data) {
                        console.log('Payment Result Callback:', data)
                        if (data === 'SUCCEEDED') {
                            // alert('Payment Successful!')
                        } else if (data === 'REJECTED' || data === 'DECLINED' || data === 'ERROR') {
                            // alert('Payment Failed/Rejected')
                        }
                    },
                })

                yuno.mountCheckout()
                setLoading(false)

            } catch (err) {
                console.error(err)
                setError(err.message)
                setLoading(false)
            }
        }

        initializeCheckout()

        // Optional cleanup if supported by SDK, otherwise ref prevents re-init
        return () => {
            // yunoRef.current?.unmount() 
        }
    }, [])

    const handlePay = () => {
        if (yunoRef.current) {
            yunoRef.current.startPayment()
        }
    }

    return (
        <div style={{
            maxWidth: '1000px',
            margin: '40px auto',
            padding: '0 20px',
            fontFamily: "'Inter', sans-serif"
        }}>
            <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                marginBottom: '10px',
                color: '#1a1a1a',
                textAlign: 'center'
            }}>
                Checkout
            </h1>
            <p style={{
                textAlign: 'center',
                color: '#666',
                marginBottom: '40px'
            }}>
                Complete your purchase securely below.
            </p>

            <div style={{
                background: '#fff',
                borderRadius: '16px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                padding: '40px',
                border: '1px solid #f0f0f0'
            }}>
                {loading && (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div className="spinner"></div>
                        <p style={{ marginTop: '10px', color: '#666' }}>Loading payment secure environment...</p>
                    </div>
                )}

                {error && (
                    <div style={{
                        padding: '16px',
                        background: '#fff2f0',
                        border: '1px solid #ffccc7',
                        borderRadius: '8px',
                        color: '#cf1322',
                        marginBottom: '20px'
                    }}>
                        Error: {error}
                    </div>
                )}

                <div id="yuno-checkout" style={{ minHeight: '200px' }}></div>
                <div id="action-form-element"></div>

                {!loading && !error && (
                    <button
                        onClick={handlePay}
                        style={{
                            display: 'block',
                            width: '100%',
                            marginTop: '32px',
                            padding: '16px 24px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            color: '#fff',
                            backgroundColor: '#000',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#333'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#000'}
                    >
                        Pay Now
                    </button>
                )}
            </div>

            <div style={{ marginTop: '40px', textAlign: 'center', color: '#999', fontSize: '0.9rem' }}>
                <p>Secured by Yuno</p>
            </div>
        </div>
    )
}
