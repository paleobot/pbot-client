import { Box, Typography } from '@mui/material';
import React from 'react';
import { sort } from '../../util.js';

export function Comments(props) {
    console.log("Comments");
    if (!props.comments) return ''; //TODO: is this the best place to handle this?
   
   const style1 = {marginLeft:`${(props.level * 2)}em`}
   const style2 = {marginLeft:`${(props.level * 2) + 2}em`}

   console.log(style1)
   console.log(style2)

    return (
        <>
            {props.comments.map((comment, i) => (
                <div key={i}>
                    <div style={style1}>
                        <b>{comment.enteredBy[0].Person.given + " " + comment.enteredBy[0].Person.surname}</b>
                    </div>
                    <div style={style2}>{comment.content}</div>
                    <Comments comments={comment.comments} level={props.level + 1}/>
                </div>
            ))}
        </>
    )
}