import React, {useState} from 'react'
import Upload from './Upload'
import './ImageComponent.css'

const ImageComponent = (props) => {
    
    var progress = props.progress

    const content = () => {
        switch(progress) {  
            case 'getUpload':
                return (
                    <>
                    <div className="upload-container">
                        <Upload setProgress={props.setProgress} setData={props.setData} progress={progress}></Upload>
                    </div>
                    </>
                )
            case 'loading':
                return ( <>
                </>
                )
            case 'display':
                return (
                    // showImage()
                    <div>Image</div>
                )
            default:
                return (
                    <>
                    <div className="upload-container">
                        <Upload setProgress={props.setProgress} setData={props.setData} progress={progress}></Upload>
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

export default ImageComponent;