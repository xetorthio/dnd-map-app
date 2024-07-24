import React, { forwardRef } from "react";
import { Layer, Rect } from "react-konva";

const PlayersView = ({selected, x, y, width, height, onChange}, ref) => {
    return (
        <Layer id="playersView">
            <Rect
                ref={ref}
                x={x}
                y={y}
                width={width}
                height={height}
                strokeEnabled={true}
                strokeWidth={2}
                stroke={'rgba(0,0,255,0.8)'}
                strokeScaleEnabled={false}
                draggable={selected}
                dash={[10, 10]}
                listening={selected}
                onDragEnd={(e) => {
                    onChange({
                        width: width,
                        height: height,
                        x: e.target.x(),
                        y: e.target.y()
                    });
                }}
                />
        </Layer>
    );
};

export default forwardRef(PlayersView);