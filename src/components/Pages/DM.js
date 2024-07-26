import { Stage } from 'react-konva';
import { Fragment, useState, useEffect, useRef } from 'react';
import Map from '../Layers/Map';
import FogOfWar from '../Layers/FogOfWar';
import DMToolbox from '../Toolbox/DMToolbox';
import PlayersView from '../Layers/PlayersView';
import Effects from '../Layers/Effects';
import useWebSocket from 'react-use-websocket';

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
  const [selectedEffectColor, setSelectedEffectColor] = useState({
    r: '241',
    g: '112',
    b: '19',
    a: '1',
  });
  const [playerViewDimensions, setPlayerViewDimensions] = useState({x: 0, y: 0});

  const sendStateMessage = (type, msg) => {
    sendMessage(JSON.stringify({type: type, msg: msg}));
  };

  const toolChangeReset = () => {
    setMapMoveSelected(false);
    setFogOfWarRevealSelected(false);
    setPlayerViewSelected(false);
    setEffectsSelected(false);
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
  }, [playerViewDimensions])

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
        setPlayerViewDimensions({...playerViewDimensions, width: msg.msg.width / playerViewScale, height: msg.msg.height / playerViewScale});
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
  };

  return (
    <Fragment>
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

        mapMoveSelected={mapMoveSelected}
        fogOfWarRevealSelected={fogOfWarRevealSelected}
        playerViewSelected={playerViewSelected}
        dmViewScale={dmViewScale}
        playerViewScale={playerViewScale}
        effectsSelected={effectsSelected}
        selectedEffectColor={selectedEffectColor}
        connectionStatus={readyState}
      />
      <Stage
        style={{ backgroundColor: "black" }}
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
              x={0}
              y={0}
              width={playerViewDimensions.width}
              height={playerViewDimensions.height}
              onChange={(attrs) => {setPlayerViewDimensions(attrs);}} />}
          </Fragment>
        )}
      </Stage>
    </Fragment>
  );
};

export default DM;