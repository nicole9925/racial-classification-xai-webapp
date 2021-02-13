import React, {useState} from 'react'
import ImageUploader from 'react-images-upload'
import UploadService from './UploadService'

const UploadComponent = props => (
    <form>
        <ImageUploader
            key='image-uploader'
            withIcon={false}
            singleImage={true}
            label="Maximum size file: 5MB"
            buttonText="Choose file"
            onChange={props.onImage}
            imgExtension={['.jpg', '.png', '.jpeg']}
            maxFileSize={104856}
            withPreview={true}
            fileContainerStyle={{backgroundColor: '#2A323F', color: '#ffffff'}}
            buttonStyles = {{backgroundColor: '#4C6074'}}
        />
    </form>
);
const Upload = () => {
    
    const [progress, setProgress] = useState('getUpload');
    const [url, setImageUrl] = useState(undefined)
    const [errorMessage, setErrorMessage] = useState('')

    const onImage = async (failedImages, successImages) => {
        setProgress('Uploading')
        try {
            const parts = successImages[0].split(';');
            const name = parts[1].split('=')[1];
            const type = parts[0].split(':')[1]

            UploadService.upload(successImages, type)
            .then(async () => {
                setImageUrl(`http://localhost:3000/${name}`);
                setProgress('Uploaded')
            })
            .catch((err) => {
                console.log(err)
            })
        } catch(error) {
            setErrorMessage(error.message);
            console.log(failedImages)

        } setProgress('getUpload')
    }

    const content = () => {
        switch(progress) {
            case 'getUpload':
                return <UploadComponent onImage={onImage} url={url} />
            case 'Uploading':
                return <div>Uploading...</div>
            case 'Uploaded':
                return (
                <>
                    <UploadComponent onImage={onImage} url={url}/>
                </>
                )
            case 'uploadError':
                return (
                    <>
                        <div>Error message = {errorMessage}</div>
                        <UploadComponent onImage={onImage} url={url} />
                    </>
                )
            default:
                return <UploadComponent onImage={onImage} url={url} />
        }
        
    }

    return (
        <div>
            {content()}
        </div>
    )
}

export default Upload;