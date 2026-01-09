import React, { useState } from "react";
import { motion } from "framer-motion";
import { colors } from "../styles";
import InfoButton from "../components/InfoButton";

const teacherGuide = `Selle slaidiga taoteldakse, et õpilased õpiksid tundma erinevaid andmetüüpe ja mõistaksid, millal millist tüüpi kasutada.

📌 Interaktiivsuse kasutamine:

• Klõpsa vasakul menüüs erinevatel kategooriatel (Numbrilised, Tekst, Kuupäev/Aeg, jne)
• Paremal kuvatakse tabel valitud kategooria andmetüüpidega
• Tabelis on näha tüübi nimi, suurus ja kasutusvaldkond

🎯 Soovitused esitlemiseks:

1. Numbrilised - alusta praktilise näitega:
   • INTEGER vs BIGINT: "Mitu kasutajat saab olla süsteemis?"
   • DECIMAL vs FLOAT: "Miks raha hoitakse DECIMAL-is?" (täpsus!)
   • SERIAL: automaatne ID genereerimine

2. Tekst - tüüpiline eksamiküsimus:
   • CHAR vs VARCHAR: fikseeritud vs muutuv (ruumi säästmine)
   • TEXT: kasuta kui pikkus pole teada (kommentaarid, kirjeldused)
   • UUID: hajussüsteemide jaoks unikaalne ID

3. Kuupäev/Aeg - väga praktiline:
   • DATETIME vs TIMESTAMP: DATETIME (1000-9999), TIMESTAMP (1970-2038)
   • TIMESTAMP muutub automaatselt UPDATE-l, DATETIME ei muutu
   • YEAR: kompaktne aasta hoiustamiseks

4. Struktuurne - kaasaegsed võimalused:
   • JSON/JSONB: paindlikud andmed ilma skeemita
   • ARRAY: mitu väärtust ühes veerus

💡 Praktiline harjutus: Küsi õpilastelt, milliseid andmetüüpe kasutaksid kasutaja profiili jaoks.`;

const dataTypeCategories = [
  {
    name: "Numbrilised",
    icon: "🔢",
    color: "#22c55e",
    hasSignedUnsigned: true,
    types: [
      { name: "SMALLINT", size: "2 baiti", signed: "-32,768 kuni 32,767", unsigned: "0 kuni 65,535" },
      { name: "INTEGER", size: "4 baiti", signed: "-2.1 kuni 2.1 miljardit", unsigned: "0 kuni 4.2 miljardit" },
      { name: "BIGINT", size: "8 baiti", signed: "±9 kvintiljonit", unsigned: "0 kuni 18 kvintiljonit" },
      { name: "DECIMAL(p,s)", size: "muutuv", signed: "Täpne kümnendmurd (raha!)", unsigned: "-" },
      { name: "FLOAT/REAL", size: "4-8 baiti", signed: "Ujukoma (ligikaudne)", unsigned: "-" },
      { name: "SERIAL", size: "4 baiti", signed: "1 kuni 2.1 miljardit", unsigned: "Automaatne ID" },
    ],
  },
  {
    name: "Tekst",
    icon: "📝",
    color: "#3b82f6",
    hasSignedUnsigned: false,
    types: [
      { name: "CHAR(n)", size: "n baiti", range: "Fikseeritud pikkusega tekst" },
      { name: "VARCHAR(n)", size: "≤n baiti", range: "Muutuva pikkusega tekst" },
      { name: "TEXT", size: "muutuv", range: "Piiramatu pikkusega tekst" },
      { name: "UUID", size: "16 baiti", range: "Universaalne unikaalne ID" },
    ],
  },
  {
    name: "Kuupäev/Aeg",
    icon: "📅",
    color: "#f59e0b",
    hasSignedUnsigned: false,
    types: [
      { name: "DATE", size: "3 baiti", range: "Ainult kuupäev (1000-9999)" },
      { name: "TIME", size: "3 baiti", range: "Ainult kellaaeg (838 tundi)" },
      { name: "DATETIME", size: "8 baiti", range: "Kuupäev + kellaaeg (1000-9999)" },
      { name: "TIMESTAMP", size: "4 baiti", range: "Unix aeg (1970-2038)" },
      { name: "YEAR", size: "1 bait", range: "Aasta (1901-2155)" },
    ],
  },
  {
    name: "Loogika/Binaarne",
    icon: "✓",
    color: "#ec4899",
    hasSignedUnsigned: false,
    types: [
      { name: "BOOLEAN", size: "1 bait", range: "TRUE/FALSE/NULL" },
      { name: "BYTEA", size: "muutuv", range: "Binaarsed andmed" },
      { name: "BIT(n)", size: "n bitti", range: "Fikseeritud bitijada" },
      { name: "BIT VARYING(n)", size: "≤n bitti", range: "Muutuv bitijada" },
    ],
  },
  {
    name: "Struktuurne",
    icon: "📦",
    color: "#8b5cf6",
    hasSignedUnsigned: false,
    types: [
      { name: "JSON", size: "muutuv", range: "JSON tekst" },
      { name: "JSONB", size: "muutuv", range: "Binaarne JSON (indekseeritav)" },
      { name: "ARRAY", size: "muutuv", range: "Massiivid" },
      { name: "HSTORE", size: "muutuv", range: "Võti-väärtus paarid" },
    ],
  },
  {
    name: "Geomeetria",
    icon: "📍",
    color: "#06b6d4",
    hasSignedUnsigned: false,
    types: [
      { name: "POINT", size: "16 baiti", range: "(x, y) koordinaat" },
      { name: "LINE", size: "32 baiti", range: "Lõpmatu sirge" },
      { name: "POLYGON", size: "muutuv", range: "Suletud hulknurk" },
      { name: "GEOMETRY", size: "muutuv", range: "PostGIS tüübid" },
    ],
  },
];

export default function DataTypes() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div style={{ width: "100%", maxWidth: "1200px" }}>
      <InfoButton content={teacherGuide} />
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: "2.8rem",
          fontWeight: 700,
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        Andmetüübid
      </motion.h2>

      <div style={{ display: "flex", gap: "40px" }}>
        {/* Category selector */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            minWidth: "180px",
          }}
        >
          {dataTypeCategories.map((cat, index) => (
            <motion.button
              key={cat.name}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveCategory(index)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "15px 18px",
                borderRadius: "12px",
                border: "none",
                background: activeCategory === index ? cat.color : colors.backgroundLight,
                cursor: "pointer",
                transition: "all 0.3s",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>{cat.icon}</span>
              <span
                style={{
                  color: colors.text,
                  fontWeight: activeCategory === index ? 600 : 400,
                  fontSize: "0.95rem",
                }}
              >
                {cat.name}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Types table */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ flex: 1 }}
        >
          <div
            style={{
              borderRadius: "20px",
              overflow: "hidden",
              border: `2px solid ${dataTypeCategories[activeCategory].color}40`,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: dataTypeCategories[activeCategory].hasSignedUnsigned
                  ? "1.2fr 0.8fr 1.5fr 1.5fr"
                  : "1fr 1fr 2fr",
                background: dataTypeCategories[activeCategory].color,
                padding: "15px 20px",
                fontWeight: 600,
                fontSize: "0.9rem",
              }}
            >
              <span>Tüüp</span>
              <span>Suurus</span>
              {dataTypeCategories[activeCategory].hasSignedUnsigned ? (
                <>
                  <span style={{ textAlign: "center" }}>SIGNED</span>
                  <span style={{ textAlign: "center" }}>UNSIGNED</span>
                </>
              ) : (
                <span>Kirjeldus</span>
              )}
            </div>

            {/* Rows */}
            {dataTypeCategories[activeCategory].types.map((type: any, index: number) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: dataTypeCategories[activeCategory].hasSignedUnsigned
                    ? "1.2fr 0.8fr 1.5fr 1.5fr"
                    : "1fr 1fr 2fr",
                  padding: "14px 20px",
                  background: index % 2 === 0 ? colors.backgroundLight : colors.background,
                  borderTop: `1px solid ${colors.surface}`,
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Fira Code', monospace",
                    color: dataTypeCategories[activeCategory].color,
                    fontWeight: 600,
                    fontSize: "0.85rem",
                  }}
                >
                  {type.name}
                </span>
                <span style={{ color: colors.textMuted, fontSize: "0.85rem" }}>{type.size}</span>
                {dataTypeCategories[activeCategory].hasSignedUnsigned ? (
                  <>
                    <span style={{ fontSize: "0.8rem", textAlign: "center", color: type.signed === "-" ? colors.textMuted : colors.text }}>
                      {type.signed}
                    </span>
                    <span style={{ fontSize: "0.8rem", textAlign: "center", color: type.unsigned === "-" ? colors.textMuted : "#22c55e" }}>
                      {type.unsigned}
                    </span>
                  </>
                ) : (
                  <span style={{ fontSize: "0.85rem" }}>{type.range}</span>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
