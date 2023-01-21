import React from 'react';
import States from '../State/States';
import { sort } from '../../util.js';

function Characters(props) {
    console.log("Characters");
    if (!props.characters) return ''; //TODO: is this the best place to handle this?
   /*
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
    */
   const characters = sort([...props.characters], "order", "name");

    
    const style = props.top ? {marginLeft:"4em"} : {marginLeft:"2em"};
    console.log(style);
    return characters.map(({pbotID, name, definition, states, characters}) => (
        <div key={pbotID}  style={style}>
            {name}{definition ? `, ${definition}` : ''}
            <States states={states} />
            <Characters characters={characters} />
        </div>
    ));
}

export default Characters;
