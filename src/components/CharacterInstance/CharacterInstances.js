import React from 'react';

function CharacterInstances(props) {
    //console.log("CharacterInstances");
    if (!props.characterInstances) return ''; //TODO: is this the best place to handle this?
    //console.log(props.characterInstances);
    let characterInstances = [...props.characterInstances];
    characterInstances.sort((a,b) => {
        const nameA = a.character.name.toUpperCase(); 
        const nameB = b.character.name.toUpperCase(); 
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        return 0;
    });
    const style = {marginLeft:"2em"}
    return characterInstances.map(({pbotID, character, state}) => (
        <div key={pbotID}  style={style}>
            {character.name}: {state.value !== null ? `${state.value}` : `${state.State.name}`}<br />
        </div>
    ));
}

export default CharacterInstances;
