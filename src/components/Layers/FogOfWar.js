import React, { useEffect, useRef } from "react";
import { Layer, Rect } from "react-konva";
import { useState } from "react";
import FogOfWarReveal from "./FogOfWarReveal";

const FogOfWar = ({opacity, height, width, revealEnabled, reveals, onRevealsChange}) => {
    const fog = useRef();
    const [newReveal, setNewReveal] = useState([]);
    const [selectedReveal, setSelectedReveal] = useState(null);

    const handleDeleteSelectedReveal = (e) => {
        if (e.key === 'd' && selectedReveal != null) {
            let newReveals = [...reveals];
            newReveals = newReveals.filter((reveal, i) => {
                return (i !== selectedReveal);
            });
            onRevealsChange(newReveals);
            setNewReveal([]);
        }
    };

    useEffect(() => {
        fog.current.getStage().container().addEventListener('keypress', handleDeleteSelectedReveal);
        return () => {
            if (fog.current) {
                fog.current.getStage().container().removeEventListener('keypress', handleDeleteSelectedReveal);
            }
        }
    }, [selectedReveal]);

    useEffect(() => {
        if (!revealEnabled) {
            setSelectedReveal(null);
        }
    }, [revealEnabled]);

    const handleMouseDown = e => {
        if (!revealEnabled) {
            return;
        }
        if (newReveal.length === 0) {
            const { x, y } = e.target.getLayer().getRelativePointerPosition();
            setSelectedReveal(reveals.length+1);
            setNewReveal([{ x, y, width: 0, height: 0, isNew: true }]);
        }
    };

    const handleMouseUp = e => {
        if (!revealEnabled) {
            return;
        }
        if (newReveal.length === 1) {
            if (newReveal[0].width > 0 && newReveal[0].height > 0) {
                const sx = newReveal[0].x;
                const sy = newReveal[0].y;
                const { x, y } = e.target.getLayer().getRelativePointerPosition();
                const revealToAdd = {
                    x: sx,
                    y: sy,
                    width: x - sx,
                    height: y - sy,
                    isNew: false
                };

                onRevealsChange([...reveals, revealToAdd]);
                setSelectedReveal(reveals.length);
            }
            setNewReveal([]);
        }
    };
    
    const handleMouseMove = e => {
        if (!revealEnabled) {
            return;
        }
        if (newReveal.length === 1) {
          const sx = newReveal[0].x;
          const sy = newReveal[0].y;
          const { x, y } = e.target.getLayer().getRelativePointerPosition();
          const nwidth = x - sx <= 0 ? 10 : x - sx;
          const nheight = y - sy <= 0 ? 10 : y - sy;

          setNewReveal([
            {
              x: sx,
              y: sy,
              width: nwidth,
              height: nheight,
              isNew: true
            }
          ]);
        }
    };

    const checkDeselect = (e) => {
        const clickedOnEmpty = e.target === fog.current;
        if (clickedOnEmpty) {
            setSelectedReveal(null);
        }
    };

    const handleSelectReveal = (i) => {
        if (!revealEnabled) {
            return;
        }
        setSelectedReveal(i);
        setNewReveal([]);
    };

    const revealsToDraw = [...reveals, ...newReveal];

    return (
        <Layer 
            onMouseDown={checkDeselect}
            >
            <Rect
                ref={fog}
                x={0}
                y={0}
                width={width}
                height={height}
                fill={'rgba(0,0,0, ' + opacity + ')'}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                listening={revealEnabled}
                />
            {revealsToDraw.map((reveal, i) => (
                <FogOfWarReveal
                    draggable={revealEnabled}
                    x={reveal.x}
                    y={reveal.y}
                    width={reveal.width}
                    height={reveal.height}
                    onSelect={() => {handleSelectReveal(i)}}
                    key={i}
                    isNew={reveal.isNew}
                    isSelected={selectedReveal === i}
                    onChange={(attrs) => {
                        const newreveals = [...reveals];
                        newreveals[i] = {...reveals[i], ...attrs};
                        onRevealsChange(newreveals);
                    }}
                />
            ))}
        </Layer>
    );
};

export default FogOfWar;