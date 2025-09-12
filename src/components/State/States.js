import React from 'react';
import { sort } from '../../util.js';
import { Text, View } from '@react-pdf/renderer';

function States(props) {
    console.log("States");
    /*
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
    */
    const states = sort([...props.states], "#order", "name");

    const level = (props.level || 0) + 1;
    const style = {marginLeft: level * 6};

    const myUL = {marginTop:"0", marginBottom:"0"}
    return (
        <>
        {"pdf" === props.format &&
            <>
            {states.map(({pbotID, name, definition, states}) => (
                <View key={pbotID}  style={props.style || style}>
                    <Text>{name}{definition ? `, ${definition}` : ''}</Text>
                    <States states={states} format="pdf" level={level} />
                </View>
            ))}
            </>
            }
        {"pdf" !== props.format &&
            <ul style={myUL}>
            {states.map(({pbotID, name, definition, states}) => (
                <li key={pbotID}>
                    {name}{definition ? `, ${definition}` : ''}
                    <States states={states} />
                </li>
            ))}
            </ul>
        }
        </>
    )
    
}

export default States;
