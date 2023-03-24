import React from 'react';
import { alphabetize } from '../../util.js';

const massage = cI => {
    cI.sortName = `
            ${cI.state.order !== null ? `${cI.state.order}` : ``}${cI.character.name}${cI.state.value !== null ? `${cI.state.value}` : `${cI.state.State.name}`}
`.toUpperCase();
return cI
};

function CharacterInstances(props) {
    //console.log("CharacterInstances");
    if (!props.characterInstances) return ''; //TODO: is this the best place to handle this?
    //console.log(props.characterInstances);

    let characterInstances = alphabetize([...props.characterInstances].map(cI => massage({...cI})), "sortName");
    
    const style = {marginLeft:"4em"}
    return characterInstances.map(({pbotID, character, state}) => (
        <div key={pbotID}  style={props.style || style}>
            {character.name}: {(state.value !== null && state.value !== '') ? `${state.value}` : `${state.State.name}`}{state.order ? `, order: ${state.order}` : ``}<br />
        </div>
    ));
}

export default CharacterInstances;
