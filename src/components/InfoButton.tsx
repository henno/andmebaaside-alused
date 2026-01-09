import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "../styles";
import SQLHighlighter from "./SQLHighlighter";

interface InfoButtonProps {
  content: string;
}

// SQL keywords that indicate the start of SQL code
const SQL_KEYWORDS = [
  'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP',
  'WITH', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER',
  'GROUP', 'ORDER', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'EXCEPT',
  'GRANT', 'REVOKE', 'BEGIN', 'COMMIT', 'ROLLBACK', 'SET', 'CALL',
  'DELIMITER', 'EXPLAIN', 'SHOW', 'DESCRIBE', 'USE', 'INDEX',
  'PARTITION', 'TRUNCATE', 'REPLACE', 'MERGE', 'FETCH', 'DECLARE',
  'IF', 'WHILE', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'RETURN',
  '--', '//'
];

// Keywords to highlight inline within text - only clearly SQL-specific phrases
// Avoid single words that appear in normal text (AND, OR, IN, NOT, etc.)
const INLINE_SQL_KEYWORDS = [
  // DDL statements (multi-word, clearly SQL)
  'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
  'CREATE INDEX', 'DROP INDEX', 'CREATE VIEW', 'DROP VIEW',
  'CREATE TRIGGER', 'DROP TRIGGER', 'CREATE PROCEDURE',
  // Constraints (multi-word)
  'PRIMARY KEY', 'FOREIGN KEY', 'NOT NULL', 'UNIQUE KEY',
  'AUTO_INCREMENT', 'ON DELETE CASCADE', 'ON UPDATE CASCADE',
  'ON DELETE', 'ON UPDATE', 'FOR EACH ROW',
  // Data types (specific enough)
  'VARCHAR', 'BIGINT', 'SMALLINT', 'TIMESTAMP', 'DATETIME',
  // Clauses (multi-word)
  'GROUP BY', 'ORDER BY', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN',
  'OUTER JOIN', 'CROSS JOIN', 'FULL JOIN',
  'IS NULL', 'IS NOT NULL',
  // Functions with parentheses pattern
  'ROW_NUMBER()', 'RANK()', 'DENSE_RANK()', 'COUNT(*)',
  // Specific SQL terms
  'ACID', 'ROLLBACK', 'COMMIT', 'TRANSACTION',
];

// Highlight inline SQL keywords in text
function highlightInlineKeywords(text: string): React.ReactNode[] {
  // Sort keywords by length (longest first) to match longer phrases first
  const sortedKeywords = [...INLINE_SQL_KEYWORDS].sort((a, b) => b.length - a.length);

  // Create a regex pattern that matches any of the keywords (case-insensitive)
  const pattern = new RegExp(
    `(${sortedKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`,
    'gi'
  );

  const parts = text.split(pattern);

  return parts.map((part, index) => {
    // Check if this part matches any keyword
    const isKeyword = sortedKeywords.some(
      k => k.toLowerCase() === part.toLowerCase()
    );

    if (isKeyword && part.trim()) {
      return (
        <code
          key={index}
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.2) 100%)',
            color: '#93c5fd',
            padding: '3px 8px',
            margin: '0 2px',
            borderRadius: '6px',
            fontFamily: "'Fira Code', 'Consolas', monospace",
            fontSize: '0.85em',
            fontWeight: 500,
            border: '1px solid rgba(59, 130, 246, 0.3)',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          }}
        >
          {part}
        </code>
      );
    }
    return part;
  });
}

function parseContentWithSQL(content: string): Array<{ type: 'text' | 'sql', content: string }> {
  const lines = content.split('\n');
  const result: Array<{ type: 'text' | 'sql', content: string }> = [];
  let currentBlock: { type: 'text' | 'sql', lines: string[] } = { type: 'text', lines: [] };

  for (const line of lines) {
    const trimmedLine = line.trim();
    const upperLine = trimmedLine.toUpperCase();

    // Check if line looks like SQL
    const isSQLLine = SQL_KEYWORDS.some(keyword =>
      upperLine.startsWith(keyword + ' ') ||
      upperLine.startsWith(keyword + '(') ||
      upperLine === keyword ||
      upperLine.startsWith('-- ') ||
      (trimmedLine.startsWith('(') && trimmedLine.includes(',')) ||
      (trimmedLine.startsWith(')') && (trimmedLine.endsWith(';') || trimmedLine.endsWith(','))) ||
      upperLine.startsWith('VALUES') ||
      upperLine.startsWith('ON ') ||
      upperLine.startsWith('AND ') ||
      upperLine.startsWith('OR ') ||
      upperLine.startsWith('PRIMARY') ||
      upperLine.startsWith('FOREIGN') ||
      upperLine.startsWith('UNIQUE') ||
      upperLine.startsWith('NOT NULL') ||
      upperLine.startsWith('DEFAULT') ||
      upperLine.startsWith('AUTO_INCREMENT') ||
      upperLine.startsWith('CHECK') ||
      upperLine.startsWith('REFERENCES') ||
      /^\s*\w+\s+(INT|VARCHAR|TEXT|DECIMAL|BOOLEAN|DATE|TIME|TIMESTAMP|BIGINT|SMALLINT|FLOAT|DOUBLE|CHAR|BLOB|JSON|SERIAL)/i.test(line)
    );

    // Check if we're continuing a SQL block (indented lines after SQL start)
    const isContinuation = currentBlock.type === 'sql' &&
      (line.startsWith('  ') || line.startsWith('\t') || trimmedLine === '' ||
       trimmedLine.endsWith(',') || trimmedLine.endsWith(';') ||
       trimmedLine.startsWith(')') || trimmedLine.startsWith('('));

    if (isSQLLine || (isContinuation && trimmedLine !== '')) {
      if (currentBlock.type !== 'sql' && currentBlock.lines.length > 0) {
        result.push({ type: 'text', content: currentBlock.lines.join('\n') });
        currentBlock = { type: 'sql', lines: [] };
      }
      currentBlock.type = 'sql';
      currentBlock.lines.push(line);
    } else {
      if (currentBlock.type !== 'text' && currentBlock.lines.length > 0) {
        result.push({ type: 'sql', content: currentBlock.lines.join('\n') });
        currentBlock = { type: 'text', lines: [] };
      }
      currentBlock.type = 'text';
      currentBlock.lines.push(line);
    }
  }

  // Don't forget the last block
  if (currentBlock.lines.length > 0) {
    result.push({ type: currentBlock.type, content: currentBlock.lines.join('\n') });
  }

  return result;
}

export default function InfoButton({ content }: InfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const parsedContent = useMemo(() => parseContentWithSQL(content), [content]);

  return (
    <>
      {/* Info Button */}
      <motion.button
        data-testid="info-button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          top: "30px",
          right: "40px",
          width: "45px",
          height: "45px",
          borderRadius: "50%",
          border: "none",
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          color: "white",
          fontSize: "1.4rem",
          fontWeight: 700,
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 20px rgba(59, 130, 246, 0.5)",
          zIndex: 1000,
        }}
      >
        i
      </motion.button>

      {/* Side Panel - Non-modal, stays open while interacting with slides */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Side Panel */}
            <motion.div
              data-testid="info-modal"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: "450px",
                maxWidth: "90vw",
                height: "100vh",
                background: colors.backgroundLight,
                zIndex: 1002,
                boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.4)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: "25px 30px",
                  borderBottom: `1px solid ${colors.surface}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: colors.background,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      fontStyle: "italic",
                      fontFamily: "Georgia, serif",
                      color: "white",
                    }}
                  >
                    i
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "2px" }}>
                      Õpetaja juhend
                    </h3>
                    <span style={{ fontSize: "0.8rem", color: colors.textMuted }}>
                      Kuidas seda slaidi presenteerida
                    </span>
                  </div>
                </div>

                {/* Close button */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsOpen(false)}
                  data-testid="info-modal-close"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    border: "none",
                    background: colors.surface,
                    color: colors.text,
                    fontSize: "1.3rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  ×
                </motion.button>
              </div>

              {/* Content */}
              <div
                style={{
                  flex: 1,
                  padding: "30px",
                  overflow: "auto",
                }}
              >
                <div
                  style={{
                    fontSize: "1rem",
                    lineHeight: 1.9,
                    color: colors.text,
                    textAlign: "left",
                  }}
                >
                  {parsedContent.map((block, index) => (
                    block.type === 'sql' ? (
                      <div key={index} style={{ margin: "12px 0" }}>
                        <SQLHighlighter code={block.content} />
                      </div>
                    ) : (
                      <div key={index} style={{ whiteSpace: "pre-line" }}>
                        {highlightInlineKeywords(block.content)}
                      </div>
                    )
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  padding: "20px 30px",
                  borderTop: `1px solid ${colors.surface}`,
                  background: colors.background,
                }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsOpen(false)}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "none",
                    background: colors.primary,
                    color: "white",
                    fontSize: "1rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Sulge paneel
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
