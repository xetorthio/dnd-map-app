import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import { Fragment, useState, useRef, useEffect } from 'react';
import { Path, Transformer } from 'react-konva';

const PhotoLibrary = ({onOpen, draggable, selected, listening, x, y, onSelect, onChange}) => {
    const trRef = useRef();
    const libraryRef = useRef();

    const [isOver, setIsOver] = useState(false);

    const moveToTop = () => {
        if (libraryRef.current) {
            libraryRef.current.moveToTop();
        }
        if (trRef.current) {
            trRef.current.moveToTop();
        }
    }
    useEffect(() => {
        if (selected) {
            trRef.current.nodes([libraryRef.current]);
            trRef.current.getLayer().batchDraw();
            moveToTop();
        }
    }, [selected]);

    useEffect(() => {
        if (libraryRef.current) {
            libraryRef.current.getStage().on('scaleXChange', () => {
                if (libraryRef.current) {
                    const inverseScale = 2 / libraryRef.current.getStage().scaleX();
                    libraryRef.current.scaleX(inverseScale);
                    libraryRef.current.scaleY(inverseScale);
                }
            });
        }
        if (libraryRef.current) {
            const inverseScale = 2 / libraryRef.current.getStage().scaleX();
            libraryRef.current.scaleX(inverseScale);
            libraryRef.current.scaleY(inverseScale);
        }
    }, []);

    return (
        <Fragment>
            <Path
                draggable={draggable}
                onMouseOver={() => {setIsOver(true)}}
                onMouseOut={() => {setIsOver(false)}}
                x={x}
                y={y}
                data='M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2m-11-4 2.03 2.71L16 11l4 5H8zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6z'
                fill={isOver ? 'white' : 'lightgray'}
                onClick={onSelect}
                onDragStart={onSelect}
                listening={listening}
                ref={libraryRef}
                onDragEnd={(e) => {
                    onChange({
                        x: e.target.x(),
                        y: e.target.y()
                    });
                }}
                onDblClick={onOpen}
            />
            {selected && <Transformer
                listening={listening}
                ref={trRef}
                rotateEnabled={false}
                onTransform={(e) => {
                    trRef.current.stopTransform();
                }}
            />}
        </Fragment>
    );
};

export default PhotoLibrary;