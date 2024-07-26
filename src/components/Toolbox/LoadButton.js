import UploadIcon from '@mui/icons-material/Upload';
import { useRef } from 'react';
import { Button } from '@mui/material';

const LoadButton = ({ handleStateLoad }) => {
    const fileUploadRef = useRef();

    const handleClick = () => {
        fileUploadRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                handleStateLoad(JSON.parse(reader.result));
            }
            reader.readAsText(file);
        }
    };

    return (
        <Button variant="contained" color="error" onClick={handleClick}>
            <UploadIcon />
            <input ref={fileUploadRef} hidden={true} type="file" onChange={handleFileChange} />
        </Button>
    );
};

export default LoadButton;