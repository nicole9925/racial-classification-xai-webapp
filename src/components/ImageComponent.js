import React, {useState} from 'react'
import Upload from './Upload'
import './ImageComponent.css'

const ImageComponent = (props) => {
    const [progress, setProgress] = useState('idle')

    const content = () => {
        switch(progress) {
            case 'idle':
                return (
                    <>
                    <div className="upload-container">
                        <Upload></Upload>
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
                        <Upload></Upload>
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