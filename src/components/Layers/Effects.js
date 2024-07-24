import React, { useRef, useState, useEffect } from "react";
import Effect from "./Effect";
import { Layer, Rect } from "react-konva";

const Effects = ({enabled, width, height, color, effects, onChange}) => {
    const effectsRef = useRef();
    const [selectedEffect, setSelectedEffect] = useState(null);
    const [newEffect, setNewEffect] = useState([]);

    useEffect(() => {
        effectsRef.current.getStage().container().addEventListener('keypress', handleDeleteSelectedEffect);
        return () => {
            if (effectsRef.current) {
                effectsRef.current.getStage().container().removeEventListener('keypress', handleDeleteSelectedEffect);
            }
        }
    }, [selectedEffect]);

    useEffect(() => {
        if (!enabled) {
            setSelectedEffect(null);
        }
    }, [enabled]);

    useEffect(() => {
        if (selectedEffect != null) {
            let neweffects = [...effects];
            let updatedEffect = effects[selectedEffect];
            updatedEffect.color = color;
            neweffects[selectedEffect] = updatedEffect;
            onChange(neweffects);
        }
    }, [color]);


    const handleDeleteSelectedEffect = (e) => {
        if (e.key === 'd' && selectedEffect != null) {
            let neweffects = [...effects];
            neweffects = neweffects.filter((effect, i) => {
                return (i !== selectedEffect);
            });
            onChange(neweffects);
            setNewEffect([]);
            setSelectedEffect(null);
        }
    };

    const checkDeselect = (e) => {
        const clickedOnEmpty = e.target === effectsRef.current;
        if (clickedOnEmpty) {
            setSelectedEffect(null);
        }
    };

    const handleMouseDown = e => {
        if (!enabled) {
            return;
        }
        if (newEffect.length === 0) {
            const { x, y } = e.target.getLayer().getRelativePointerPosition();
            setSelectedEffect(effects.length+1);
            setNewEffect([{ x, y, width: 0, height: 0, isNew: true, color: color, rotation: 0 }]);
        }
    };

    const handleMouseUp = e => {
        if (!enabled) {
            return;
        }
        if (newEffect.length === 1) {
            if (newEffect[0].width > 0 && newEffect[0].height > 0) {
                const sx = newEffect[0].x;
                const sy = newEffect[0].y;
                const { x, y } = e.target.getLayer().getRelativePointerPosition();
                const effectToAdd = {
                    x: sx,
                    y: sy,
                    width: x - sx,
                    height: y - sy,
                    isNew: false,
                    color: color,
                    rotation: 0
                };
                onChange([...effects, effectToAdd]);
                setSelectedEffect(effects.length);
            }
            setNewEffect([]);
        }
    };
    
    const handleMouseMove = e => {
        if (!enabled) {
            return;
        }
        if (newEffect.length === 1) {
          const sx = newEffect[0].x;
          const sy = newEffect[0].y;
          const { x, y } = e.target.getLayer().getRelativePointerPosition();
          const nwidth = x - sx <= 0 ? 10 : x - sx;
          const nheight = y - sy <= 0 ? 10 : y - sy;

          setNewEffect([
            {
              x: sx,
              y: sy,
              width: nwidth,
              height: nheight,
              isNew: true,
              rotation: 0,
              color: color
            }
          ]);
        }
    };

    const handleSelectEffect = (i) => {
        if (!enabled) {
            return;
        }
        setSelectedEffect(i);
        setNewEffect([]);
    };

    const effectsToDraw = [...effects, ...newEffect];

    return (
        <Layer
            onMouseDown={checkDeselect}
        >
            <Rect
                ref={effectsRef}
                x={0}
                y={0}
                width={width}
                height={height}
                fill={'rgba(0,0,0, 0)'}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                listening={enabled}
                />
            {effectsToDraw.map((effect, i) => (
                <Effect
                    draggable={enabled}
                    x={effect.x}
                    y={effect.y}
                    width={effect.width}
                    height={effect.height}
                    rotation={effect.rotation}
                    onSelect={() => {handleSelectEffect(i)}}
                    key={i}
                    isNew={effect.isNew}
                    isSelected={selectedEffect === i}
                    color={effect.color}
                    onChange={(attrs) => {
                        const neweffects = [...effects];
                        neweffects[i] = {...effects[i], ...attrs};
                        onChange(neweffects);
                    }}
                />
            ))}
        </Layer>
    );
};

export default Effects;