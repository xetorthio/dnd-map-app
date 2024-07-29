import { Fragment, useRef, useState, useEffect } from "react";
import { Layer, Rect } from "react-konva";
import PhotoLibrary from "./PhotoLibrary";

const PhotoLibraries = ({onOpen, enabled, width, height, libraries, onChange}) => {
    const [selected, setSelected] = useState(null);
    const librariesRef = useRef();

    useEffect(() => {
        if (librariesRef.current) {
            const current = librariesRef.current.getStage().container();
            current.addEventListener('keypress', handleDeleteSelected);
            return () => {
                current.removeEventListener('keypress', handleDeleteSelected);
            }
        }
    }, [selected]);

    const handleDeleteSelected = (e) => {
        if (e.key === 'd' && selected != null) {
            let newlibraries = [...libraries];
            newlibraries = newlibraries.filter((library, i) => {
                return (i !== selected);
            });
            onChange(newlibraries);
            setSelected(null);
        }
        if (e.key == 'Enter' && selected != null) {
            onOpen(selected);
        }
    };

    const addNewPhotoLibrary = (e) => {
        const {x, y} = e.target.getLayer().getRelativePointerPosition();
        onChange([...libraries, {x: x-20, y: y-20, images: []}]);
        setSelected(libraries.length);
    };

    const checkDeselect = (e) => {
        const clickedOnEmpty = e.target === librariesRef.current;
        if (clickedOnEmpty) {
            setSelected(null);
        }
    };


    return (
        <Layer
            onMouseDown={checkDeselect}
        >
            <Rect
                ref={librariesRef}
                x={0}
                y={0}
                width={width}
                height={height}
                fill={'rgba(0,0,0, 0)'}
                listening={enabled}
                onDblClick={addNewPhotoLibrary}
                />
            {libraries.map((library, i) => (
                <PhotoLibrary
                    key={i}
                    x={library.x}
                    y={library.y} 
                    draggable={enabled}
                    listening={enabled}
                    onSelect={() => {setSelected(i)}}
                    selected={selected == i}
                    onOpen={() => {onOpen(i)}}
                    onChange={(attrs) => {
                        const newlibraries = [...libraries];
                        newlibraries[i] = {...libraries[i], ...attrs};
                        onChange(newlibraries);
                    }}
                />
            ))}
        </Layer>
    );
};

export default PhotoLibraries;