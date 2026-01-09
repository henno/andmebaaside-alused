import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "../styles";
import InfoButton from "../components/InfoButton";
import SQLHighlighter from "../components/SQLHighlighter";

const teacherGuide = `Selle slaidiga taoteldakse, et õpilased mõistaksid andmebaasimootorite olulisemaid tehnilisi omadusi ja nende tähtsust.

📌 Interaktiivsuse kasutamine:

• Klõpsa vasakul menüüs erinevatel kategooriatel (ACID, Indeksid, Replikatsioon, Turvalisus)
• Paremal kuvatakse valitud kategooria detailid animeeritud kaartidena
• Iga kaart sisaldab terminit ja selgitust

🎯 Soovitused esitlemiseks:

1. ACID Omadused - see on fundamentaalne! Selgita iga tähe tähendust:
   • A - Atomicity: "Kõik või mitte midagi" - pangaülekande näide
   • C - Consistency: Andmebaas on alati kehtivas olekus
   • I - Isolation: Paralleelsed tehingud ei sega üksteist
   • D - Durability: Kui tehing on kinnitatud, on see püsiv

2. Indeksid - kasuta raamatu sisukorra analoogiat:
   • B-Tree on nagu raamatu sisukord
   • Hash on nagu sõnaraamat (kiire otsimine täpse vaste järgi)

3. Replikatsioon - joonista tahvlile master-slave skeem:
   • Master võtab kirjutusi vastu
   • Slave'id kopeerivad ja teenindavad lugemisi

4. Turvalisus - küsi õpilastelt, miks see on oluline (GDPR, ärisaladused)

💡 Vihje: ACID omadused on tihti eksamiküsimus - veendu, et kõik mõistavad!`;

const features = [
  {
    title: "ACID Omadused",
    icon: "🔒",
    color: "#22c55e",
    items: [
      {
        name: "Atomicity (Aatomsus)",
        desc: "Tehing on jagamatu - kas kõik operatsioonid õnnestuvad või mitte ükski. Pangaülekanne: kui raha mahaarvamine õnnestub, peab lisamine ka õnnestuma, muidu pööratakse kõik tagasi.",
        example: `BEGIN;
UPDATE kontod SET saldo = saldo - 100
  WHERE id = 1;
UPDATE kontod SET saldo = saldo + 100
  WHERE id = 2;
COMMIT;`
      },
      {
        name: "Consistency (Järjepidevus)",
        desc: "Andmebaas liigub ühest kehtivast olekust teise. Piirangud (NOT NULL, UNIQUE, FK) tagatakse alati. Kui tehingu ajal rikutakse piirangut, siis tehing tühistatakse.",
        example: `ALTER TABLE kontod
ADD CONSTRAINT saldo_positiivne
CHECK (saldo >= 0);
-- Saldo ei saa kunagi negatiivseks`
      },
      {
        name: "Isolation (Isoleeritus)",
        desc: "Paralleelsed tehingud ei näe üksteise pooleliolevaid muudatusi. Erinevad isolatsioonitasemed: READ UNCOMMITTED, READ COMMITTED, REPEATABLE READ, SERIALIZABLE.",
        example: `SET TRANSACTION ISOLATION LEVEL
  SERIALIZABLE;
-- Kõrgeim isolatsioonitase`
      },
      {
        name: "Durability (Püsivus)",
        desc: "Kui COMMIT on tehtud, on andmed püsivalt salvestatud ka süsteemitõrke korral. Saavutatakse WAL (Write-Ahead Logging) abil - muudatused logitakse ENNE andmefaili kirjutamist.",
        example: `COMMIT;
-- Pärast seda on andmed
-- garanteeritult kettal`
      },
    ],
  },
  {
    title: "Indeksid",
    icon: "📑",
    color: "#3b82f6",
    items: [
      {
        name: "B-Tree (vaikimisi)",
        desc: "Tasakaalustatud puustruktuur, ideaalne võrdlus- ja vahemikpäringuteks (=, <, >, BETWEEN). O(log n) otsingukiirus. 99% indeksitest kasutavad B-Tree'd.",
        example: `CREATE INDEX idx_nimi
  ON kasutajad(nimi);
-- Kiirendab: WHERE nimi = 'Mari'
-- ja WHERE nimi BETWEEN 'A' AND 'M'`
      },
      {
        name: "Komposiitindeks",
        desc: "Indeks mitme veeru järgi. Järjekord on oluline! Esimene veerg peab olema päringus, muidu indeksit ei kasutata.",
        example: `CREATE INDEX idx_nimi_email
  ON kasutajad(perenimi, eesnimi);
-- Kiirendab: WHERE perenimi = 'Tamm'
-- Kiirendab: WHERE perenimi = 'Tamm'
--            AND eesnimi = 'Mari'`
      },
      {
        name: "FULLTEXT (Täistekst)",
        desc: "Täistekstiotsingu indeks - võimaldab otsida sõnu tekstist. Toetab loomulikku keelt ja boolean-režiimi.",
        example: `CREATE FULLTEXT INDEX idx_sisu
  ON artiklid(pealkiri, sisu);
-- Kasutamine:
SELECT * FROM artiklid
WHERE MATCH(pealkiri, sisu)
      AGAINST('andmebaas' IN NATURAL LANGUAGE MODE);`
      },
      {
        name: "SPATIAL (Ruumiline)",
        desc: "Geomeetriliste andmete indeks - punktid, jooned, polügonid. Kiirendab ruumilisi päringuid (lähedus, sisalduvus).",
        example: `CREATE SPATIAL INDEX idx_asukoht
  ON kohad(koordinaadid);
-- Kiirendab: ST_Contains, ST_Distance
-- Vajab GEOMETRY andmetüüpi`
      },
    ],
  },
  {
    title: "Replikatsioon",
    icon: "🔄",
    color: "#f59e0b",
    items: [
      {
        name: "Primary-Replica (Master-Slave)",
        desc: "Üks PRIMARY võtab vastu kõik kirjutamised, REPLICA'd kopeerivad ja teenindavad lugemisi. Lihtne, skaleerib lugemisi, AGA PRIMARY on üksik tõrkepunkt.",
        example: `Kasutusjuht: e-pood
90% päringutest on tooteotsingud
→ skaleeritakse lugemisi replica'dega`
      },
      {
        name: "Multi-Master",
        desc: "Mitu sõlme võtavad vastu kirjutamisi. Konfliktide lahendamine keeruline (viimane võidab? ühendamine?). Kasutatakse geograafiliselt hajutatud süsteemides.",
        example: `Kasutusjuht: globaalne rakendus
USA kasutajad → USA sõlm
EU kasutajad → EU sõlm`
      },
      {
        name: "Sünkroonne replikatsioon",
        desc: "PRIMARY ootab COMMIT enne, kui REPLICA kinnitab andmete saamise. 0 andmekadu, AGA suurem latentsus. Kriitiliste andmete jaoks (pangandus).",
        example: `-- MySQL konfiguratsioon (my.cnf)
rpl_semi_sync_master_enabled = 1
rpl_semi_sync_master_timeout = 1000`
      },
      {
        name: "Asünkroonne replikatsioon",
        desc: "PRIMARY ei oota REPLICA kinnitust - COMMIT on kohene. Võimalik andmekadu tõrke korral (replication lag). Sobib kõrge jõudluse vajadusele.",
        example: `Kasutusjuht: sotsiaalmeedia
Mõne sekundi viivitus postituse
kuvamisel on aktsepteeritav`
      },
    ],
  },
  {
    title: "Turvalisus",
    icon: "🛡️",
    color: "#ec4899",
    items: [
      {
        name: "Autentimine (Authentication)",
        desc: "KES sa oled? Kasutajanimi+parool, sertifikaadid, LDAP/AD integratsioon. MySQL kasutab mysql.user tabelit ja pluginaid.",
        example: `-- Kasutaja loomine parooliga
CREATE USER 'kasutaja'@'localhost'
  IDENTIFIED BY 'salajane_parool';
-- Autentimisplugin määramine
ALTER USER 'kasutaja'@'localhost'
  IDENTIFIED WITH caching_sha2_password;`
      },
      {
        name: "Autoriseerimine (Authorization)",
        desc: "MIDA sa tohid teha? GRANT/REVOKE käsud, rollipõhine juurdepääs (RBAC). Piiratud õigused - kasutaja näeb ainult oma andmeid.",
        example: `GRANT SELECT, INSERT
  ON tellimused TO veebikasutaja;
REVOKE DELETE
  ON tellimused FROM veebikasutaja;`
      },
      {
        name: "Krüpteerimine",
        desc: "Andmete kaitsmine: 1) Liikumisel (TLS/SSL ühendused), 2) Puhkeolekus (kettal krüpteeritud). Tundlike veergude krüpteerimine (paroolid, isikukood).",
        example: `-- MySQL konfiguratsioon (my.cnf)
[mysqld]
require_secure_transport = ON
ssl_cert = /path/server-cert.pem
ssl_key = /path/server-key.pem`
      },
      {
        name: "Auditeerimine",
        desc: "KES tegi MIDA ja MILLAL? Logid päringute kohta, muudatuste ajalugu. GDPR nõuab teadmist, kes isikuandmetele ligi pääses.",
        example: `-- MySQL Enterprise Audit või
-- general_log sisse lülitamine
SET GLOBAL general_log = 'ON';
SET GLOBAL log_output = 'TABLE';
-- Vaata logisid:
SELECT * FROM mysql.general_log;`
      },
    ],
  },
];

export default function DBMSFeatures() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <div style={{ width: "100%", maxWidth: "1100px" }}>
      <InfoButton content={teacherGuide} />
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: "2.8rem",
          fontWeight: 700,
          marginBottom: "50px",
          textAlign: "center",
        }}
      >
        Andmebaasimootori Omadused
      </motion.h2>

      <div style={{ display: "flex", gap: "40px" }}>
        {/* Feature tabs */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            minWidth: "220px",
          }}
        >
          {features.map((feature, index) => (
            <motion.button
              key={feature.title}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveFeature(index)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                padding: "18px 20px",
                borderRadius: "15px",
                border: "none",
                background: activeFeature === index ? `${feature.color}20` : colors.backgroundLight,
                borderLeft: `4px solid ${activeFeature === index ? feature.color : "transparent"}`,
                cursor: "pointer",
                transition: "all 0.3s",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "1.8rem" }}>{feature.icon}</span>
              <span
                style={{
                  color: activeFeature === index ? feature.color : colors.text,
                  fontWeight: activeFeature === index ? 600 : 400,
                  fontSize: "1rem",
                }}
              >
                {feature.title}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Feature content */}
        <div style={{ flex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: "20px",
              }}
            >
              {features[activeFeature].items.map((item: any, index: number) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  style={{
                    padding: "20px",
                    borderRadius: "16px",
                    background: colors.backgroundLight,
                    border: `1px solid ${colors.surface}`,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      marginBottom: "8px",
                      color: features[activeFeature].color,
                    }}
                  >
                    {item.name}
                  </h4>
                  <p style={{ color: colors.text, fontSize: "0.85rem", lineHeight: 1.6, marginBottom: "12px", flex: 1 }}>
                    {item.desc}
                  </p>
                  {item.example && (
                    <div
                      style={{
                        padding: "10px",
                        borderRadius: "8px",
                        background: "#1a1a2e",
                      }}
                    >
                      <SQLHighlighter code={item.example} fontSize="0.7rem" />
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
