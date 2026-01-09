import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "../styles";
import InfoButton from "../components/InfoButton";

const teacherGuide = `Selle slaidiga taoteldakse, et õpilased mõistaksid erinevate andmebaasisüsteemide tugevusi ja nõrkusi kõigis kategooriates korraga.

📌 Interaktiivsuse kasutamine:

• Tabel näitab kõiki andmebaase ja nende omadusi korraga
• KLÕPSA igal lahtril, et näha detailset selgitust, miks see hinnang on just selline
• Värvikood näitab tugevust: roheline = tugev, kollane = keskmine, punane = nõrk

🎯 Soovitused esitlemiseks:

1. Ülevaade tabelist:
   • Näita, kuidas erinevad süsteemid on erinevates valdkondades tugevad
   • Redis domineerib jõudluses (100%), aga funktsioonides on nõrgem (60%)
   • Oracle on üldiselt tugev, aga VÄGA kallis (20%)

2. Kulu ja kasutuslihtsus:
   • PostgreSQL, MySQL, SQLite on TASUTA (100%)
   • Oracle on kalleim (20%) - protsessoripõhine litsents
   • SQLite on lihtsaim kasutada (95%), Oracle keerukaim (55%)

3. Interaktiivne arutelu:
   • Klõpsa lahtril ja lase õpilastel arvata, miks skoor selline on
   • "Miks on SQLite skaleeritavus ainult 30%?" (ühe faili AB)
   • "Miks on Oracle kulu ainult 20%?" (kallis litsents)

4. Küsimused õpilastele:
   • "Millist AB kasutaksite startup-i jaoks?" (PostgreSQL - tasuta + võimas)
   • "Mobiilirakenduse jaoks?" (SQLite - lihtne, sisseehitatud)
   • "Suurettevõtte jaoks, kus raha pole probleem?" (Oracle)

💡 Rõhuta: Pole "parimat" andmebaasi - valik sõltub nõuetest ja eelarvest!`;

interface CellExplanation {
  db: string;
  metric: string;
  value: number;
  explanation: string;
}

const explanations: Record<string, Record<string, string>> = {
  PostgreSQL: {
    performance: "PostgreSQL pakub suurepärast jõudlust tänu võimsale päringu optimeerijale ja paralleelsetele päringutele. Kuigi mitte kõige kiirem, on see väga hästi tasakaalustatud.",
    scalability: "PostgreSQL toetab replikatsiooni ja partitsioneerimist, kuid horisontaalne skaleerimine nõuab lisatööriistu nagu Citus. Vertikaalne skaleerimine töötab hästi.",
    ease: "PostgreSQL nõuab teatud õppimiskõverat - konfigureerimine ja optimeerimine vajab kogemust. Samas on dokumentatsioon suurepärane ja kogukond aktiivne. Võimsam, kuid keerukam kui MySQL.",
    features: "PostgreSQL on üks funktsionaalsemaid andmebaase: JSON/JSONB tugi, täistekstiotsing, geograafilised andmed, aknapäringud, CTE-d, ja palju muud.",
    cost: "PostgreSQL on täiesti tasuta ja avatud lähtekoodiga. Kulud tulevad ainult riistvarast ja haldamisest. Pilveteenustes (RDS, Cloud SQL) on hinnad mõistlikud.",
  },
  MySQL: {
    performance: "MySQL on kiire lugemisoperatsioonidel, eriti InnoDB mootoriga. Lihtsamate päringute puhul väga hea jõudlus, kuid keerukamatel päringutelt PostgreSQL-ist maas.",
    scalability: "MySQL toetab master-slave replikatsiooni hästi. MySQL Cluster võimaldab horisontaalset skaleerimist, kuid see on keerukam seadistada kui MongoDB puhul.",
    ease: "MySQL on väga kasutajasõbralik ja üks lihtsamaid relatsioonilisi andmebaase. Lai tööriistade valik (phpMyAdmin, Workbench), palju õpetusi ja suur kogukond. Lihtne alustada.",
    features: "MySQL pakub põhilisi SQL funktsioone hästi, kuid puuduvad mõned täiustatud võimalused nagu JSONB indekseerimine, aknapäringud olid pikalt puudu.",
    cost: "MySQL Community Edition on tasuta. Enterprise Edition on tasuline. Pilveteenustes on hinnad soodsad. Oracle omandis, mis tekitab mõnel muret tuleviku pärast.",
  },
  MongoDB: {
    performance: "MongoDB on väga kiire dokumentide lugemisel ja kirjutamisel, eriti kui andmed on denormaliseeritud. Agregatsiooni torujuhe on võimas, kuid JOIN-id on aeglased.",
    scalability: "MongoDB šardimine (sharding) on sisseehitatud ja lihtne kasutada. Horisontaalne skaleerimine on MongoDB tugevus - andmeid saab jagada mitme serveri vahel.",
    ease: "MongoDB skeem on paindlik - pole vaja migratsioone. JSON-laadne süntaks on arendajatele tuttav. Samas nõuab hästi töötav andmemudeli disain kogemust NoSQL maailmas.",
    features: "MongoDB pakub paindlikku skeemi, agregatsiooni torujuhet ja teksti indekseid. Puuduvad aga transaktsioonid mitme dokumendi vahel (alates v4.0 osaliselt olemas) ja JOIN-id.",
    cost: "MongoDB Community on tasuta, kuid Atlas (pilveversioon) võib kulukaks minna suurte andmemahtude puhul. Enterprise litsents on kallis.",
  },
  Oracle: {
    performance: "Oracle on optimeeritud ettevõtte töökoormuseks - keerukad analüütilised päringud, OLTP, ja segatud töökoormus. RAC võimaldab väga kõrget jõudlust.",
    scalability: "Oracle RAC (Real Application Clusters) võimaldab horisontaalset skaleerimist. Sharding on samuti toetatud. Hind ja keerukus on takistuseks.",
    ease: "Oracle on keeruline installida, konfigureerida ja hallata. Nõuab spetsialisti teadmisi. Enterprise Manager on võimas, kuid õppimiskõver on järsk.",
    features: "Oracle on absoluutne liider funktsioonide osas: PL/SQL, materialiseeritud vaated, täiustatud analüütika, JSON tugi, graafiandmebaas, ja palju muud.",
    cost: "Oracle on üks kallimaid andmebaase turul. Protsessoripõhine litsents võib maksta kümneid tuhandeid aastas. Väikeettevõtetele sageli liiga kallis.",
  },
  Redis: {
    performance: "Redis on mälupõhine - kõik andmed on RAM-is. See tähendab, et lugemised ja kirjutamised on äärmiselt kiired (mikrosekundid). Absoluutne kiiruse liider.",
    scalability: "Redis Cluster toetab horisontaalset skaleerimist. Samas on mälu piiratud ressurss ja kallis. Suurte andmemahtude puhul võib see olla probleem.",
    ease: "Redis on lihtne alustada - võti-väärtus operatsioonid on intuitiivsed. Klastri seadistamine ja keerukamad andmestruktuurid nõuavad rohkem kogemust.",
    features: "Redis pakub andmestruktuure (listid, setid, hashid), pub/sub, Lua skriptimist. Samas pole see täisväärtuslik andmebaas - puuduvad päringud, JOIN-id, jne.",
    cost: "Redis on avatud lähtekoodiga ja tasuta. Redis Enterprise on tasuline. Pilveteenustes (ElastiCache) on hinnad sõltuvad mälumahust.",
  },
  SQLite: {
    performance: "SQLite on kiire väikeste andmemahtude ja lihtsamate päringute puhul. Ühe faili andmebaas ei nõua võrguühendust, mis vähendab latentsust.",
    scalability: "SQLite ei ole mõeldud skaleeruma - see on ühe faili andmebaas ilma võrguühenduseta. Paralleelsed kirjutamised pole toetatud. Ainult vertikaalse skaleerimise võimalus.",
    ease: "SQLite on absoluutselt lihtsaim andmebaas - null konfiguratsiooni, üks fail, ei nõua serverit, sisseehitatud paljudesse keeltesse. Ideaalne prototüüpimiseks ja mobiilirakendusteks.",
    features: "SQLite toetab põhilisi SQL funktsioone hästi, kuid puuduvad täiustatud võimalused: kasutajate haldus, replikatsioon, salvestatud protseduurid.",
    cost: "SQLite on täiesti tasuta ja avalikus omandis (public domain). Pole mingeid litsentsitasusid ega piiranguid - võib kasutada igal otstarbel tasuta.",
  },
};

const comparisonData = [
  { name: "PostgreSQL", icon: "🐘", performance: 85, scalability: 80, ease: 72, features: 95, cost: 100 },
  { name: "MySQL", icon: "🐬", performance: 80, scalability: 75, ease: 85, features: 75, cost: 100 },
  { name: "MongoDB", icon: "🍃", performance: 90, scalability: 95, ease: 80, features: 70, cost: 70 },
  { name: "Oracle", icon: "🔴", performance: 90, scalability: 90, ease: 52, features: 100, cost: 20 },
  { name: "Redis", icon: "⚡", performance: 100, scalability: 85, ease: 72, features: 60, cost: 95 },
  { name: "SQLite", icon: "🪶", performance: 70, scalability: 30, ease: 98, features: 50, cost: 100 },
];

const metrics = [
  { key: "performance", label: "Jõudlus", color: "#22c55e" },
  { key: "scalability", label: "Skaleeritavus", color: "#3b82f6" },
  { key: "ease", label: "Kasutuslihtsus", color: "#f59e0b" },
  { key: "features", label: "Funktsioonid", color: "#ec4899" },
  { key: "cost", label: "Hind", color: "#06b6d4" },
];

function getScoreColor(score: number): string {
  if (score >= 85) return "#22c55e";
  if (score >= 70) return "#f59e0b";
  return "#ef4444";
}

function getScoreBg(score: number): string {
  if (score >= 85) return "rgba(34, 197, 94, 0.15)";
  if (score >= 70) return "rgba(245, 158, 11, 0.15)";
  return "rgba(239, 68, 68, 0.15)";
}

export default function DBMSComparison() {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);
  const [selectedCell, setSelectedCell] = useState<CellExplanation | null>(null);

  const handleCellHover = (rowIndex: number, metricKey: string, cellId: string) => {
    setHoveredCell(cellId);
    setHoveredRow(rowIndex);
    setHoveredCol(metricKey);
  };

  const handleCellLeave = () => {
    setHoveredCell(null);
    setHoveredRow(null);
    setHoveredCol(null);
  };

  const handleCellClick = (db: string, metricKey: string, value: number) => {
    const explanation = explanations[db]?.[metricKey] || "Selgitus pole saadaval.";
    setSelectedCell({ db, metric: metricKey, value, explanation });
  };

  return (
    <div style={{ width: "100%", maxWidth: "1100px" }}>
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
        DBMS Võrdlus
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          border: `1px solid ${colors.surface}`,
          background: colors.backgroundLight,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "160px repeat(5, 1fr)",
            background: colors.background,
            borderBottom: `1px solid ${colors.surface}`,
          }}
        >
          <div
            style={{
              padding: "16px 15px",
              fontWeight: 600,
              fontSize: "0.85rem",
              borderRight: `1px solid ${colors.surface}`,
            }}
          >
            Andmebaas
          </div>
          {metrics.map((metric) => (
            <div
              key={metric.key}
              style={{
                padding: "16px 8px",
                fontWeight: 600,
                fontSize: "0.75rem",
                textAlign: "center",
                color: metric.color,
                borderRight: `1px solid ${colors.surface}`,
                background: hoveredCol === metric.key ? `${metric.color}15` : "transparent",
                transition: "background 0.2s",
              }}
            >
              {metric.label}
            </div>
          ))}
        </div>

        {/* Rows */}
        {comparisonData.map((db, rowIndex) => (
          <motion.div
            key={db.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rowIndex * 0.08 }}
            style={{
              display: "grid",
              gridTemplateColumns: "160px repeat(5, 1fr)",
              borderBottom: rowIndex < comparisonData.length - 1 ? `1px solid ${colors.surface}` : "none",
            }}
          >
            {/* DB Name */}
            <div
              style={{
                padding: "14px 12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: hoveredRow === rowIndex ? 700 : 500,
                fontSize: "0.85rem",
                borderRight: `1px solid ${colors.surface}`,
                background: hoveredRow === rowIndex ? "rgba(59, 130, 246, 0.15)" : rowIndex % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                transition: "all 0.2s",
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>{db.icon}</span>
              <span>{db.name}</span>
            </div>

            {/* Metric cells */}
            {metrics.map((metric) => {
              const value = db[metric.key as keyof typeof db] as number;
              const cellId = `${db.name}-${metric.key}`;
              const isHovered = hoveredCell === cellId;
              const isInHighlightedRow = hoveredRow === rowIndex;
              const isInHighlightedCol = hoveredCol === metric.key;

              // Determine background color
              let bgColor = rowIndex % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)";
              if (isHovered) {
                bgColor = getScoreBg(value);
              } else if (isInHighlightedRow && isInHighlightedCol) {
                bgColor = "rgba(59, 130, 246, 0.2)";
              } else if (isInHighlightedRow) {
                bgColor = "rgba(59, 130, 246, 0.08)";
              } else if (isInHighlightedCol) {
                bgColor = `${metric.color}10`;
              }

              return (
                <motion.div
                  key={metric.key}
                  onMouseEnter={() => handleCellHover(rowIndex, metric.key, cellId)}
                  onMouseLeave={handleCellLeave}
                  onClick={() => handleCellClick(db.name, metric.key, value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: "12px 6px",
                    textAlign: "center",
                    borderRight: `1px solid ${colors.surface}`,
                    background: bgColor,
                    cursor: "pointer",
                    transition: "background 0.15s",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: getScoreColor(value),
                      }}
                    >
                      {value}%
                    </span>
                    <div
                      style={{
                        width: "45px",
                        height: "5px",
                        background: colors.surface,
                        borderRadius: "3px",
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${value}%` }}
                        transition={{ duration: 0.8, delay: rowIndex * 0.08 }}
                        style={{
                          height: "100%",
                          background: getScoreColor(value),
                          borderRadius: "3px",
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ))}
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          marginTop: "25px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "14px", height: "14px", borderRadius: "3px", background: "#22c55e" }} />
          <span style={{ fontSize: "0.85rem", color: colors.textMuted }}>Tugev (85%+)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "14px", height: "14px", borderRadius: "3px", background: "#f59e0b" }} />
          <span style={{ fontSize: "0.85rem", color: colors.textMuted }}>Keskmine (70-84%)</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "14px", height: "14px", borderRadius: "3px", background: "#ef4444" }} />
          <span style={{ fontSize: "0.85rem", color: colors.textMuted }}>Nõrk (&lt;70%)</span>
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{
          textAlign: "center",
          color: colors.textMuted,
          marginTop: "15px",
          fontSize: "0.85rem",
        }}
      >
        Klõpsa lahtril selgituse nägemiseks
      </motion.p>

      {/* Explanation Modal */}
      <AnimatePresence>
        {selectedCell && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCell(null)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.6)",
                zIndex: 2000,
                backdropFilter: "blur(3px)",
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "90%",
                maxWidth: "500px",
                background: colors.backgroundLight,
                borderRadius: "20px",
                padding: "30px",
                zIndex: 2001,
                boxShadow: "0 25px 80px rgba(0, 0, 0, 0.5)",
                border: `1px solid ${colors.surface}`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
                <span style={{ fontSize: "2.5rem" }}>
                  {comparisonData.find(d => d.name === selectedCell.db)?.icon}
                </span>
                <div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "3px" }}>
                    {selectedCell.db}
                  </h3>
                  <span style={{ fontSize: "0.9rem", color: metrics.find(m => m.key === selectedCell.metric)?.color }}>
                    {metrics.find(m => m.key === selectedCell.metric)?.label}: {selectedCell.value}%
                  </span>
                </div>
                <div
                  style={{
                    marginLeft: "auto",
                    fontSize: "2rem",
                    fontWeight: 700,
                    color: getScoreColor(selectedCell.value),
                  }}
                >
                  {selectedCell.value}%
                </div>
              </div>

              <p style={{ fontSize: "1rem", lineHeight: 1.8, color: colors.text, marginBottom: "25px" }}>
                {selectedCell.explanation}
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCell(null)}
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
                Sulge
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
