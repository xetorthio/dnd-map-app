import { Stage } from 'react-konva';
import { Fragment, useState, useEffect, useRef, useCallback } from 'react';
import Map from '../Layers/Map';
import FogOfWar from '../Layers/FogOfWar';
import DMToolbox from '../Toolbox/DMToolbox';
import PlayersView from '../Layers/PlayersView';
import Effects from '../Layers/Effects';
import useWebSocket from 'react-use-websocket';
import PhotoLibraries from '../Layers/PhotoLibraries';
import PhotoLibraryDialog from '../Toolbox/PhotoLibraryDialog';
import { Stack } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

const DM = () => {
  const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:3001', {
    shouldReconnect: (closeEvent) => true
  });

  const [selectedMap, setSelectedMap] = useState(null);
  const [selectedMapDimensions, setSelectedMapDimensions] = useState({ width: 0, height: 0 });
  const stageRef = useRef();
  const playersViewRef = useRef();
  const [mapMoveSelected, setMapMoveSelected] = useState(false);
  const [fogOfWarRevealSelected, setFogOfWarRevealSelected] = useState(true);
  const [fogOfWarReveals, setFogOfWarReveals] = useState([]);
  const [effects, setEffects] = useState([]);
  const [playerViewSelected, setPlayerViewSelected] = useState(false);
  const [dmViewScale, setDMViewScale] = useState(1);
  const [playerViewScale, setPlayerViewScale] = useState(1);
  const [effectsSelected, setEffectsSelected] = useState(false);
  const [photoLibrariesSelected, setPhotoLibrariesSelected] = useState(false);
  const [selectedEffectColor, setSelectedEffectColor] = useState({
    r: '241',
    g: '112',
    b: '19',
    a: '1',
  });
  const [playerViewDimensions, setPlayerViewDimensions] = useState({x: 0, y: 0});
  const [photoLibraries, setPhotoLibraries] = useState([]);
  const [photoLibraryDialogOpen, setPhotoLibraryDialogOpen] = useState(false);
  const [selectedPhotoLibrary, setSelectedPhotoLibrary] = useState(null);
  const playerViewDimensionsRef = useRef();

  playerViewDimensionsRef.current = playerViewDimensions;

  const sendStateMessage = (type, msg) => {
    sendMessage(JSON.stringify({type: type, msg: msg}));
  };

  const toolChangeReset = () => {
    setMapMoveSelected(false);
    setFogOfWarRevealSelected(false);
    setPlayerViewSelected(false);
    setEffectsSelected(false);
    setPhotoLibrariesSelected(false);
  };

  const handlePlayerView = () => {
    toolChangeReset();
    setPlayerViewSelected(true);
  }

  const handleMapMove = () => {
    toolChangeReset();
    setMapMoveSelected(true);
  };

  const handleFogOfWarReveal = () => {
    toolChangeReset();
    setFogOfWarRevealSelected(true);
  };

  const handleEffects = () => {
    toolChangeReset();
    setEffectsSelected(true);
  };

  const handlePhotoLibraries = () => {
    toolChangeReset();
    setPhotoLibrariesSelected(true);
  };

  const handleMapChange = (map) => {
    const img = new window.Image();
    img.src = map;
    img.onload = () => {
        setSelectedMap(img);
    };
  };

  const handleDMViewRescale = (scale) => {
    setDMViewScale(scale);
  };

  const handlePlayerViewRescale = (scale) => {
    setPlayerViewScale(scale);
  };

  const handleEffectColorChange = (color) => {
    setSelectedEffectColor(color);
  }

  useEffect(() => {
    playerSendMap();
  }, [selectedMap]);

  useEffect(() => {
    playerSendReveals();
  }, [fogOfWarReveals]);

  useEffect(() => {
    playerSendScale();
  }, [playerViewScale]);

  useEffect(() => {
    playerSendEffects();
  }, [effects]);

  useEffect(() => {
    playerSendMapPosition();
  }, [playerViewDimensions]);

  const playerSendMap = () => {
    if (selectedMap) {
      setSelectedMapDimensions({
        width: selectedMap.width,
        height: selectedMap.height,
      });
      sendStateMessage('mapChange', selectedMap.src);
    }
  };

  const playerSendReveals = () => {
    sendStateMessage('revealsChange', fogOfWarReveals);
  };

  const playerSendScale = () => {
    sendStateMessage('scaleChange', playerViewScale);
  };

  const playerSendEffects = () => {
    sendStateMessage('effectsChange', effects);
  };

  const playerSendMapPosition = () => {
    sendStateMessage('mapPositionChange', {x: playerViewDimensions.x, y: playerViewDimensions.y});
  };

  const playerSendImageToShow = (image) => {
    sendStateMessage('showImage', image)
  };

  const playerCloseImageToShow = () => {
    sendStateMessage('closeImage', {})
  };

  const sendPlayerEverything = () => {
    playerSendMap();
    playerSendReveals();
    playerSendScale();
    playerSendEffects();
    playerSendMapPosition();
  };

  useEffect(() => {
    if (lastMessage) {
      const msg = JSON.parse(lastMessage.data);
      if (msg.type == 'playerViewChange') {
        setPlayerViewDimensions({x: playerViewDimensions.x, y: playerViewDimensions.y, width: msg.msg.width / playerViewScale, height: msg.msg.height / playerViewScale});
      } else if (msg.type == 'playerConnected') {
        sendPlayerEverything();
      }
    }
  }, [lastMessage]);

  const generateState = () => {
    return {
      map: {
        src: selectedMap.src,
        width: selectedMap.width,
        height: selectedMap.height
      },
      fogOfWarReveals: fogOfWarReveals,
      playerViewScale,
      dmViewScale,
      effects,
      photoLibraries
    };
  };

  const handleFogOfWarRevealsChange = (reveals) => {
    setFogOfWarReveals(reveals);
  };

  const handleEffectsChange = (effects) => {
    setEffects(effects);
  };

  const handleLoad = (loadedState) => {
    handleMapChange(loadedState.map.src);
    handleFogOfWarRevealsChange(loadedState.fogOfWarReveals);
    handleEffectsChange(loadedState.effects);
    handleDMViewRescale(loadedState.dmViewScale);
    handlePlayerViewRescale(loadedState.playerViewScale);
    handleLibraryChange(loadedState.photoLibraries);
  };

  const handleLibraryChange = (libraries) => {
    setPhotoLibraries(libraries);
  };

  const handlePhotoLibraryOpen = (library) => {
    setSelectedPhotoLibrary(library);
    setPhotoLibraryDialogOpen(true);
  };

  const handlePhotoLibraryClose = () => {
    setSelectedPhotoLibrary(null);
    setPhotoLibraryDialogOpen(false);
    playerCloseImageToShow();
  };

  const handlePhotoLibraryImageChange = (newimages) => {
    const library = photoLibraries[selectedPhotoLibrary];
    const newlibrary = {...library, images: newimages};
    let newlibraries = [...photoLibraries];
    newlibraries[selectedPhotoLibrary] = newlibrary;
    setPhotoLibraries(newlibraries);
  };

  const handlePhotoLibraryImageShow = (imageToShow) => {
    const library = photoLibraries[selectedPhotoLibrary];
    const image = library.images[imageToShow];
    playerSendImageToShow(image);
  };

  const handlePlayerScreenRepositioning = (e) => {
    if (e.key === 'p') {
      const {x, y} = stageRef.current.getRelativePointerPosition();

      const movex = x - playerViewDimensionsRef.current.width / 2;
      const movey = y - playerViewDimensionsRef.current.height / 2;
      setPlayerViewDimensions({...playerViewDimensionsRef.current, x: movex, y: movey});
    }
  };

  useEffect(() => {
    if (stageRef.current) {
      const currentStage = stageRef.current.container();
      currentStage.addEventListener('keypress', handlePlayerScreenRepositioning);
      return () => {
        currentStage.removeEventListener('keypress', handlePlayerScreenRepositioning);
      };
    }
  }, [stageRef.current]);

  return (
    <Fragment>
      <CssBaseline />
      <PhotoLibraryDialog 
        library={photoLibraries[selectedPhotoLibrary]}
        open={photoLibraryDialogOpen}
        onClose={handlePhotoLibraryClose}
        onImageChange={handlePhotoLibraryImageChange}
        onImageShow={handlePhotoLibraryImageShow}
      />
      <DMToolbox
        handleMapChange={handleMapChange}
        handleMapMove={handleMapMove}
        handleFogOfWarReveal={handleFogOfWarReveal}
        handlePlayerView={handlePlayerView}
        handleDMViewRescale={handleDMViewRescale}
        handlePlayerViewRescale={handlePlayerViewRescale}
        handleEffects={handleEffects}
        handleEffectColorChange={handleEffectColorChange}
        getState={generateState}
        handleLoad={handleLoad}
        handlePhotoLibraries={handlePhotoLibraries}

        mapMoveSelected={mapMoveSelected}
        fogOfWarRevealSelected={fogOfWarRevealSelected}
        playerViewSelected={playerViewSelected}
        dmViewScale={dmViewScale}
        playerViewScale={playerViewScale}
        effectsSelected={effectsSelected}
        selectedEffectColor={selectedEffectColor}
        connectionStatus={readyState}
        photoLibrariesSelected={photoLibrariesSelected}
      />
      <main>
        <Stage
          style={{ position: 'fixed', backgroundColor: "black" }}
          width={window.innerWidth}
          height={window.innerHeight}
          tabIndex={0}
          ref={stageRef}
          draggable={mapMoveSelected}
          scaleX={dmViewScale}
          scaleY={dmViewScale}
        >
          {selectedMap && (
            <Fragment>
              <Map image={selectedMap} />
              <FogOfWar 
                revealEnabled={fogOfWarRevealSelected}
                opacity={0.6}
                height={selectedMapDimensions.height}
                width={selectedMapDimensions.width}
                reveals={fogOfWarReveals}
                onRevealsChange={handleFogOfWarRevealsChange} />
              <Effects
                enabled={effectsSelected}
                height={selectedMapDimensions.height}
                width={selectedMapDimensions.width}
                color={selectedEffectColor}
                effects={effects}
                onChange={handleEffectsChange} />
              {playerViewDimensions.width && <PlayersView 
                ref={playersViewRef}
                selected={playerViewSelected}
                x={playerViewDimensions.x}
                y={playerViewDimensions.y}
                width={playerViewDimensions.width}
                height={playerViewDimensions.height}
                onChange={(attrs) => {setPlayerViewDimensions(attrs);}} />}
              {photoLibrariesSelected && <PhotoLibraries 
                enabled={photoLibrariesSelected}
                height={selectedMapDimensions.height}
                width={selectedMapDimensions.width}              
                libraries={photoLibraries}
                onChange={handleLibraryChange}
                onOpen={handlePhotoLibraryOpen} />}
            </Fragment>
          )}
        </Stage>
      </main>      
    </Fragment>
  );
};

export default DM;