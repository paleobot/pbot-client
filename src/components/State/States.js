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
    const style = {marginLeft:"4em"}
    return states.map(({pbotID, name, definition}) => (
        <div key={pbotID}  style={style}>
            {name}, {definition}
        </div>
    ));
}

export default States;
