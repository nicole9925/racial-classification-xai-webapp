import React from 'react'
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
                return ( <>
                <div className="results-container">
                    <h3><strong>OUR GUESSES:</strong></h3>
                    <div className="results">
                        <h5><b>Race:</b></h5>
                        <h5>{background["race"]}</h5>
                    </div>
                    <div className="results">
                        <h5><b>Gender:</b></h5>
                        <h5>{background["gender"]}</h5>
                    </div>
                    <div className="results">
                        <h5><b>Age:</b></h5>
                        <h5>{background["age"]}</h5>
                    </div>
                </div>
                </>
                )
            case 'Input':
                return ( <>
                <div className="correction-container">
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