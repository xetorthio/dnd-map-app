import React, { useEffect, useState } from "react";

import MapSelector from './MapSelector';
import { AppBar, Box, ToggleButtonGroup, ToggleButton, Button } from '@mui/material';
import ControlCameraIcon from '@mui/icons-material/ControlCamera';
import StreetviewIcon from '@mui/icons-material/Streetview';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FlareIcon from '@mui/icons-material/Flare';
import EffectColorPicker from "./EffectColorPicker";
import ConnectionStatus from "./ConnectionStatus";
import SaveButton from "./SaveButton";
import LoadButton from "./LoadButton";
import { PhotoLibrary } from "@mui/icons-material";
import MapIcon from '@mui/icons-material/Map';
import PanoramaPhotosphereIcon from '@mui/icons-material/PanoramaPhotosphere';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';

const DMToolbox = ({
    handleDMMapChange,
    handlePlayerMapChange,
    handleFogOfWarReveal,
    handlePlayerView,
    handleMapMove,
    handleDMViewRescale,
    handlePlayerViewRescale,
    handleEffects,
    handleEffectColorChange,
    handlePhotoLibraries,
    getState,
    handleLoad,
    handleBattleTracker,

    mapMoveSelected,
    fogOfWarRevealSelected,
    playerViewSelected,
    dmViewScale,
    playerViewScale,
    effectsSelected,
    photoLibrariesSelected,
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
        } else if (photoLibrariesSelected) {
            setSelectedTool('photoLibraries');
        }
    }, [mapMoveSelected, fogOfWarRevealSelected, playerViewSelected, effectsSelected, photoLibrariesSelected])

    const dmViewScaleChangeHandler = (e) => {
        handleDMViewRescale(parseFloat(e.target.value));
    };

    const playerViewScaleChangeHandler = (e) => {
        handlePlayerViewRescale(parseFloat(e.target.value));
    };

    return (
        <AppBar position="fixed" color="primary" sx={{ display: 'flex', gap: 2 }}>
            <Box position="fixed" sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <ConnectionStatus connectionStatus={connectionStatus} />
                <ToggleButtonGroup orientation="horizontal" size="large" aria-label="Small sizes" sx={{ flexWrap: "wrap" }}>
                    <MapSelector icon={<MapIcon />}onMapChange={handleDMMapChange} />
                    <MapSelector icon={<PanoramaPhotosphereIcon />} onMapChange={handlePlayerMapChange} />
                </ToggleButtonGroup>
                <Button variant="outlined" onClick={handleBattleTracker} aria-label="Show battle tracker" sx={{ flexWrap: "wrap" }}>
                    <SportsKabaddiIcon />
                </Button>
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
                    <ToggleButton value="photoLibraries" key="photoLibraries" onClick={handlePhotoLibraries}>
                        <PhotoLibrary />
                    </ToggleButton>
                </ToggleButtonGroup>
                <EffectColorPicker color={selectedEffectColor} onColorChange={handleEffectColorChange} />
                <input id={'DMViewScale'} type="number" value={dmViewScale} min={0.1} max={5} step={0.1} onChange={dmViewScaleChangeHandler} />
                <input id={'PlayerViewScale'} type="number" value={playerViewScale} min={0.1} max={5} step={0.1} onChange={playerViewScaleChangeHandler} />
                <SaveButton getState={getState} filename="session" />
                <LoadButton handleStateLoad={handleLoad} />
            </Box>
        </AppBar>
    );
};

export default DMToolbox;