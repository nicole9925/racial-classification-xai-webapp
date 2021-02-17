import React, {useState} from 'react'
// import background from '../text_data/background'
import './Info.css'

const Info = (props) => {
    var progress = props.progress;
    var background = props.data;
    // console.log(background)
    const content = () => {
        switch(progress) {
            case 'getUpload':
                return (
                    <>
                    <div className="background-container">
                        <h3>{background.background[1]["header"]}</h3>
                        <p>{background.background[1]["body"]}</p>

                        <h3>{background.background[2]["header"]}</h3>
                        <p>{background.background[2]["body"]}</p>
                    </div>
                    </>
                )
            case 'Uploading':
                return (
                    <>
                    <div className="background-container">
                        <h3>{background.background[1]["header"]}</h3>
                        <p>{background.background[1]["body"]}</p>

                        <h3>{background.background[2]["header"]}</h3>
                        <p>{background.background[2]["body"]}</p>
                    </div>
                    </>
                )
            case 'Uploaded':
                props.setTitle('Results');
                return ( <>
                <div className="results-container">
                    <h3>Race: {background["race"]}</h3>
                    <br />
                    <h3>Gender: {background["gender"]}</h3>
                    <br />
                    <h3>Age: {background["age"]}</h3>
                </div>
                </>
                )
            default:
                return (
                    <>
                    <div className="background-container">
                    </div>
                    </>
                )
        }
    }
    return (
        <>
            <div>
                {content()}
            </div>
        </>
    )
}

export default Info;