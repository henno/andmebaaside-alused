import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "../styles";
import InfoButton from "../components/InfoButton";
import SQLHighlighter from "../components/SQLHighlighter";

const teacherGuide = `Selle slaidiga taoteldakse, et õpilased mõistaksid andmebaasi normaliseerimist ja oskaksid rakendada normaalvorme.

📌 Interaktiivsuse kasutamine:

• Klõpsa vasakul igal normaalvormil (1NF, 2NF, 3NF, BCNF)
• Paremal kuvatakse selgitus, näide ja probleemid
• Kaardid näitavad enne/pärast normaliseerimist

🎯 Soovitused esitlemiseks:

1. Alusta küsimusega: "Miks ei tohi kõiki andmeid ühte tabelisse panna?"
   • Andmete dubleerimine
   • Anomaaliad (INSERT, UPDATE, DELETE)

2. Normaliseerimise eesmärk:
   • Vähendada andmete kordumist
   • Tagada andmete terviklus
   • Lihtsustada hooldust

3. KÄSITLE IGA NORMAALVORMI ERALDI:

   1NF - Aatomilised väärtused:
   • Iga lahtris üks väärtus
   • Pole korduvaid veerge
   • "Oskused: SQL, Python, Excel" → eraldi oskuste tabel

   2NF - Täielik sõltuvus primaarvõtmest:
   • Ei ole osalist sõltuvust
   • Komposiit-primaarvõtme puhul oluline
   • Näide: (tellimus_id, toode_id) → toode_nimi sõltub ainult toode_id-st

   3NF - Pole transitiivseid sõltuvusi:
   • Mitte-võtme veerg ei sõltu teisest mitte-võtme veerust
   • Näide: linn → maakond (eraldada aadressitabeliks)

   BCNF - Boyce-Codd normaalvorm:
   • Iga determinant on kandidaatvõti
   • Rangem kui 3NF

4. PRAKTILINE NÄIDE:
   • Küsi õpilastelt, kuidas normaliseerida e-poe tellimuste tabelit

💡 VIHJE: Eksamil küsitakse sageli "Milline normaalvorm?" küsimusi!`;

const normalForms = [
  {
    name: "1NF",
    fullName: "Esimene normaalvorm",
    color: "#22c55e",
    icon: "1️⃣",
    description: "Ühes lahtris tohib olla ainult ÜKS väärtus. Kui sul on lahtris mitu asja komadega eraldatult (nt \"SQL, Python, Excel\"), siis see rikub 1NF-i. Lahendus: tee eraldi tabel, kus iga väärtus on omaette real.",
    rules: [
      "Iga lahtris ainult üks väärtus",
      "Kõik veerud on unikaalsed",
      "Rea järjekord pole oluline",
      "Pole korduvaid rühmi",
    ],
    badExample: {
      title: "Rikkumine",
      table: [
        ["ID", "Nimi", "Oskused"],
        ["1", "Mari", "SQL, Python, Excel"],
        ["2", "Jaan", "Java"],
      ],
      problem: "Mitme oskuse hoidmine ühes lahtris rikub 1NF-i",
    },
    goodExample: {
      title: "1NF",
      tables: [
        {
          name: "töötajad",
          rows: [
            ["ID", "Nimi"],
            ["1", "Mari"],
            ["2", "Jaan"],
          ],
        },
        {
          name: "oskused",
          rows: [
            ["ID", "Oskus"],
            ["1", "SQL"],
            ["2", "Python"],
            ["3", "Excel"],
            ["4", "Java"],
          ],
        },
        {
          name: "töötaja_oskused",
          rows: [
            ["Töötaja_ID", "Oskus_ID"],
            ["1", "1"],
            ["1", "2"],
            ["1", "3"],
            ["2", "4"],
          ],
        },
      ],
      query: `SELECT
  töötajad.ID,
  töötajad.Nimi,
  GROUP_CONCAT(oskused.Oskus) AS Oskused
FROM töötajad
JOIN töötaja_oskused
  ON töötajad.ID = töötaja_oskused.Töötaja_ID
JOIN oskused
  ON töötaja_oskused.Oskus_ID = oskused.ID
GROUP BY töötajad.ID, töötajad.Nimi;`,
    },
  },
  {
    name: "2NF",
    fullName: "Teine normaalvorm",
    color: "#3b82f6",
    icon: "2️⃣",
    description: "Kui tabelis on liitprimaarvõti (nt Tellimus_ID + Toode_ID koos), siis iga tavaline veerg peab sõltuma MÕLEMAST võtmeosast. Kui Toode_nimi sõltub ainult Toode_ID-st, siis vii see eraldi tabelisse. Lihtsamalt: ära hoia infot, mis kordub, samas tabelis.",
    rules: [
      "Vastab 1NF nõuetele",
      "Pole osalist sõltuvust",
      "Oluline komposiit-võtme korral",
      "Iga atribuut sõltub kogu võtmest",
    ],
    badExample: {
      title: "Rikkumine",
      table: [
        ["Tellimus_ID", "Toode_ID", "Toode_nimi", "Kogus"],
        ["101", "P1", "Arvuti", "2"],
        ["101", "P2", "Hiir", "3"],
        ["102", "P1", "Arvuti", "1"],
      ],
      problem: "Toode_nimi sõltub ainult Toode_ID-st, mitte kogu võtmest (Tellimus_ID, Toode_ID)",
    },
    goodExample: {
      title: "2NF",
      tables: [
        {
          name: "tellimuse_read",
          rows: [
            ["Tellimus_ID", "Toode_ID", "Kogus"],
            ["101", "P1", "2"],
            ["101", "P2", "3"],
            ["102", "P1", "1"],
          ],
        },
        {
          name: "tooted",
          rows: [
            ["Toode_ID", "Toode_nimi"],
            ["P1", "Arvuti"],
            ["P2", "Hiir"],
          ],
        },
      ],
      query: `SELECT
  tellimuse_read.Tellimus_ID,
  tooted.Toode_ID,
  tooted.Toode_nimi,
  tellimuse_read.Kogus
FROM tellimuse_read
JOIN tooted
  ON tellimuse_read.Toode_ID = tooted.Toode_ID;`,
    },
  },
  {
    name: "3NF",
    fullName: "Kolmas normaalvorm",
    color: "#f59e0b",
    icon: "3️⃣",
    description: "Tavaline veerg ei tohi sõltuda teisest tavalisest veerust. Näiteks: kui Linn määrab Maakonna, siis Maakond sõltub Linnast, mitte primaarvõtmest. Lahendus: vii Linn ja Maakond eraldi tabelisse. Lihtsamalt: kui saad ühe veeru väärtuse tuletada teisest (mitte-võtme) veerust, eralda see.",
    rules: [
      "Vastab 2NF nõuetele",
      "Pole transitiivseid sõltuvusi",
      "Mitte-võti → Mitte-võti keelatud",
      "Iga veerg sõltub võtmest otse",
    ],
    badExample: {
      title: "Rikkumine",
      table: [
        ["ID", "Nimi", "Linn", "Maakond"],
        ["1", "Mari", "Tartu", "Tartumaa"],
        ["2", "Jaan", "Pärnu", "Pärnumaa"],
        ["3", "Kati", "Tartu", "Tartumaa"],
      ],
      problem: "Maakond sõltub Linnast, mitte ID-st (transitiivne: ID → Linn → Maakond)",
    },
    goodExample: {
      title: "3NF",
      tables: [
        {
          name: "kasutajad",
          rows: [
            ["ID", "Nimi", "Linn"],
            ["1", "Mari", "Tartu"],
            ["2", "Jaan", "Pärnu"],
            ["3", "Kati", "Tartu"],
          ],
        },
        {
          name: "linnad",
          rows: [
            ["Linn", "Maakond"],
            ["Tartu", "Tartumaa"],
            ["Pärnu", "Pärnumaa"],
          ],
        },
      ],
      query: `SELECT
  kasutajad.ID,
  kasutajad.Nimi,
  kasutajad.Linn,
  linnad.Maakond
FROM kasutajad
JOIN linnad
  ON kasutajad.Linn = linnad.Linn;`,
    },
  },
  {
    name: "BCNF",
    fullName: "Boyce-Codd normaalvorm",
    color: "#ec4899",
    icon: "🅱️",
    description: "Rangem versioon 3NF-ist. Kui mingi veerg määrab teise veeru väärtuse, siis see määraja PEAB olema võti. Näites: Õppejõud määrab Aine (Dr. Tamm õpetab alati SQL-i), aga Õppejõud pole võti. Lahendus: eralda see seos eraldi tabelisse. Praktikas piisab enamasti 3NF-ist.",
    rules: [
      "Vastab 3NF nõuetele",
      "Iga determinant on kandidaatvõti",
      "Lahendab mitmese kandidaatvõtme probleemid",
      "Praktikas 3NF on enamasti piisav",
    ],
    badExample: {
      title: "3NF, aga mitte BCNF",
      table: [
        ["Üliõpilane", "Aine", "Õppejõud"],
        ["Mari", "SQL", "Dr. Tamm"],
        ["Jaan", "SQL", "Dr. Tamm"],
        ["Mari", "Python", "Dr. Mets"],
      ],
      problem: "Õppejõud → Aine (Dr. Tamm õpetab alati SQL-i), aga Õppejõud pole kandidaatvõti",
    },
    goodExample: {
      title: "BCNF",
      tables: [
        {
          name: "registreeringud",
          rows: [
            ["Üliõpilane", "Õppejõud"],
            ["Mari", "Dr. Tamm"],
            ["Jaan", "Dr. Tamm"],
            ["Mari", "Dr. Mets"],
          ],
        },
        {
          name: "õppejõud_ained",
          rows: [
            ["Õppejõud", "Aine"],
            ["Dr. Tamm", "SQL"],
            ["Dr. Mets", "Python"],
          ],
        },
      ],
      query: `SELECT
  registreeringud.Üliõpilane,
  õppejõud_ained.Aine,
  registreeringud.Õppejõud
FROM registreeringud
JOIN õppejõud_ained
  ON registreeringud.Õppejõud = õppejõud_ained.Õppejõud;`,
    },
  },
];

const TableDisplay = ({ rows, highlight = false }: { rows: string[][]; highlight?: boolean }) => (
  <div style={{
    borderRadius: "8px",
    overflow: "hidden",
    border: `1px solid ${highlight ? "#ef4444" : colors.surface}`,
  }}>
    {rows.map((row, i) => (
      <div
        key={i}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${row.length}, 1fr)`,
          background: i === 0 ? (highlight ? "#ef444430" : colors.surface) : (i % 2 === 0 ? colors.backgroundLight : colors.background),
          borderTop: i > 0 ? `1px solid ${colors.surface}` : "none",
        }}
      >
        {row.map((cell, j) => (
          <div
            key={j}
            style={{
              padding: "8px 12px",
              fontSize: "0.8rem",
              fontWeight: i === 0 ? 600 : 400,
              fontFamily: i === 0 ? "inherit" : "'Fira Code', monospace",
              borderRight: j < row.length - 1 ? `1px solid ${colors.surface}` : "none",
            }}
          >
            {cell}
          </div>
        ))}
      </div>
    ))}
  </div>
);

export default function Normalization() {
  const [activeNF, setActiveNF] = useState(0);

  return (
    <div style={{ width: "100%", maxWidth: "1200px" }}>
      <InfoButton content={teacherGuide} />
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: "2.8rem",
          fontWeight: 700,
          marginBottom: "15px",
          textAlign: "center",
        }}
      >
        Normaliseerimine
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          textAlign: "center",
          color: colors.textMuted,
          marginBottom: "35px",
          fontSize: "1.1rem",
        }}
      >
        Andmebaasi struktuuri optimeerimine anomaaliate vältimiseks
      </motion.p>

      <div style={{ display: "flex", gap: "30px" }}>
        {/* Normal form selector */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            minWidth: "200px",
          }}
        >
          {normalForms.map((nf, index) => (
            <motion.button
              key={nf.name}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveNF(index)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "15px 18px",
                borderRadius: "12px",
                border: "none",
                background: activeNF === index ? nf.color : colors.backgroundLight,
                cursor: "pointer",
                transition: "all 0.3s",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "1.5rem" }}>{nf.icon}</span>
              <div>
                <div style={{
                  color: colors.text,
                  fontWeight: activeNF === index ? 700 : 500,
                  fontSize: "1.1rem",
                }}>
                  {nf.name}
                </div>
                <div style={{
                  color: activeNF === index ? "rgba(255,255,255,0.8)" : colors.textMuted,
                  fontSize: "0.75rem",
                }}>
                  {nf.fullName}
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Normal form content */}
        <div style={{ flex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNF}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Description and rules */}
              <div style={{
                padding: "20px",
                borderRadius: "16px",
                background: colors.backgroundLight,
                border: `2px solid ${normalForms[activeNF].color}40`,
                marginBottom: "20px",
              }}>
                <h3 style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: normalForms[activeNF].color,
                  marginBottom: "10px",
                }}>
                  {normalForms[activeNF].fullName} ({normalForms[activeNF].name})
                </h3>
                <p style={{ color: colors.text, fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "15px" }}>
                  {normalForms[activeNF].description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {normalForms[activeNF].rules.map((rule, i) => (
                    <span
                      key={i}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        background: `${normalForms[activeNF].color}20`,
                        fontSize: "0.8rem",
                        fontWeight: 500,
                      }}
                    >
                      {rule}
                    </span>
                  ))}
                </div>
              </div>

              {/* Before/After examples */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {/* Bad example */}
                <div style={{
                  padding: "15px",
                  borderRadius: "12px",
                  background: "#ef444410",
                  border: "1px solid #ef444440",
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                  }}>
                    <span style={{ fontSize: "1.2rem" }}>❌</span>
                    <span style={{ fontWeight: 600, color: "#ef4444" }}>
                      {normalForms[activeNF].badExample.title}
                    </span>
                  </div>
                  <TableDisplay rows={normalForms[activeNF].badExample.table} highlight />
                  <p style={{
                    marginTop: "10px",
                    fontSize: "0.8rem",
                    color: "#ef4444",
                    fontStyle: "italic",
                  }}>
                    {normalForms[activeNF].badExample.problem}
                  </p>
                </div>

                {/* Good example */}
                <div style={{
                  padding: "15px",
                  borderRadius: "12px",
                  background: `${normalForms[activeNF].color}10`,
                  border: `1px solid ${normalForms[activeNF].color}40`,
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                  }}>
                    <span style={{ fontSize: "1.2rem" }}>✅</span>
                    <span style={{ fontWeight: 600, color: normalForms[activeNF].color }}>
                      {normalForms[activeNF].goodExample.title}
                    </span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {normalForms[activeNF].goodExample.tables.map((t, i) => (
                      <div key={i}>
                        <div style={{
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: colors.textMuted,
                          marginBottom: "5px",
                          fontFamily: "'Fira Code', monospace",
                        }}>
                          {t.name}
                        </div>
                        <TableDisplay rows={t.rows} />
                      </div>
                    ))}
                  </div>
                  {(normalForms[activeNF].goodExample as { query?: string }).query && (
                    <div style={{ marginTop: "12px" }}>
                      <div style={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: colors.textMuted,
                        marginBottom: "5px",
                      }}>
                        Päring algandmete saamiseks:
                      </div>
                      <SQLHighlighter
                        code={(normalForms[activeNF].goodExample as { query?: string }).query!}
                        fontSize="0.7rem"
                      />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
