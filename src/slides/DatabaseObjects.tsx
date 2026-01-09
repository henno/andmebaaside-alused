import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "../styles";
import InfoButton from "../components/InfoButton";
import SQLHighlighter from "../components/SQLHighlighter";

const teacherGuide = `Selle slaidiga taoteldakse, et õpilased tutvuksid peamiste andmebaasiobjektidega ja mõistaksid nende otstarvet.

📌 Interaktiivsuse kasutamine:

• Klõpsa ülemises menüüs erinevatel objektitüüpidel (Tabel, Vaade, Indeks, jne)
• Vasakul kuvatakse objekti kirjeldus ja omadused
• Paremal kuvatakse SQL näidiskood koos süntaksi esiletõstmisega

🎯 Soovitused esitlemiseks:

1. Tabel - alusta siit, see on kõige fundamentaalsem:
   • Näita CREATE TABLE süntaksit
   • Selgita PRIMARY KEY, NOT NULL, UNIQUE piiranguid
   • Küsi: "Miks on primaarvõti vajalik?"

2. Vaade - kasuta turvanäidet:
   • Vaade võimaldab peita tundlikke veerge
   • Lihtsustab keerukaid päringuid

3. Indeks - see on jõudluse võti:
   • Ilma indeksita peab andmebaas läbi vaatama KÕIK read
   • Indeksiga leiab õige rea koheselt
   • Kompromiss: kiirem lugemine, aeglasem kirjutamine

4. Triiger - automaatika näide:
   • Logimine ilma koodi muutmata
   • Andmete valideerimine andmebaasi tasandil

5. Protseduur ja Järjend - mainida lühidalt

💡 Praktiline ülesanne: Las õpilased mõtlevad välja, millised objektid oleksid vajalikud e-poe andmebaasis.`;

const dbObjects = [
  {
    name: "Tabel",
    icon: "📊",
    color: "#22c55e",
    description: "Põhiline andmete salvestamise struktuur ridade ja veergudega",
    createExample: `CREATE TABLE kasutajad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nimi VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  loodud TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
    useExample: `-- Andmete lisamine
INSERT INTO kasutajad (nimi, email)
VALUES ('Mari Mets', 'mari@email.ee');

-- Andmete pärimine
SELECT * FROM kasutajad WHERE id = 1;

-- Andmete uuendamine
UPDATE kasutajad SET nimi = 'Mari Tamm'
WHERE id = 1;`,
    properties: ["Veerud (atribuudid)", "Read (kirjed)", "Primaarvõti", "Piirangud"],
  },
  {
    name: "Vaade",
    icon: "👁️",
    color: "#3b82f6",
    description: "Virtuaalne tabel, mis põhineb päringul",
    createExample: `CREATE VIEW aktiivsed_kasutajad AS
SELECT nimi, email, loodud
FROM kasutajad
WHERE viimane_sisselogimine >
      DATE_SUB(NOW(), INTERVAL 30 DAY);`,
    useExample: `-- Kasutamine nagu tavalist tabelit
SELECT * FROM aktiivsed_kasutajad;

-- Filtreerimine
SELECT nimi FROM aktiivsed_kasutajad
WHERE email LIKE '%@gmail.com';

-- JOIN teise tabeliga
SELECT v.nimi, t.tellimus_nr
FROM aktiivsed_kasutajad v
JOIN tellimused t ON v.id = t.kasutaja_id;`,
    properties: ["Lihtsustab päringuid", "Turvalisus", "Abstraktsioon", "Ei salvesta andmeid"],
  },
  {
    name: "Indeks",
    icon: "📑",
    color: "#f59e0b",
    description: "Struktur, mis kiirendab andmete otsimist",
    createExample: `CREATE INDEX idx_kasutaja_email
ON kasutajad(email);

CREATE INDEX idx_nimi_email
ON kasutajad(nimi, email);`,
    useExample: `-- Indeks kasutatakse automaatselt!
-- See päring kasutab idx_kasutaja_email:
SELECT * FROM kasutajad
WHERE email = 'mari@email.ee';

-- Päringu plaani vaatamine (EXPLAIN)
EXPLAIN SELECT * FROM kasutajad
WHERE email = 'mari@email.ee';`,
    properties: ["B-Tree, Hash, FULLTEXT", "Kiirendab SELECT", "Aeglustab INSERT", "Võtab ruumi"],
  },
  {
    name: "Triiger",
    icon: "⚡",
    color: "#ec4899",
    description: "Automaatne protseduur, mis käivitub sündmuse korral",
    createExample: `DELIMITER //
CREATE TRIGGER audit_muudatus
AFTER UPDATE ON kasutajad
FOR EACH ROW
BEGIN
  INSERT INTO audit_log (tabel, muudetud)
  VALUES ('kasutajad', NOW());
END //
DELIMITER ;`,
    useExample: `-- Triiger käivitub AUTOMAATSELT!
-- Kui keegi teeb UPDATE:
UPDATE kasutajad SET nimi = 'Uus Nimi'
WHERE id = 1;
-- Triiger audit_muudatus käivitub

-- Auditilogist vaatamine
SELECT * FROM audit_log
WHERE tabel = 'kasutajad'
ORDER BY muudetud DESC;`,
    properties: ["BEFORE/AFTER", "INSERT/UPDATE/DELETE", "Automaatne", "Audit ja valideerimine"],
  },
  {
    name: "Protseduur",
    icon: "⚙️",
    color: "#06b6d4",
    description: "Salvestatud koodiplokk, mida saab välja kutsuda",
    createExample: `DELIMITER //
CREATE PROCEDURE lisa_kasutaja(
  IN p_nimi VARCHAR(100),
  IN p_email VARCHAR(255)
)
BEGIN
  INSERT INTO kasutajad(nimi, email)
  VALUES (p_nimi, p_email);
END //
DELIMITER ;`,
    useExample: `-- Protseduuri väljakutsumine
CALL lisa_kasutaja('Jaan Tamm',
                   'jaan@email.ee');

-- Mitme kasutaja lisamine tsükliga
DELIMITER //
CREATE PROCEDURE lisa_test_kasutajad()
BEGIN
  DECLARE i INT DEFAULT 1;
  WHILE i <= 10 DO
    CALL lisa_kasutaja(
      CONCAT('Test ', i),
      CONCAT('test', i, '@email.ee')
    );
    SET i = i + 1;
  END WHILE;
END //
DELIMITER ;`,
    properties: ["Korduvkasutatav", "Parameetrid", "Äriloogika", "Transaktsioonid"],
  },
  {
    name: "Auto-ID",
    icon: "🔢",
    color: "#8b5cf6",
    description: "Automaatne unikaalsete numbrite generaator tabelis",
    createExample: `-- MySQL kasutab AUTO_INCREMENT
-- Pole vaja eraldi järjendit luua!
CREATE TABLE tellimused (
  nr INT AUTO_INCREMENT PRIMARY KEY,
  toode VARCHAR(100),
  loodud TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) AUTO_INCREMENT = 1000;`,
    useExample: `-- Lisamisel jäetakse nr väli vahele
INSERT INTO tellimused (toode)
VALUES ('Toode A');
-- nr saab automaatselt väärtuse 1000

INSERT INTO tellimused (toode)
VALUES ('Toode B');
-- nr saab automaatselt väärtuse 1001

-- Viimase ID vaatamine
SELECT LAST_INSERT_ID();`,
    properties: ["AUTO_INCREMENT", "Algväärtus määratav", "Ainult üks tabeli kohta", "Automaatne"],
  },
];

export default function DatabaseObjects() {
  const [activeObject, setActiveObject] = useState(0);
  const [showCreate, setShowCreate] = useState(true);

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
        Andmebaasiobjektid
      </motion.h2>

      {/* Object selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "40px",
          flexWrap: "wrap",
        }}
      >
        {dbObjects.map((obj, index) => (
          <motion.button
            key={obj.name}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setActiveObject(index); setShowCreate(true); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 20px",
              borderRadius: "12px",
              border: "none",
              background: activeObject === index ? obj.color : colors.backgroundLight,
              color: colors.text,
              fontSize: "0.95rem",
              fontWeight: 500,
              cursor: "pointer",
              transition: "background 0.3s",
              boxShadow: activeObject === index ? `0 5px 20px ${obj.color}40` : "none",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>{obj.icon}</span>
            {obj.name}
          </motion.button>
        ))}
      </motion.div>

      {/* Object detail */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeObject}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.3 }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "30px",
          }}
        >
          {/* Left: Description and properties */}
          <div
            style={{
              padding: "30px",
              borderRadius: "20px",
              background: colors.backgroundLight,
              border: `2px solid ${dbObjects[activeObject].color}40`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
              <span style={{ fontSize: "3rem" }}>{dbObjects[activeObject].icon}</span>
              <h3 style={{ fontSize: "1.8rem", fontWeight: 700, color: dbObjects[activeObject].color }}>
                {dbObjects[activeObject].name}
              </h3>
            </div>

            <p style={{ color: colors.textMuted, fontSize: "1.1rem", lineHeight: 1.6, marginBottom: "25px" }}>
              {dbObjects[activeObject].description}
            </p>

            <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "15px" }}>Omadused:</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {dbObjects[activeObject].properties.map((prop, i) => (
                <motion.span
                  key={prop}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    padding: "8px 15px",
                    borderRadius: "8px",
                    background: `${dbObjects[activeObject].color}20`,
                    fontSize: "0.9rem",
                    fontWeight: 500,
                  }}
                >
                  {prop}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Right: Code examples with tabs */}
          <div
            style={{
              borderRadius: "20px",
              background: "#1a1a2e",
              border: `1px solid ${colors.surface}`,
              fontFamily: "'Fira Code', 'Consolas', monospace",
              overflow: "hidden",
            }}
          >
            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: `1px solid ${colors.surface}` }}>
              <button
                onClick={() => setShowCreate(true)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: showCreate ? "#2a2a4e" : "transparent",
                  border: "none",
                  color: showCreate ? dbObjects[activeObject].color : colors.textMuted,
                  fontWeight: showCreate ? 600 : 400,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Loomine (CREATE)
              </button>
              <button
                onClick={() => setShowCreate(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: !showCreate ? "#2a2a4e" : "transparent",
                  border: "none",
                  color: !showCreate ? dbObjects[activeObject].color : colors.textMuted,
                  fontWeight: !showCreate ? 600 : 400,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Kasutamine
              </button>
            </div>
            <div style={{ padding: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f56" }} />
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }} />
                <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27ca40" }} />
                <span style={{ marginLeft: "10px", color: colors.textMuted, fontSize: "0.85rem" }}>SQL</span>
              </div>
              <div style={{ maxHeight: "280px", overflow: "auto" }}>
                <SQLHighlighter
                  code={showCreate ? dbObjects[activeObject].createExample : dbObjects[activeObject].useExample}
                  fontSize="0.8rem"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
