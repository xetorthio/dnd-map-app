import React, { Fragment, useEffect, useRef } from "react";
import { Rect, Transformer } from "react-konva";

const Effect = ({listening, isSelected, isNew, onSelect, x, y, height, width, rotation, draggable, color, onChange}) => {
    const trRef = useRef();
    const effectRef = useRef();

    const moveToTop = () => {
        if (effectRef.current) {
            effectRef.current.moveToTop();
        }
        if (trRef.current) {
            trRef.current.moveToTop();
        }
    }
    useEffect(() => {
        if (isSelected) {
            trRef.current.nodes([effectRef.current]);
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
                ref={effectRef}
                x={x}
                y={y}
                width={width}
                height={height}
                rotation={rotation}
                fill={'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')'}
                draggable={draggable}
                onMouseOver={() => {document.body.style.cursor = 'move'}}
                onMouseOut={() => {document.body.style.cursor = 'default'}}
                onClick={onSelect}
                onDragStart={onSelect}
                listening={listening}
                onDragEnd={(e) => {
                    onChange({
                        width: width,
                        height: height,
                        x: e.target.x(),
                        y: e.target.y(),
                        rotation: e.target.rotation()
                    });
                }}
                onTransformEnd={(e) => {
                    const node = effectRef.current;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();
                    node.scaleX(1);
                    node.scaleY(1);

                    onChange({
                        x: node.x(),
                        y: node.y(),
                        width: node.width() * scaleX,
                        height: node.height() * scaleY,
                        rotation: node.rotation()
                    });
                }}
            />
            {isSelected && <Transformer
                listening={listening}
                ref={trRef}
            />}
        </Fragment>
    );
};

export default Effect;