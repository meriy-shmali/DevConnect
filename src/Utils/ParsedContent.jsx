import hljs from "highlight.js";
  export const parsecontent=(content)=>{
  const lines=content.split('\n');
  let textlines=[];
  let codelines=[];
  lines.forEach((line)=>{
    const result=hljs.highlightAuto(line);
    if(result.language&&result.relevance>2){
      codelines.push(line);
    }
    else{
      textlines.push(line);
    }
  })
   const detected = hljs.highlightAuto(codelines.join("\n"));

  return {
    text: textlines.join("\n").trim(),
    code: codelines.join("\n").trim(),
    language: detected.language || "plaintext",
  };
 }
