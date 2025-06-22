import React from "react";
import styled from "styled-components";

// === STYLED COMPONENTS ===
const MarkdownContainer = styled.div`
  direction: rtl;
  text-align: right;
  line-height: 1.8;
  color: #2c3e50;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui,
    sans-serif;
  max-width: 100%;
  word-wrap: break-word;

  /* Ensure high specificity */
  && {
    * {
      box-sizing: border-box;
    }
  }
`;

const H1 = styled.h1`
  font-size: 2rem !important;
  font-weight: 700 !important;
  color: #1a365d !important;
  margin: 2rem 0 1.5rem 0 !important;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid #3182ce;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 1.75rem !important;
    margin: 1.5rem 0 1rem 0 !important;
  }
`;

const H2 = styled.h2`
  font-size: 1.6rem !important;
  font-weight: 600 !important;
  color: #2d3748 !important;
  margin: 1.75rem 0 1rem 0 !important;
  padding-right: 1rem;
  border-right: 4px solid #4299e1;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 1.4rem !important;
    margin: 1.5rem 0 0.75rem 0 !important;
  }
`;

const H3 = styled.h3`
  font-size: 1.3rem !important;
  font-weight: 600 !important;
  color: #4a5568 !important;
  margin: 1.5rem 0 0.75rem 0 !important;
  line-height: 1.4;

  @media (max-width: 768px) {
    font-size: 1.2rem !important;
    margin: 1.25rem 0 0.5rem 0 !important;
  }
`;

const H4 = styled.h4`
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  color: #718096 !important;
  margin: 1.25rem 0 0.5rem 0 !important;
  line-height: 1.5;
`;

const Paragraph = styled.p`
  margin: 0 0 1.25rem 0 !important;
  line-height: 1.8;
  color: #4a5568 !important;
  font-size: 1rem !important;

  @media (max-width: 768px) {
    font-size: 0.95rem !important;
    line-height: 1.7;
  }
`;

const UnorderedList = styled.ul`
  margin: 1rem 0 1.5rem 1.5rem !important;
  padding: 0 !important;
  list-style: none !important;

  @media (max-width: 768px) {
    margin-right: 1rem !important;
  }
`;

const OrderedList = styled.ol`
  margin: 1rem 0 1.5rem 1.5rem !important;
  padding: 0 !important;
  counter-reset: list-counter;

  @media (max-width: 768px) {
    margin-right: 1rem !important;
  }
`;

const ListItem = styled.li`
  margin: 0.75rem 0 !important;
  padding-right: 1.5rem !important;
  line-height: 1.7;
  color: #4a5568 !important;
  position: relative;
  font-size: 1rem !important;

  &.unordered::before {
    content: "•";
    color: #3182ce !important;
    font-weight: bold;
    font-size: 1.2rem;
    position: absolute;
    right: 0;
    top: 0;
  }

  &.ordered {
    counter-increment: list-counter;

    &::before {
      content: counter(list-counter) ".";
      color: #3182ce !important;
      font-weight: 600;
      position: absolute;
      right: 0;
      top: 0;
      min-width: 1.5rem;
    }
  }

  @media (max-width: 768px) {
    font-size: 0.95rem !important;
    padding-right: 1.25rem !important;
  }
`;

const Bold = styled.strong`
  font-weight: 700 !important;
  color: #2d3748 !important;
`;

const Italic = styled.em`
  font-style: italic !important;
  color: #4a5568 !important;
`;

const Link = styled.a`
  color: #3182ce !important;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    border-bottom-color: #3182ce !important;
    color: #2c5aa0 !important;
  }

  &:focus {
    outline: 2px solid #3182ce;
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

const InlineCode = styled.code`
  background: #f7fafc !important;
  color: #e53e3e !important;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: "Monaco", "Consolas", "Courier New", monospace;
  font-size: 0.9em;
  border: 1px solid #e2e8f0;
`;

const CodeBlock = styled.pre`
  background: #1a202c !important;
  color: #e2e8f0 !important;
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5rem 0 !important;
  font-family: "Monaco", "Consolas", "Courier New", monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  border: 1px solid #2d3748;

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 0.85rem;
  }
`;

const Blockquote = styled.blockquote`
  margin: 1.5rem 0 !important;
  padding: 1rem 1.5rem;
  background: #f8f9fa !important;
  border-right: 4px solid #6c757d;
  color: #495057 !important;
  font-style: italic;
  border-radius: 0 4px 4px 0;

  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    margin: 1rem 0 !important;
  }
`;

// === INTERFACES ===
interface MarkdownRendererProps {
  content: string;
}

interface ParsedElement {
  type: string;
  content: string;
  level?: number;
  ordered?: boolean;
  items?: string[];
}

// === PARSER CLASS - מתוקן ===
class MarkdownParser {
  public parseInlineElements(text: string): React.ReactNode[] {
    if (!text || text.trim() === "") {
      return [text];
    }

    const elements: React.ReactNode[] = [];
    let currentIndex = 0;
    let elementKey = 0;

    // Improved regex patterns
    const patterns = [
      { regex: /\*\*((?:[^*]|\*(?!\*))+)\*\*/g, type: "bold" },
      { regex: /\*([^*]+)\*/g, type: "italic" },
      { regex: /`([^`]+)`/g, type: "code" },
      { regex: /\[([^\]]+)\]\(([^)]+)\)/g, type: "link" },
    ];

    const allMatches: Array<{
      match: RegExpMatchArray;
      type: string;
      start: number;
      end: number;
    }> = [];

    // Find all matches with better error handling
    patterns.forEach((pattern) => {
      const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
      let match;
      while ((match = regex.exec(text)) !== null) {
        if (match.index !== undefined) {
          allMatches.push({
            match,
            type: pattern.type,
            start: match.index,
            end: match.index + match[0].length,
          });
        }
        // Prevent infinite loop
        if (regex.lastIndex === match.index) {
          regex.lastIndex++;
        }
      }
    });

    // Sort matches by position
    allMatches.sort((a, b) => a.start - b.start);

    // Remove overlapping matches
    const validMatches = [];
    let lastEnd = 0;
    for (const match of allMatches) {
      if (match.start >= lastEnd) {
        validMatches.push(match);
        lastEnd = match.end;
      }
    }

    // Process matches
    validMatches.forEach(({ match, type, start, end }) => {
      // Add text before the match
      if (start > currentIndex) {
        const textBefore = text.substring(currentIndex, start);
        if (textBefore) {
          elements.push(textBefore);
        }
      }

      // Add the formatted element
      try {
        switch (type) {
          case "bold":
            elements.push(<Bold key={elementKey++}>{match[1]}</Bold>);
            break;
          case "italic":
            elements.push(<Italic key={elementKey++}>{match[1]}</Italic>);
            break;
          case "code":
            elements.push(
              <InlineCode key={elementKey++}>{match[1]}</InlineCode>
            );
            break;
          case "link":
            elements.push(
              <Link
                key={elementKey++}
                href={match[2]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {match[1]}
              </Link>
            );
            break;
        }
      } catch (error) {
        console.warn("Error processing inline element:", error);
        elements.push(match[0]); // Fallback to original text
      }

      currentIndex = end;
    });

    // Add remaining text
    if (currentIndex < text.length) {
      const remainingText = text.substring(currentIndex);
      if (remainingText) {
        elements.push(remainingText);
      }
    }

    return elements.length > 0 ? elements : [text];
  }

  public parse(markdown: string): ParsedElement[] {
    if (!markdown || typeof markdown !== "string") {
      return [];
    }

    const lines = markdown.split("\n");
    const elements: ParsedElement[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i].trim();

      if (!line) {
        i++;
        continue;
      }

      // Headers - improved regex
      const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headerMatch) {
        elements.push({
          type: "header",
          level: headerMatch[1].length,
          content: headerMatch[2],
        });
        i++;
        continue;
      }

      // Code blocks
      if (line.startsWith("```")) {
        const codeLines: string[] = [];
        i++; // Skip opening ```

        while (i < lines.length && !lines[i].trim().startsWith("```")) {
          codeLines.push(lines[i]);
          i++;
        }

        if (i < lines.length) i++; // Skip closing ```

        elements.push({
          type: "codeblock",
          content: codeLines.join("\n"),
        });
        continue;
      }

      // Blockquotes
      if (line.startsWith(">")) {
        elements.push({
          type: "blockquote",
          content: line.substring(1).trim(),
        });
        i++;
        continue;
      }

      // Lists - improved regex
      const unorderedMatch = line.match(/^[-*+]\s+(.+)$/);
      const orderedMatch = line.match(/^\d+\.\s+(.+)$/);

      if (unorderedMatch || orderedMatch) {
        const items: string[] = [];
        const isOrdered = !!orderedMatch;

        // Collect all consecutive list items
        while (i < lines.length) {
          const currentLine = lines[i].trim();
          const unorderedItemMatch = currentLine.match(/^[-*+]\s+(.+)$/);
          const orderedItemMatch = currentLine.match(/^\d+\.\s+(.+)$/);

          if (
            (isOrdered && orderedItemMatch) ||
            (!isOrdered && unorderedItemMatch)
          ) {
            items.push((orderedItemMatch || unorderedItemMatch)![1]);
            i++;
          } else if (!currentLine) {
            i++;
          } else {
            break;
          }
        }

        elements.push({
          type: "list",
          items,
          ordered: isOrdered,
          content: "",
        });
        continue;
      }

      // Regular paragraph
      elements.push({
        type: "paragraph",
        content: line,
      });
      i++;
    }

    return elements;
  }
}

// === MAIN COMPONENT ===
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content || typeof content !== "string") {
    console.warn("MarkdownRenderer: Invalid content received", content);
    return <div>No content to display</div>;
  }

  const parser = new MarkdownParser();
  const elements = parser.parse(content);

  const renderElement = (
    element: ParsedElement,
    index: number
  ): React.ReactNode => {
    try {
      switch (element.type) {
        case "header": {
          const HeaderComponent =
            element.level === 1
              ? H1
              : element.level === 2
              ? H2
              : element.level === 3
              ? H3
              : H4;
          return (
            <HeaderComponent key={index}>
              {parser.parseInlineElements(element.content)}
            </HeaderComponent>
          );
        }

        case "paragraph": {
          return (
            <Paragraph key={index}>
              {parser.parseInlineElements(element.content)}
            </Paragraph>
          );
        }

        case "list": {
          const ListComponent = element.ordered ? OrderedList : UnorderedList;
          const listClass = element.ordered ? "ordered" : "unordered";

          return (
            <ListComponent key={index}>
              {element.items?.map((item, itemIndex) => (
                <ListItem key={itemIndex} className={listClass}>
                  {parser.parseInlineElements(item)}
                </ListItem>
              ))}
            </ListComponent>
          );
        }

        case "codeblock": {
          return <CodeBlock key={index}>{element.content}</CodeBlock>;
        }

        case "blockquote": {
          return (
            <Blockquote key={index}>
              {parser.parseInlineElements(element.content)}
            </Blockquote>
          );
        }

        default:
          return (
            <Paragraph key={index}>
              {parser.parseInlineElements(element.content)}
            </Paragraph>
          );
      }
    } catch (error) {
      console.error("Error rendering element:", element, error);
      return <div key={index}>Error rendering content</div>;
    }
  };

  return (
    <MarkdownContainer>
      {elements.length > 0 ? (
        elements.map((element, index) => renderElement(element, index))
      ) : (
        <Paragraph>No content parsed</Paragraph>
      )}
    </MarkdownContainer>
  );
};

export default MarkdownRenderer;
