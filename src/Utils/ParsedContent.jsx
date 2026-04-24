import hljs from "highlight.js";
/*const  iscodline=(line)=>{
  return (
    line.includes("{")||
    line.includes("}")||
    line.includes(";")||
    line.includes("console.")||
    line.includes("function")||
    line.includes("=>")
  )
}*/
 export const parsecontent = (content) => {
  const lines = content.split('\n');
  let textlines = [];
  let codelines = [];
  let isCodeStarted = false; // مؤشر لبدء كتلة الكود

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    
    // فحص السطر: هل يحتوي على كلمات مفتاحية برمجية قوية؟
    const isStrongCodeIndicator = /^(def\s|class\s|import\s|from\s|if\s|return\s|print\(|#)/.test(trimmedLine);
    
    // استخدام highlightAuto لفحص السطر
    const result = hljs.highlightAuto(line);

    // المنطق: إذا وجدنا مؤشر كود قوي، نعتبر أن كل ما يليه هو كود
    if (isStrongCodeIndicator || (result.relevance > 2 && result.language)) {
      isCodeStarted = true;
    }

    if (isCodeStarted) {
      codelines.push(line);
    } else {
      // طالما لم يبدأ الكود بعد، كل شيء يعتبر نصاً
      textlines.push(line);
    }
  });

  // تحديد اللغة للكتلة البرمجية كاملة لضمان التلوين الصحيح
  const detected = hljs.highlightAuto(codelines.join("\n"));

  return {
    text: textlines.join("\n").trim(),
    code: codelines.join("\n").trim(),
    language: detected.language || "plaintext",
  };
};