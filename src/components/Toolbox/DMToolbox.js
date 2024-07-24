import React, { useEffect, useState } from "react";

import MapSelector from './MapSelector';
import { AppBar, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import StreetviewIcon from '@mui/icons-material/Streetview';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FlareIcon from '@mui/icons-material/Flare';
import SyncIcon from '@mui/icons-material/Sync';
import EffectColorPicker from "./EffectColorPicker";
import ConnectionStatus from "./ConnectionStatus";

const DMToolbox = ({
    handleMapChange,
    handleFogOfWarReveal,
    handlePlayerView,
    handleMapMove,
    handleDMViewRescale,
    handlePlayerViewRescale,
    handleEffects,
    handleEffectColorChange,

    mapMoveSelected,
    fogOfWarRevealSelected,
    playerViewSelected,
    dmViewScale,
    playerViewScale,
    effectsSelected,
    selectedEffectColor,
    connectionStatus
}) => {
    const [selectedTool, setSelectedTool] = useState();
    useEffect(() => {
        if (mapMoveSelected) {
            setSelectedTool('mapMove');
        } else if (fogOfWarRevealSelected) {
            setSelectedTool('fogReveal');
        } else if (playerViewSelected) {
            setSelectedTool('playerView');
        } else if (effectsSelected) {
            setSelectedTool('areaEffect');
        }
    }, [mapMoveSelected, fogOfWarRevealSelected, playerViewSelected])

    const dmViewScaleChangeHandler = (e) => {
        handleDMViewRescale(parseFloat(e.target.value));
    };

    const playerViewScaleChangeHandler = (e) => {
        handlePlayerViewRescale(parseFloat(e.target.value));
    };

    return (
        <AppBar position="static" color="primary" sx={{ display: 'flex', gap: 2 }}>
            <Box position="static" sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <ConnectionStatus connectionStatus={connectionStatus} />
                <ToggleButtonGroup orientation="horizontal" size="large" aria-label="Small sizes" sx={{ flexWrap: "wrap" }}>
                    <MapSelector onMapChange={handleMapChange} />
                </ToggleButtonGroup>
                <ToggleButtonGroup value={selectedTool} orientation="horizontal" size="large" aria-label="Small sizes" sx={{ flexWrap: "wrap" }}>
                    <ToggleButton value="mapMove" key="mapMove" onClick={handleMapMove}>
                        <ControlCameraIcon />
                    </ToggleButton>
                    <ToggleButton value="playerView" key="playerView" onClick={handlePlayerView}>
                        <StreetviewIcon />
                    </ToggleButton>
                    <ToggleButton value="fogReveal" key="fogReveal" onClick={handleFogOfWarReveal}>
                        <VisibilityIcon />
                    </ToggleButton>
                    <ToggleButton value="areaEffect" key="areaEffect" onClick={handleEffects}>
                        <FlareIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
                <EffectColorPicker color={selectedEffectColor} onColorChange={handleEffectColorChange} />
                <input id={'DMViewScale'} type="number" value={dmViewScale} min={0.1} max={5} step={0.1} onChange={dmViewScaleChangeHandler} />
                <input id={'PlayerViewScale'} type="number" value={playerViewScale} min={0.1} max={5} step={0.1} onChange={playerViewScaleChangeHandler} />
            </Box>
        </AppBar>
    );
};

export default DMToolbox;