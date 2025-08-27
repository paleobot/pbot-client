import React from 'react';
import { sort } from '../../util.js';

const massage = cI => {
    cI.sortName = `${cI.character.name}${cI.state.value !== null ? cI.state.value : cI.state.State.name}`.toUpperCase();
return cI
};

function CharacterInstances(props) {
    //console.log("CharacterInstances");
    if (!props.characterInstances) return ''; //TODO: is this the best place to handle this?
    //console.log(props.characterInstances);

    let characterInstances = sort([...props.characterInstances].map(cI => massage({...cI})), "#order", "sortName");
    
    const style = {marginLeft:"4em"}
    return characterInstances.map(({pbotID, character, state}) => (
        <div key={pbotID}  style={props.style || style}>
            {character.name}: {(state.value !== null && state.value !== '') ? `${state.value}` : `${state.State.name}`}{state.order ? `, order: ${state.order}` : ``}<br />
        </div>
    ));
}

export default CharacterInstances;
