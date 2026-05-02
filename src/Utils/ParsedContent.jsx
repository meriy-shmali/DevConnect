import hljs from "highlight.js";

export const parsecontent = (content) => {
  const lines = content.split('\n');
  let textlines = [];
  let codelines = [];
  let isCodeStarted = false;

  lines.forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      if (isCodeStarted) codelines.push(line);
      else textlines.push(line);
      return;
    }

    // 1. فحص التاغات: الهاشتاج الملتصق بالكلمة (مثل #react) يعتبر نص
    const isTagOnly = /^#\w+(\s+#\w+)*$/.test(trimmedLine);

    // 2. فحص التعليق البرمجي: هاشتاج وبعده مسافة (مثل # This is a comment) يعتبر كود
    const isCodeComment = trimmedLine.startsWith('# ');

    // 3. المؤشرات البرمجية القوية
    const isStrongCodeIndicator = /^(def\s|class\s|import\s|from\s|if\s|return\s|print\(|const\s|let\s|var\s|function\s)/.test(trimmedLine);

    // تفعيل وضع الكود إذا وجدنا مؤشر كود أو تعليق برمجي بشرط ألا يكون مجرد تاغات
    if ((isStrongCodeIndicator || isCodeComment) && !isTagOnly) {
      isCodeStarted = true;
    }

    if (isCodeStarted) {
      codelines.push(line);
    } else {
      textlines.push(line);
    }
  });

  const codeString = codelines.join("\n").trim();
  // التأكد من وجود نص قبل التمرير لـ highlightAuto لتجنب الأخطاء
  const detected = codeString ? hljs.highlightAuto(codeString) : { language: "plaintext" };

  return {
    text: textlines.join("\n").trim(),
    code: codeString,
    language: detected.language || "plaintext",
  };
};