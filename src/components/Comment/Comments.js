import { Box, Typography } from '@mui/material';
import React from 'react';
import { sort, DirectQueryLink } from '../../util.js';
import { Text } from '@react-pdf/renderer';

export function Comments(props) {
    console.log("Comments");
    if (!props.comments) return ''; //TODO: is this the best place to handle this?

    if ('pdf' === props.format) {

        // @react-pdf/renderer does not honor em units for margin; use points.
        // Mirror the web ratio (level*2 and level*2+2 em) at ~10pt per em.
        const style1 = {
            marginLeft: props.level * 20,
            fontSize: 10,
        }
        const style2 = {
            marginLeft: props.level * 20 + 20,
            fontSize: 10,
        }

        console.log(style1)
        console.log(style2)

        return (
            <>
                {props.comments.map((comment, i) => (
                    <>
                        <Text style={[style1, {fontWeight: 'bold'}]}>
                            {comment.enteredBy[0].Person.given + " " + comment.enteredBy[0].Person.surname + " (" + comment.enteredBy[0].timestamp.formatted + ")"}
                        </Text>
                        <Text style={style2}>{comment.content}</Text>
                        {comment.references && comment.references.length > 0 &&
                            <Text style={style2}>
                                References: {sort([...comment.references], "order").map(ref => ref.Reference.title).join(', ')}
                            </Text>
                        }
                        <Comments comments={comment.comments} level={props.level + 1} format={props.format}/>
                    </>
                ))}
            </>
        )

    } else {

        const style1 = {marginLeft:`${(props.level * 2)}em`}
        const style2 = {marginLeft:`${(props.level * 2) + 2}em`}

        console.log(style1)
        console.log(style2)

        return (
            <>
                {props.comments.map((comment, i) => (
                    <div key={i}>
                        <div style={style1}>
                            <b>{comment.enteredBy[0].Person.given + " " + comment.enteredBy[0].Person.surname + " (" + comment.enteredBy[0].timestamp.formatted + ")"}</b>
                        </div>
                        <div style={style2}>{comment.content}</div>
                        {comment.references && comment.references.length > 0 &&
                            <div style={style2}>
                                References: {sort([...comment.references], "order").map((ref, idx, arr) => (
                                    <span key={ref.Reference.pbotID}>
                                        <DirectQueryLink type="reference" pbotID={ref.Reference.pbotID} text={ref.Reference.title} />
                                        {idx < arr.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </div>
                        }
                        <Comments comments={comment.comments} level={props.level + 1}/>
                    </div>
                ))}
            </>
        )
    }
}
