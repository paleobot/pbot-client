import React from 'react';
import { sort } from '../../util.js';

const massage = cI => {
    cI.sortName = `${cI.character.name}${cI.state.value !== null ? cI.state.value : cI.state.State.name}`.toUpperCase();
    cI.deepOrder = `${cI.character.deepOrder}.${cI.state.State.deepOrder}` || '';
    console.log(`cI.deepOrder for ${cI.character.name} = ${cI.deepOrder}`);
return cI
};

function CharacterInstances(props) {
    //console.log("CharacterInstances");
    if (!props.characterInstances) return ''; //TODO: is this the best place to handle this?
    //console.log(props.characterInstances);

    //TODO: There is no order in the characterInstances, so these get output in alphabetical order. They would like to see them in the order of the schema. To do that, we'd need to 1) include the character.order field in the gql query (like in OTUQueryResults), and 2) get the orders of all the characters between the cI and the schema node, then heirarchically sort on those. Sounds pretty terrible, but I'm dropping this TODO here as a pointer if we ever decide to do it.
    //let characterInstances = sort([...props.characterInstances].map(cI => massage({...cI})), "#order", "sortName");
    let characterInstances = sort([...props.characterInstances].map(cI => massage({...cI})), "deepOrder", "sortName");

    const style = {marginLeft:"4em"}
    return characterInstances.map(({pbotID, character, state}) => (
        <div key={pbotID}  style={props.style || style}>
            {character.name}: {(state.value !== null && state.value !== '') ? `${state.value}` : `${state.State.name}`}{state.order ? `, order: ${state.order}` : ``}<br />
        </div>
    ));
}

export default CharacterInstances;
