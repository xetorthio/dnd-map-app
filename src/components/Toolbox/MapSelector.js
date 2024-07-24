import React, { Fragment, useRef } from "react";
import { useState } from "react";
import MapIcon from '@mui/icons-material/Map';

import { Input, ToggleButton } from '@mui/material';

const MapSelector = ({onMapChange}) => {
    const fileUploadRef = useRef();

    const handleClick = () => {
        fileUploadRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new window.Image();
                img.src = reader.result;
                img.onload = () => {
                    onMapChange(img);
                };
            }
            reader.readAsDataURL(file);
        }
    };

    return (
        <ToggleButton value="changeMap" key="changeMap" onClick={handleClick}>
            <MapIcon />
            <input ref={fileUploadRef} hidden={true} type="file" onChange={handleFileChange} />
        </ToggleButton>
    );
};

export default MapSelector;