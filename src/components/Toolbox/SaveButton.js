import { Save } from "@mui/icons-material";
import { Button } from "@mui/material";

const SaveButton = ({getState, filename}) => {
    const downloadJSON = () => {
        const data = getState();
        const jsonData = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const jsonURL = URL.createObjectURL(jsonData);
        const link = document.createElement('a');
        link.href = jsonURL;
        link.download = `${filename}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    return (
        <Button variant="contained" color="primary" onClick={downloadJSON}><Save /></Button>
    );
};

export default SaveButton;