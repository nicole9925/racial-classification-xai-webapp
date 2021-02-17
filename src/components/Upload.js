import React, {useState} from 'react'
import ImageUploader from 'react-images-upload'
import UploadService from './UploadService'
import CircleLoader from 'react-spinners/CircleLoader'
import { css } from "@emotion/core";
import './Upload.css';
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
const Upload = (props) => {

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
        props.setProgress("Uploading");
        const parts = img[0].split(';');
        const name = parts[1].split('=')[1];

        const resp = await UploadService.UploadToServer(img, name)

        setImageUrl('data:image/jpeg;base64,' + resp.pp_img)
        props.setProgress('Uploaded')
        // props.setData(`Race: ${resp.race}\nGender: ${resp.gender}\nAge: ${resp.age}`)
        props.setData({"race": resp.race, "gender": resp.gender, "age": resp.age})
    }
 
    const content = (props) => {
        const progress = props.progress
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
                    <div className="image-container">
                        <img className = "pp-img" src={url} alt="Your Image"></img>
                    </div>
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
            {content(props)}
        </div>
    )
}

export default Upload;