import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { FaSearch } from "react-icons/fa";
import { useState } from 'react';
import API_URL from "../constants";

function Header(props) {
    const [loc, setLoc] = useState(localStorage.getItem("userLoc") || "28.6139,77.2090"); // Default: Delhi
    const [showOver, setShowOver] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    let locations = [
        { "latitude": 28.6139, "longitude": 77.2090, "placeName": "New Delhi, Delhi" },
        { "latitude": 19.0760, "longitude": 72.8777, "placeName": "Mumbai, Maharashtra" }
    ];

    const handleSearchClick = () => {
        const location = localStorage.getItem("userLoc") || "28.6139,77.2090"; // Default: Delhi
        const url = `${API_URL}/search?search=${encodeURIComponent(props.search)}&loc=${location}`;
        props.handleClick && props.handleClick(url);
    };

    return (
        <div className='header-container d-flex justify-content-between'>
            <div className="header">
                <Link className='links' to="/"> <img src={`${process.env.PUBLIC_URL}/logo/logo.jpg`} alt="DiyuMart Logo" className="logo-img" />  </Link>
                <select 
                className="select-location"
                    value={loc} 
                    onChange={(e) => {
                        localStorage.setItem('userLoc', e.target.value);
                        setLoc(e.target.value);
                    }}
                >
                    {locations.map((item, index) => (
                        <option key={index} value={`${item.latitude},${item.longitude}`}>
                            {item.placeName}
                        </option>
                    ))}
                </select>
                <input 
                    className='search'
                    type='text'
                    value={props.search}
                    onChange={(e) => props.handlesearch && props.handlesearch(e.target.value)}
                />
                <button className='search-btn' onClick={handleSearchClick}>
                    <FaSearch />
                </button>
            </div>

            <div>
                <div
                    onClick={() => setShowOver(!showOver)}
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: '#2682f1',
                        width: '40px',
                        height: '40px',
                        color: '#fff',
                        fontSize: '14px',
                        borderRadius: '50%',
                        cursor: 'pointer'
                    }}>
                    D
                </div>

                {showOver && (
                    <div style={{
                        minHeight: '100px',
                        width: '200px',
                        background: '#2682f1',
                        position: 'absolute',
                        top: '0',
                        right: '0',
                        zIndex: 1,
                        marginTop: '50px',
                        marginRight: '50px',
                        color: 'red',
                        fontSize: '14px',
                        borderRadius: '7px',
                        cursor: 'pointer'
                    }}>
                        {localStorage.getItem('token') && (
                            <>
                                <div><Link to="/add-product"><button className="logout-btn">ADD PRODUCT</button></Link></div>
                                <div><Link to="/liked-products"><button className="logout-btn">FAVOURITES</button></Link></div>
                                <div><Link to="/my-products"><button className="logout-btn">MY ADS</button></Link></div>
                            </>
                        )}
                        <div>
                            {!localStorage.getItem('token') ? (
                                <Link to="/login">LOGIN</Link>
                            ) : (
                                <button className='logout-btn' onClick={handleLogout}>LOGOUT</button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;
