import React, {useState} from 'react'
import Guide from './Guide'
import './GuideBox.css'

const GuideBox = (props) => {

    const [expected, setExpected] = useState(undefined)
    const [submitDisabled, setSubmitDisabled] = useState(true);

    const submitForm  = async (e) => {
        console.log("here")
        e.preventDefault()
        if (expected === 'Yes') {
            props.setProgress('Analysis')
        } else if (expected === 'No') {
            props.setProgress('Input')
            console.log("here")
        }
    }
    
    const onValueChange = (event) => {
        setExpected(event.target.defaultValue)
        setSubmitDisabled(false)
        // setExpected
    }

    const content = () => {
        switch(props.progress) {  
            case 'getUpload':
                return (
                    <>
                    <div className="guide-bounding">
                        <Guide key = {props.progress} className="guide" progress={props.progress}></Guide>
                    </div>
                    </>
                )
            case 'Uploading':
                return ( <>
                    <div className="guide-bounding">
                        <Guide key = {props.progress} className="guide" progress={props.progress}></Guide>
                    </div>
                </>
                )
            case 'Uploaded':
                return ( <>
                    <div className="guide-bounding">
                        <div className = "guide-split">
                            <Guide key = {props.progress} className="guide" progress={props.progress}></Guide>
                            <div className = "guide-input">
                                <p className = "guide-selections">
                                    <input className= "options yes" type="radio" name="q2" value="Yes" onChange={onValueChange}/>Yes
                                    <input className= "options no" type="radio" name="q2" value="No" onChange={onValueChange}/>No
                                    <button className = "guide-submit submit" onClick={submitForm} disabled={submitDisabled}>submit</button>
                                </p>
                            </div>
                        </div>
                    </div>
                </>
                )
            case 'Input':
                return ( <>
                    <div className="guide-bounding">
                        <Guide key = {props.progress} className="guide" progress={props.progress}></Guide>
                    </div>
                </>
                )
            default:
                return (
                    <>

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

export default GuideBox;