import { useEffect, useState } from "react";
import Markdown from "markdown-to-jsx";

const Contact = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/pbot-static/About/Contact/Contact.md")
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, []);

  return (
    <div align="left" style={{marginLeft:"10em", marginRight:"10em"}}>
      <Markdown>{content}</Markdown>
    </div>
  );
};

export default Contact;