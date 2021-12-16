import React, { useRef, useState ,useEffect} from "react"
import Button from "./Button"
import "./ImageUpload.css"
const ImageUpload = (props) => {
    const [file,setFile]=useState();
    const[isValid,setIsValid] = useState(false);
    const [imageUrl,setImageUrl] = useState();
    const imageRef = useRef();
useEffect(()=>{
    if(!file)
    {
        return;
    }
    const fileReader = new FileReader();
    fileReader.onload= ()=>{
        setImageUrl(fileReader.result);
    }
    fileReader.readAsDataURL(file);
},[file])

    const openImageUpload = () => {
        imageRef.current.click();
    }
    const imageChangeHandler = (event)=>{
        let pickedFile;
        let fileIsValid = isValid;
        if(event.target.files && event.target.files.length===1)
        {   pickedFile = event.target.files[0];
            fileIsValid = true;
            setFile(pickedFile);
            setIsValid(true);
        }
        else{
            fileIsValid = false;
            setIsValid(false);
        }
        props.onInput(props.id,pickedFile,fileIsValid);
    }
    return (
        <div className="form-control">
            <input
                type="file"
                id={props.id}
                style={{ display: "none" }}
                accept=".jpg,.png,.jpeg" ref={imageRef} 
                onChange={imageChangeHandler}/>

            <div className={`image-upload ${props.center && "center"}`}>
                <div className="image-upload__preview">
                   {imageUrl && <img src={imageUrl} alt="Preview" />} 
                   {
                       !imageUrl && <p>Please select a file</p>
                   }
                </div>
                <Button type="button" onClick={openImageUpload}>Pick Image</Button>
            </div>
            {!isValid && <p>Please Select an image </p>}
        </div>
    )
}

export default ImageUpload