import React, { Fragment, useEffect, useRef } from "react";
import { Rect, Transformer } from "react-konva";

const FogOfWarReveal = ({isSelected, isNew, onSelect, x, y, height, width, draggable, onChange}) => {
    const trRef = useRef();
    const revealRef = useRef();

    const moveToTop = () => {
        if (revealRef.current) {
            revealRef.current.moveToTop();
        }
        if (trRef.current) {
            trRef.current.moveToTop();
        }
    }
    useEffect(() => {
        if (isSelected) {
            trRef.current.nodes([revealRef.current]);
            trRef.current.getLayer().batchDraw();
            moveToTop();
        }
    }, [isSelected]);

    useEffect(() => {
        if (isNew) {
            moveToTop();
        }
    }, [isNew])
    
    return (
        <Fragment>
            <Rect
                ref={revealRef}
                x={x}
                y={y}
                width={width}
                height={height}
                fill={'rgba(255,255,255,1)'}
                draggable={draggable}
                onMouseOver={() => {document.body.style.cursor = 'move'}}
                onMouseOut={() => {document.body.style.cursor = 'default'}}
                globalCompositeOperation="destination-out"
                onClick={onSelect}
                onDragStart={onSelect}
                onDragEnd={(e) => {
                    onChange({
                        width: width,
                        height: height,
                        x: e.target.x(),
                        y: e.target.y(),
                    });
                }}
                onTransformEnd={(e) => {
                    const node = revealRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    node.scaleX(1);
                    node.scaleY(1);

                    onChange({
                        x: node.x(),
                        y: node.y(),
                        width: node.width() * scaleX,
                        height: node.height() * scaleY
                    });
                }}
            />
            {isSelected && <Transformer
                ref={trRef}
                flipEnabled={false}
                rotateEnabled={false}
            />}
        </Fragment>
    );
};

export default FogOfWarReveal;