import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Render LaTeX math expression to HTML
 */
export const renderMath = (latex: string, displayMode: boolean = false): string => {
  try {
    return katex.renderToString(latex, {
      throwOnError: false,
      displayMode,
      strict: false,
    });
  } catch (error) {
    console.error('KaTeX rendering error:', error);
    return latex;
  }
};

/**
 * Check if text contains LaTeX expressions
 */
export const containsLatex = (text: string): boolean => {
  // Check for inline math: $...$
  const inlineMatch = /\$[^$]+\$/;
  // Check for display math: $$...$$
  const displayMatch = /\$\$[^$]+\$\$/;
  // Check for \(...\) or \[...\]
  const bracketMatch = /\\[\(\[].*\\[\)\]]/;
  
  return inlineMatch.test(text) || displayMatch.test(text) || bracketMatch.test(text);
};

/**
 * Parse and render text with embedded LaTeX
 */
export const parseAndRenderMath = (text: string): string => {
  if (!text) return '';
  
  // Replace display math $$...$$
  let result = text.replace(/\$\$([^$]+)\$\$/g, (_, latex) => {
    return `<span class="katex-display">${renderMath(latex, true)}</span>`;
  });
  
  // Replace inline math $...$
  result = result.replace(/\$([^$]+)\$/g, (_, latex) => {
    return `<span class="katex-inline">${renderMath(latex, false)}</span>`;
  });
  
  return result;
};

/**
 * React component helper - render math as HTML
 */
export const createMathHtml = (text: string): { __html: string } => {
  return { __html: parseAndRenderMath(text) };
};
