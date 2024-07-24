import { Layer, Image } from 'react-konva';
import React from "react";

const Map = ({image, x=0, y=0 }) => {
    return (
        <Layer>
            <Image x={x} y={y} image={image} width={image.width} height={image.height} />
        </Layer>
    );
}

export default Map;