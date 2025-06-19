export const capitalize = ([firstLetter, ...restOfWord]: string) => {
  return firstLetter.toUpperCase() + restOfWord.join("");
};

// Calculate line numbers based on content
export const getLineNumbers = (content: string) => {
  const lines = content.split("\n").length;
  return Array.from({ length: Math.max(lines, 1) }, (_, i) => i + 1);
};

// Get placeholder based on content type
export const getPlaceholder = (bodyContentType: string) => {
  switch (bodyContentType) {
    case "JSON":
      return `{\n  "sample": "JSON body"\n}`;
    case "HTML":
      return `<html>\n  <body>\n    <!-- HTML content -->\n  </body>\n</html>`;
    case "XML":
      return `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <!-- XML content -->\n</root>`;
    case "Javascript":
      return `// JavaScript code\nconsole.log("Hello World");`;
    default:
      return "Enter your content here...";
  }
};
