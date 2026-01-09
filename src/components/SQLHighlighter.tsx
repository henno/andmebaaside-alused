import React from "react";

interface SQLHighlighterProps {
  code: string;
  fontSize?: string;
}

// SQL keywords to highlight
const keywords = [
  "SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES", "UPDATE", "SET",
  "DELETE", "CREATE", "ALTER", "DROP", "TABLE", "INDEX", "VIEW", "TRIGGER",
  "PROCEDURE", "FUNCTION", "SEQUENCE", "DATABASE", "SCHEMA",
  "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "UNIQUE", "CHECK", "DEFAULT",
  "CONSTRAINT", "NOT", "NULL", "AND", "OR", "IN", "BETWEEN", "LIKE", "IS",
  "JOIN", "INNER", "LEFT", "RIGHT", "OUTER", "FULL", "CROSS", "ON", "AS",
  "ORDER", "BY", "GROUP", "HAVING", "LIMIT", "OFFSET", "ASC", "DESC",
  "UNION", "ALL", "DISTINCT", "EXISTS", "CASE", "WHEN", "THEN", "ELSE", "END",
  "BEGIN", "COMMIT", "ROLLBACK", "TRANSACTION", "SAVEPOINT",
  "GRANT", "REVOKE", "TO", "WITH", "CASCADE", "RESTRICT",
  "IF", "LOOP", "FOR", "WHILE", "RETURN", "DECLARE", "EXECUTE", "CALL",
  "AFTER", "BEFORE", "EACH", "ROW", "INSTEAD", "OF",
  "ADD", "COLUMN", "RENAME", "TRUNCATE",
  "USING", "LANGUAGE", "RETURNS", "VOLATILE", "STABLE", "IMMUTABLE",
  "EXPLAIN", "ANALYZE", "VACUUM", "REINDEX",
  "INTERVAL", "CURRENT_DATE", "CURRENT_TIME", "CURRENT_TIMESTAMP", "NOW",
  "TRUE", "FALSE", "PERIOD", "NO", "MAXVALUE", "MINVALUE", "CACHE", "CYCLE",
  "INCREMENT", "START", "OWNED", "NONE",
  "SERIAL", "BIGSERIAL", "SMALLSERIAL",
  "DO", "RAISE", "NOTICE", "EXCEPTION", "FOUND",
  "plpgsql", "sql",
  // MySQL specific
  "DELIMITER", "AUTO_INCREMENT", "ENGINE", "CHARSET", "COLLATE",
  "UNSIGNED", "ZEROFILL", "BINARY", "VARBINARY", "BLOB", "TINYBLOB", "MEDIUMBLOB", "LONGBLOB",
  "TINYINT", "MEDIUMINT", "BIGINT", "FLOAT", "DOUBLE",
  "DATETIME", "YEAR", "ENUM",
  "LAST_INSERT_ID", "IFNULL", "COALESCE",
];

// SQL data types
const dataTypes = [
  "INTEGER", "INT", "SMALLINT", "BIGINT", "DECIMAL", "NUMERIC", "REAL",
  "DOUBLE", "PRECISION", "FLOAT",
  "VARCHAR", "CHAR", "CHARACTER", "TEXT", "BYTEA",
  "BOOLEAN", "BOOL",
  "DATE", "TIME", "TIMESTAMP", "TIMESTAMPTZ", "TIMETZ",
  "JSON", "JSONB", "XML",
  "UUID", "MONEY", "INET", "CIDR", "MACADDR",
  "ARRAY", "RECORD", "VOID",
  "GEOMETRY", "GEOGRAPHY", "POINT", "LINE", "POLYGON",
];

// SQL functions
const functions = [
  "COUNT", "SUM", "AVG", "MIN", "MAX", "COALESCE", "NULLIF",
  "CONCAT", "SUBSTRING", "UPPER", "LOWER", "TRIM", "LENGTH",
  "ROUND", "FLOOR", "CEIL", "ABS", "MOD", "POWER", "SQRT",
  "DATE_PART", "DATE_TRUNC", "EXTRACT", "AGE",
  "CAST", "CONVERT", "TO_CHAR", "TO_DATE", "TO_NUMBER",
  "ROW_NUMBER", "RANK", "DENSE_RANK", "LAG", "LEAD",
  "FIRST_VALUE", "LAST_VALUE", "NTH_VALUE",
  "STRING_AGG", "ARRAY_AGG", "JSON_AGG",
  "nextval", "currval", "setval", "lastval",
  "ST_Contains", "ST_Distance", "ST_Within",
  // MySQL specific functions
  "DATE_ADD", "DATE_SUB", "DATEDIFF", "TIMESTAMPDIFF",
  "DATE_FORMAT", "STR_TO_DATE", "CURDATE", "CURTIME",
  "CONCAT_WS", "GROUP_CONCAT", "FIND_IN_SET",
  "IF", "IFNULL", "NULLIF", "ISNULL",
  "JSON_EXTRACT", "JSON_OBJECT", "JSON_ARRAY",
];

export default function SQLHighlighter({ code, fontSize = "0.8rem" }: SQLHighlighterProps) {
  const highlightSQL = (sql: string): React.ReactNode[] => {
    const result: React.ReactNode[] = [];
    let remaining = sql;
    let key = 0;

    while (remaining.length > 0) {
      let matched = false;

      // Check for single-line comments (--)
      if (remaining.startsWith("--")) {
        const endOfLine = remaining.indexOf("\n");
        const comment = endOfLine === -1 ? remaining : remaining.substring(0, endOfLine);
        result.push(
          <span key={key++} style={{ color: "#6a9955", fontStyle: "italic" }}>
            {comment}
          </span>
        );
        remaining = endOfLine === -1 ? "" : remaining.substring(endOfLine);
        matched = true;
        continue;
      }

      // Check for multi-line comments (/* */)
      if (remaining.startsWith("/*")) {
        const endComment = remaining.indexOf("*/");
        const comment = endComment === -1 ? remaining : remaining.substring(0, endComment + 2);
        result.push(
          <span key={key++} style={{ color: "#6a9955", fontStyle: "italic" }}>
            {comment}
          </span>
        );
        remaining = endComment === -1 ? "" : remaining.substring(endComment + 2);
        matched = true;
        continue;
      }

      // Check for strings (single quotes)
      if (remaining.startsWith("'")) {
        let endQuote = 1;
        while (endQuote < remaining.length) {
          if (remaining[endQuote] === "'" && remaining[endQuote + 1] !== "'") {
            break;
          }
          if (remaining[endQuote] === "'" && remaining[endQuote + 1] === "'") {
            endQuote++; // Skip escaped quote
          }
          endQuote++;
        }
        const str = remaining.substring(0, endQuote + 1);
        result.push(
          <span key={key++} style={{ color: "#ce9178" }}>
            {str}
          </span>
        );
        remaining = remaining.substring(endQuote + 1);
        matched = true;
        continue;
      }

      // Check for double-quoted identifiers
      if (remaining.startsWith('"')) {
        const endQuote = remaining.indexOf('"', 1);
        const str = endQuote === -1 ? remaining : remaining.substring(0, endQuote + 1);
        result.push(
          <span key={key++} style={{ color: "#ce9178" }}>
            {str}
          </span>
        );
        remaining = endQuote === -1 ? "" : remaining.substring(endQuote + 1);
        matched = true;
        continue;
      }

      // Check for numbers
      const numberMatch = remaining.match(/^(\d+\.?\d*)/);
      if (numberMatch && (result.length === 0 || /[\s,(\-+*/=<>]$/.test(String(result[result.length - 1])))) {
        result.push(
          <span key={key++} style={{ color: "#b5cea8" }}>
            {numberMatch[1]}
          </span>
        );
        remaining = remaining.substring(numberMatch[1].length);
        matched = true;
        continue;
      }

      // Check for keywords, data types, and functions
      const wordMatch = remaining.match(/^([a-zA-Z_][a-zA-Z0-9_]*)/);
      if (wordMatch) {
        const word = wordMatch[1];
        const upperWord = word.toUpperCase();

        if (keywords.includes(upperWord)) {
          result.push(
            <span key={key++} style={{ color: "#569cd6", fontWeight: 600 }}>
              {word}
            </span>
          );
          remaining = remaining.substring(word.length);
          matched = true;
          continue;
        }

        if (dataTypes.includes(upperWord)) {
          result.push(
            <span key={key++} style={{ color: "#4ec9b0" }}>
              {word}
            </span>
          );
          remaining = remaining.substring(word.length);
          matched = true;
          continue;
        }

        if (functions.includes(word) || functions.includes(upperWord)) {
          result.push(
            <span key={key++} style={{ color: "#dcdcaa" }}>
              {word}
            </span>
          );
          remaining = remaining.substring(word.length);
          matched = true;
          continue;
        }

        // Regular identifier
        result.push(
          <span key={key++} style={{ color: "#9cdcfe" }}>
            {word}
          </span>
        );
        remaining = remaining.substring(word.length);
        matched = true;
        continue;
      }

      // Check for operators and special characters
      const operatorMatch = remaining.match(/^(>=|<=|<>|!=|::|\|\||->|=>|[+\-*/<>=!@#$%^&|~])/);
      if (operatorMatch) {
        result.push(
          <span key={key++} style={{ color: "#d4d4d4" }}>
            {operatorMatch[1]}
          </span>
        );
        remaining = remaining.substring(operatorMatch[1].length);
        matched = true;
        continue;
      }

      // Default: take one character
      if (!matched) {
        result.push(
          <span key={key++} style={{ color: "#d4d4d4" }}>
            {remaining[0]}
          </span>
        );
        remaining = remaining.substring(1);
      }
    }

    return result;
  };

  return (
    <pre
      style={{
        margin: 0,
        fontSize,
        lineHeight: 1.6,
        overflow: "auto",
        whiteSpace: "pre-wrap",
        fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
      }}
    >
      {highlightSQL(code)}
    </pre>
  );
}
