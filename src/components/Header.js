import React from 'react'
import './Header.css'

const Header = (props) => {
    return (
        <div className="header-container">
            <div className="title-container">
                <h3 className="title-text">{props.title}</h3>
            </div>
        </div>
    )
}

export default Header;