import React, { useCallback, useEffect, useRef } from "react";
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
        if (fog.current) {
            const currentFog = fog.current;
            currentFog.getStage().container().addEventListener('keypress', handleDeleteSelectedReveal);
            return () => {
                currentFog.getStage().container().removeEventListener('keypress', handleDeleteSelectedReveal);
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
            setNewReveal([{ originalX: x, originalY: y, x, y, width: 0, height: 0, isNew: true }]);
        }
    };

    const handleMouseUp = e => {
        if (!revealEnabled) {
            return;
        }
        if (newReveal.length === 1) {
            if (newReveal[0].width > 0 && newReveal[0].height > 0) {
                const newProps = getNewProps(newReveal[0], e.target.getLayer().getRelativePointerPosition());

                const revealToAdd = {
                    ...newProps,
                    isNew: false
                };

                onRevealsChange([...reveals, revealToAdd]);
                setSelectedReveal(reveals.length);
            }
            setNewReveal([]);
        }
    };
    
    const getNewProps = ({originalX, originalY}, {x, y}) => {
        const newX = Math.min(originalX, x);
        const newY = Math.min(originalY, y);
      
        const width = Math.max(originalX, x) - newX;
        const height = Math.max(originalY, y) - newY;

        return {x: newX, y: newY, width, height, originalX, originalY};
    };

    const handleMouseMove = e => {
        if (!revealEnabled) {
            return;
        }
        if (newReveal.length === 1) {
            const newProps = getNewProps(newReveal[0], e.target.getLayer().getRelativePointerPosition());

            setNewReveal([
                {
                    ...newProps,
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
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            >
            <Rect
                ref={fog}
                x={0}
                y={0}
                width={width}
                height={height}
                fill={'rgba(0,0,0, ' + opacity + ')'}
                onMouseDown={handleMouseDown}
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
                    listening={revealEnabled && !reveal.isNew}
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