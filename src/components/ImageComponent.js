import React, {useState} from 'react'
import Upload from './Upload'
import { css } from "@emotion/core";
import './ImageComponent.css'
import CircleLoader from 'react-spinners/CircleLoader'

const ImageComponent = (props) => {
    const [progress, setProgress] = useState('idle')

    const override = css`
    display: block;
    margin-left: 0px;
    `;

    const loading = () => {
        setTimeout(() => {
            setProgress('display')
        }, 5000)
        
        return(
            <CircleLoader 
            color={'#8230E9'}
            loading={true}
            size={150}
            css={override}
            />
        )
    }

    const submit = async () => {       
        setProgress('loading')
    }

    const content = () => {
        switch(progress) {
            case 'idle':
                return (
                    <>
                    <div className="upload-container">
                        <Upload></Upload>
                        <button className="submit" onClick={submit}>Submit</button>
                    </div>
                    </>
                )
            case 'loading':
                return (
                    loading()
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
                        <button className="submit" onClick={submit}>Submit</button>
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