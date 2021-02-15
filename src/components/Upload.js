import React, {useState} from 'react'
import ImageUploader from 'react-images-upload'
import UploadService from './UploadService'
import CircleLoader from 'react-spinners/CircleLoader'
import { css } from "@emotion/core";
const UploadComponent = props => (
    <form>
        <ImageUploader
            key='image-uploader'
            withIcon={false}
            singleImage={true}
            label="Please upload an image with a single face."
            buttonText="Choose file"
            onChange={props.onImage}
            imgExtension={['.jpg', '.png', '.jpeg']}
            withPreview={true}
            fileContainerStyle={{backgroundColor: '#2A323F', color: '#ffffff'}}
            buttonStyles = {{backgroundColor: '#4C6074'}}
        />
    </form>
);
const Upload = () => {
    
    const [progress, setProgress] = useState('getUpload');
    const [url, setImageUrl] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState('');
    const [img, setImage] = useState(null);
    const [disableButton, setDisabled] = useState(true);

    const onImage = async (failedImages, successImages) => {
        try {
            setDisabled(false)
            setImage(successImages)

        } catch(error) {
            setErrorMessage(error.message);

        } 
    }

    const loading = () => {
        const override = css`
        display: block;
        margin-left: 0px;
        `;
        
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
        setProgress("Uploading");
        const parts = img[0].split(';');
        const name = parts[1].split('=')[1];

        const resp = await UploadService.UploadToServer(img, name)

        // setImageUrl(resp["gen_path"])
        // setImageUrl(process.env.PUBLIC_URL + `/${resp.gen_path}`)
        let img_url = await fetch(`/api/display/${resp.name}`, {
            mode: 'no-cors',
            method: "get",
            headers: {
                 "Content-Type": "application/json"
            }
        })
        // setImageUrl(img_url.url)
        // console.log(img_url)
        // setProgress("Uploaded")

        // .then(async () => {
        //     setImageUrl("done");
        // })
        // .catch((err) => {
        //     console.log(err)
        // }) 
    }
 
    const content = () => {
        switch(progress) {
            case 'getUpload':
                fetch('/api/clear/')
                return <>
                <div className="upload-container">
                    <UploadComponent onImage={onImage} url={url} />
                    <button className="submit" onClick={submit} disabled={disableButton}>Submit</button>
                </div>
                </>
                
            case 'Uploading':
                return loading()
            case 'Uploaded':
                return (
                <>
                    {/* <img src={url} alt="Your Image"></img> */}
                </>
                )
            case 'uploadError':
                return (
                    <>
                        <div className="error-message">{errorMessage}</div>
                        <div className="upload-container">
                            <UploadComponent onImage={onImage} url={url} />
                            <button className="submit" onClick={submit}>Submit</button>
                        </div>
                    </>
                )
            default:
                return <>
                </>
        }
        
    }

    return (
        <div>
            {content()}
        </div>
    )
}

export default Upload;