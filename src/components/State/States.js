import React from 'react';

function States(props) {
    console.log("States");
    let states = [...props.states];
    states.sort((a,b) => {
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
    const myUL = {marginTop:"0", marginBottom:"0"}
    return (
        <ul style={myUL}>
        {states.map(({pbotID, name, definition, states}) => (
            <li key={pbotID}>
                {name}{definition ? `, ${definition}` : ''}
                <States states={states} />
            </li>
        ))}
        </ul>
    )
    
}

export default States;
