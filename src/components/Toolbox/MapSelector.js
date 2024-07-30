import React, { Fragment, useRef } from "react";
import { useState } from "react";

import { Input, ToggleButton } from '@mui/material';

const MapSelector = ({icon, onMapChange}) => {
    const fileUploadRef = useRef();

    const handleClick = () => {
        fileUploadRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onMapChange(reader.result);
            }
            reader.readAsDataURL(file);
        }
    };

    return (
        <ToggleButton value="changeMap" key="changeMap" onClick={handleClick}>
            {icon}
            <input ref={fileUploadRef} hidden={true} type="file" onChange={handleFileChange} />
        </ToggleButton>
    );
};

export default MapSelector;