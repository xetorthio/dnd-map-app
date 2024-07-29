import { Dialog, DialogTitle, Button, ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const PhotoLibraryDialog = ({onClose, open, library, onImageChange, onImageShow}) => {
    const readFileContents = async (file) => {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = reject;
            fileReader.readAsDataURL(file);
        });
    }
    const readAllFiles = async (allFiles) => {
        const results = await Promise.all(allFiles.map(async (file) => {
            const fileContents = await readFileContents(file);
            return fileContents;
        }));
        return results;
    }
    const handleFileChange = (e) => {
        let allFiles = [];
        [...e.target.files].map(file => allFiles.push(file));
        readAllFiles(allFiles).then(result => {
            onImageChange([...library.images, ...result]);
        });
    };

    const handleDeleteImage = (deletedImage) => {
        let newimages = [...library.images];
        newimages = newimages.filter((image, i) => {
            return (i !== deletedImage);
        });
        onImageChange(newimages);
    };

    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>Photo Library</DialogTitle>
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                >
            Upload image
                <VisuallyHiddenInput type="file" multiple={true} onChange={handleFileChange} />
            </Button>
            {library && <ImageList variant="masonry" cols={3} gap={8}>
                {library.images.map((item, i) => (
                    <ImageListItem key={i}>
                        <img
                            src={item}
                        />
                        <Button variant="contained" color="secondary" onClick={() => {onImageShow(i);}}><VisibilityIcon /></Button>
                        <Button variant="contained" color="error" onClick={() => {handleDeleteImage(i);}}><DeleteIcon /></Button>
                    </ImageListItem>
                ))}
            </ImageList>
            }
        </Dialog>
    );
};

PhotoLibraryDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired
};

export default PhotoLibraryDialog;