import React from 'react';
import States from '../State/States';

function Characters(props) {
    console.log("Characters");
    if (!props.characters) return ''; //TODO: is this the best place to handle this?
    let characters = [...props.characters];
    characters.sort((a,b) => {
        const nameA = a.name.toUpperCase(); 
        const nameB = b.name.toUpperCase(); 
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    const style = {marginLeft:"2em"}
    return characters.map(({pbotID, name, states}) => (
        <div key={pbotID}  style={style}>
            {name}
            <States states={states} />
        </div>
    ));
}

export default Characters;
