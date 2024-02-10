import { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";

const MDElement = (props) => {
    const [content, setContent] = useState(props.children ? props.children : "");

    useEffect(() => {
        if (props.path) {
            fetch("/pbot-static/" + props.path)
            .then((res) => {
                if (res.ok) {
                    return res.text()
                } else {
                    return "Not yet implemented"
                }
            })
            .then((text) => setContent(text))
        }
    }, []);

    return (
        <div align="left" style={{marginLeft:"10em", marginRight:"10em"}}>
        <Markdown>{content}</Markdown>
        </div>
    );
};

export default MDElement;