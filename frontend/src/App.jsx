import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Checkout } from './components/Checkout'
import './App.css'

function App() {
    return (
        <Router>
            <div className="app-container" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
                <nav style={{
                    background: '#fff',
                    padding: '1.5rem 2rem',
                    borderBottom: '1px solid #eaeaea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Yunique Store</div>
                    <div>
                        <Link to="/" style={{ marginRight: '2rem', color: '#666', textDecoration: 'none' }}>Home</Link>
                        <Link to="/checkout" style={{ color: '#000', fontWeight: '600', textDecoration: 'none' }}>Checkout</Link>
                    </div>
                </nav>

                <Routes>
                    <Route path="/" element={
                        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                            <h1 style={{ fontSize: '3rem', marginBottom: '20px', color: '#1a1a1a' }}>Welcome to Yunique Fashion</h1>
                            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '40px' }}>Experience the future of fashion payments.</p>
                            <Link to="/checkout">
                                <button style={{
                                    padding: '16px 32px',
                                    fontSize: '1.2rem',
                                    cursor: 'pointer',
                                    background: '#000',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '30px',
                                    fontWeight: '600',
                                    transition: 'transform 0.2s'
                                }}>
                                    Go to Checkout
                                </button>
                            </Link>
                        </div>
                    } />
                    <Route path="/checkout" element={<Checkout />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
