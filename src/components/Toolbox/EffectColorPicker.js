import React, { useState } from "react";
import { SketchPicker } from 'react-color';
import styled from 'styled-components'

const SwatchDIV = styled.div`
    padding: 5px;
    background: #fff;
    border-radius: 1px;
    box-shadow: 0 0 0 1px rgba(0,0,0,.1);
    display: inline-block;
    cursor: pointer;
`;

const ColorDIV = styled.div`
    width: 36px;
    height: 14px;
    border-radius: 2px;
    background: rgba(${props => props.$color.r}, ${props => props.$color.g}, ${props => props.$color.b}, ${props => props.$color.a});
`;

const PopoverDIV = styled.div`
    position: absolute;
    z-index: 2;
`;

const CoverDIV = styled.div`
    position: fixed;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
`;

const EffectColorPicker = ({color, onColorChange}) => {
    const [displayPicker, setDisplayPicker] = useState(false);

    const handleClick = () => {
        setDisplayPicker(!displayPicker);
    };

    const handleClose = () => {
        setDisplayPicker(false);
    };
    
    const handleChange = (newcolor) => {
        onColorChange(newcolor.rgb);
    };
    
    return (
        <div>
            <SwatchDIV onClick={handleClick}>
                <ColorDIV $color={color} />
            </SwatchDIV>
            { displayPicker ? 
                <PopoverDIV>
                    <CoverDIV onClick={handleClose} />
                    <SketchPicker color={color} onChange={handleChange} />
                </PopoverDIV> 
            : null }
        </div>
    );
};

export default EffectColorPicker;