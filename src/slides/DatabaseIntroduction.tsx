import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "../styles";
import InfoButton from "../components/InfoButton";

const teacherGuide = `Selle slaidiga taoteldakse, et õpilased mõistaksid andmebaaside rolli tarkvarasüsteemides ja miks need on vajalikud.

📌 Interaktiivsuse kasutamine:

• Klõpsa diagrammi erinevatel kihtidel, et näha detailsemat infot
• Paremal pool kuvatakse valitud kihi selgitus
• Alumine osa näitab põhjuseid, miks andmebaasid on vajalikud

🎯 Soovitused esitlemiseks:

1️⃣ ALUSTA KÜSIMUSEGA (2 min):
   "Kujutage ette, et teete veebirakenduse. Kasutaja sisestab oma nime ja aadressi. Mis juhtub, kui server taaskäivitub?"
   → Andmed kaovad! Mälu on ajutine.

2️⃣ DIAGRAMMI LÄBIKÄIMINE (5 min):

   A) Kasutajaliides (Frontend):
      • Brauser, mobiilirakendus, töölauarakendus
      • Näitab andmeid, kogub sisendit
      • EI SALVESTA andmeid püsivalt!

   B) Rakendusserver (Backend):
      • Äriloogika, arvutused, valideerimine
      • Töötleb päringuid, teeb otsuseid
      • Hoiab andmeid MÄLUS - ajutine!

   C) Andmebaas:
      • PÜSIV salvestus kettale
      • Struktureeritud andmed
      • Mitme kasutaja samaaegne ligipääs

3️⃣ ANALOOGIA (2 min):
   "Andmebaas on nagu raamatukogu:
   • Mälu = teie töölaud (kiire, aga piiratud, tühjendatakse)
   • Andmebaas = raamaturiiulid (püsiv, organiseeritud, otsitav)"

4️⃣ MIKS ANDMEBAAS, MITTE LIHTSALT FAILID? (3 min):
   • Failid: aeglane otsing, lukustamisprobleemid, korruptsiooni risk
   • Andmebaas: indeksid, transaktsioonid, ACID garantiid

❓ KÜSIMUSED ÕPILASTELE:
• "Mis juhtub, kui 100 kasutajat üritavad sama faili korraga muuta?"
• "Kuidas leida failist kõik kliendid, kes on Tallinnast?"
• "Mis juhtub andmetega, kui elekter kaob kirjutamise ajal?"

💡 VÕTMESÕNUM:
Andmebaas EI OLE lihtsalt "koht andmete hoidmiseks" - see on intelligentne süsteem, mis tagab andmete terviklikkuse, kiire ligipääsu ja samaaegse kasutuse.`;

const layers = [
  {
    id: "users",
    name: "Kasutajad",
    icon: "👥",
    color: "#8b5cf6",
    description: "Inimesed ja süsteemid, kes kasutavad rakendust",
    details: `Kasutajad suhtlevad rakendusega läbi erinevate seadmete ja liideste.

🖥️ SEADMED:
• Veebilehitseja (Chrome, Firefox, Safari)
• Mobiilirakendus (iOS, Android)
• Töölauarakendus (Windows, macOS)
• API kliendid (teised süsteemid)

📊 KASUTAJATE TÜÜBID:
• Lõppkasutajad - igapäevased kasutajad
• Administraatorid - haldavad süsteemi
• Arendajad - testivad ja debugivad
• Välised süsteemid - automatiseeritud päringud`,
  },
  {
    id: "frontend",
    name: "Kasutajaliides",
    subtitle: "Frontend",
    icon: "🖼️",
    color: "#3b82f6",
    description: "Visuaalne liides, mida kasutaja näeb ja kasutab",
    details: `Kasutajaliides (UI) on see, mida kasutaja näeb ja millega suhtleb.

🎨 TEHNOLOOGIAD:
• HTML, CSS, JavaScript
• React, Vue, Angular
• Mobiili: Swift, Kotlin, Flutter

⚡ FUNKTSIOONID:
• Andmete kuvamine (tabelid, graafikud)
• Vormide kogumine (sisestusväljad, nupud)
• Navigeerimine lehekülgede vahel
• Valideerimine kasutaja poolel

⚠️ PIIRANGUD:
• EI SALVESTA andmeid püsivalt
• Kasutaja võib koodi näha ja muuta
• Andmed kaovad lehe värskendamisel`,
  },
  {
    id: "backend",
    name: "Rakendusserver",
    subtitle: "Backend",
    icon: "⚙️",
    color: "#22c55e",
    description: "Äriloogika ja andmetöötlus serveris",
    details: `Backend on rakenduse "aju" - siin toimub põhiline loogika.

🔧 TEHNOLOOGIAD:
• Node.js, Python, Java, C#, Go
• Spring, Django, Express, .NET

📋 FUNKTSIOONID:
• Äriloogika (hinnaarvutused, reeglid)
• Autentimine ja autoriseerimine
• API päringute töötlemine
• Andmete valideerimine ja töötlus

💾 MÄLU (RAM):
• AJUTINE - kaob taaskäivitusel!
• Kiire ligipääs
• Piiratud maht
• Sessioonid, vahemälud`,
  },
  {
    id: "database",
    name: "Andmebaas",
    subtitle: "Database",
    icon: "🗄️",
    color: "#f59e0b",
    description: "Püsiv andmete salvestus ja haldus",
    details: `Andmebaas on PÜSIV andmesalvestus, mis säilib ka pärast taaskäivitust.

💾 SALVESTUS:
• Kõvaketas (HDD/SSD)
• Andmed säilivad ALATI
• Struktureeritud formaat

🔑 VÕIMALUSED:
• Kiire otsing indeksite abil
• Mitme kasutaja samaaegne ligipääs
• Transaktsioonid ja tagasipööramine
• Andmete terviklikkuse kontroll
• Varundamine ja taastamine

📊 TÜÜBID:
• Relatsioonilised (MySQL, PostgreSQL)
• NoSQL (MongoDB, Redis)
• Graafandmebaasid (Neo4j)`,
    isHighlighted: true,
  },
  {
    id: "storage",
    name: "Kettasalvestus",
    subtitle: "Disk Storage",
    icon: "💿",
    color: "#6b7280",
    description: "Füüsiline andmekandja",
    details: `Andmebaas salvestab andmed füüsilisele andmekandjale.

💿 SALVESTUSMEEDIUMID:
• HDD - magnetiline, suurem maht, aeglasem
• SSD - välkmälu, kiirem, kallim
• NVMe - ülikiire SSD

☁️ PILVETEENUSED:
• AWS RDS, Aurora
• Google Cloud SQL
• Azure SQL Database
• Hallatud teenused = vähem hooldust

🔒 ANDMEKAITSE:
• RAID massiivid (tõrkekindlus)
• Varundamine (backup)
• Replikatsioon (koopiad)
• Krüpteerimine`,
  },
];

const whyDatabase = [
  {
    icon: "💾",
    title: "Püsivus",
    description: "Andmed säilivad ka pärast serveri taaskäivitust",
  },
  {
    icon: "🔍",
    title: "Kiire otsing",
    description: "Indeksid võimaldavad leida andmeid millisekunditega",
  },
  {
    icon: "👥",
    title: "Mitmekasutaja",
    description: "Sajad kasutajad saavad korraga andmeid lugeda ja muuta",
  },
  {
    icon: "🔒",
    title: "Terviklikkus",
    description: "ACID garantiid tagavad andmete korrektsuse",
  },
  {
    icon: "🔐",
    title: "Turvalisus",
    description: "Ligipääsukontroll ja krüpteerimine",
  },
  {
    icon: "📊",
    title: "Struktuur",
    description: "Andmed on organiseeritud ja seostatud",
  },
];

export default function DatabaseIntroduction() {
  const [selectedLayer, setSelectedLayer] = useState<number>(3); // Default to database layer

  return (
    <div style={{ width: "100%", maxWidth: "1200px" }}>
      <InfoButton content={teacherGuide} />
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: "2.5rem",
          fontWeight: 700,
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        Kus asub andmebaas?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          textAlign: "center",
          color: colors.textMuted,
          marginBottom: "25px",
          fontSize: "1.1rem",
        }}
      >
        Andmebaasi roll tarkvarasüsteemi arhitektuuris
      </motion.p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "25px", alignItems: "stretch" }}>
        {/* Left: Architecture diagram */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            padding: "20px",
            borderRadius: "20px",
            background: colors.backgroundLight,
            border: `1px solid ${colors.surface}`,
          }}
        >
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "15px", textAlign: "center" }}>
            Tarkvarasüsteemi arhitektuur
          </h3>

          {/* SVG Architecture Diagram */}
          <svg viewBox="0 0 300 380" style={{ width: "100%", height: "auto" }}>
            {/* Users */}
            <motion.g
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedLayer(0)}
            >
              <rect
                x="75" y="10" width="150" height="50" rx="10"
                fill={selectedLayer === 0 ? "#8b5cf620" : "#8b5cf610"}
                stroke={selectedLayer === 0 ? "#8b5cf6" : "#8b5cf650"}
                strokeWidth={selectedLayer === 0 ? "3" : "2"}
              />
              <text x="150" y="32" textAnchor="middle" fill="#8b5cf6" fontSize="11" fontWeight="600">👥 Kasutajad</text>
              <text x="150" y="48" textAnchor="middle" fill="#a0a0a0" fontSize="9">Brauser, mobiil, API</text>
            </motion.g>

            {/* Arrow: Users -> Frontend */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              d="M150 60 L150 75"
              stroke="#666"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
            />

            {/* Frontend */}
            <motion.g
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedLayer(1)}
            >
              <rect
                x="50" y="80" width="200" height="55" rx="8"
                fill={selectedLayer === 1 ? "#3b82f620" : "#3b82f610"}
                stroke={selectedLayer === 1 ? "#3b82f6" : "#3b82f650"}
                strokeWidth={selectedLayer === 1 ? "3" : "2"}
              />
              <text x="150" y="103" textAnchor="middle" fill="#3b82f6" fontSize="12" fontWeight="600">Kasutajaliides</text>
              <text x="150" y="118" textAnchor="middle" fill="#888" fontSize="9">(Frontend)</text>
              <text x="150" y="130" textAnchor="middle" fill="#666" fontSize="8">React, Vue, mobiilirakendus</text>
            </motion.g>

            {/* Arrow: Frontend -> Backend */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              d="M150 135 L150 155"
              stroke="#666"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
            />

            {/* Backend */}
            <motion.g
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedLayer(2)}
            >
              <rect
                x="50" y="160" width="200" height="55" rx="8"
                fill={selectedLayer === 2 ? "#22c55e20" : "#22c55e10"}
                stroke={selectedLayer === 2 ? "#22c55e" : "#22c55e50"}
                strokeWidth={selectedLayer === 2 ? "3" : "2"}
              />
              <text x="150" y="183" textAnchor="middle" fill="#22c55e" fontSize="12" fontWeight="600">Rakendusserver</text>
              <text x="150" y="198" textAnchor="middle" fill="#888" fontSize="9">(Backend)</text>
              <text x="150" y="210" textAnchor="middle" fill="#666" fontSize="8">Node.js, Python, Java</text>
            </motion.g>

            {/* Arrow: Backend -> Database */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              d="M150 215 L150 235"
              stroke="#666"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
            />

            {/* Database Cylinder */}
            <motion.g
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedLayer(3)}
            >
              {/* Cylinder body */}
              <ellipse
                cx="150" cy="310" rx="70" ry="15"
                fill={selectedLayer === 3 ? "#f59e0b30" : "#f59e0b20"}
                stroke={selectedLayer === 3 ? "#f59e0b" : "#f59e0b70"}
                strokeWidth={selectedLayer === 3 ? "3" : "2"}
              />
              <rect
                x="80" y="250" width="140" height="60"
                fill={selectedLayer === 3 ? "#f59e0b30" : "#f59e0b20"}
              />
              <line x1="80" y1="250" x2="80" y2="310" stroke={selectedLayer === 3 ? "#f59e0b" : "#f59e0b70"} strokeWidth={selectedLayer === 3 ? "3" : "2"} />
              <line x1="220" y1="250" x2="220" y2="310" stroke={selectedLayer === 3 ? "#f59e0b" : "#f59e0b70"} strokeWidth={selectedLayer === 3 ? "3" : "2"} />
              <ellipse
                cx="150" cy="250" rx="70" ry="15"
                fill={selectedLayer === 3 ? "#f59e0b40" : "#f59e0b30"}
                stroke={selectedLayer === 3 ? "#f59e0b" : "#f59e0b70"}
                strokeWidth={selectedLayer === 3 ? "3" : "2"}
              />
              {/* Database label */}
              <text x="150" y="278" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="700">ANDMEBAAS</text>
              <text x="150" y="293" textAnchor="middle" fill="#888" fontSize="9">MySQL, PostgreSQL</text>

              {/* Highlight badge */}
              {selectedLayer === 3 && (
                <motion.g
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <rect x="195" y="242" width="45" height="16" rx="4" fill="#f59e0b" />
                  <text x="217" y="253" textAnchor="middle" fill="white" fontSize="7" fontWeight="600">FOOKUS</text>
                </motion.g>
              )}
            </motion.g>

            {/* Arrow: Database -> Storage */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              d="M150 325 L150 340"
              stroke="#666"
              strokeWidth="2"
              fill="none"
              markerEnd="url(#arrowhead)"
            />

            {/* Storage */}
            <motion.g
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedLayer(4)}
            >
              <rect
                x="75" y="345" width="150" height="30" rx="6"
                fill={selectedLayer === 4 ? "#6b728020" : "#6b728010"}
                stroke={selectedLayer === 4 ? "#6b7280" : "#6b728050"}
                strokeWidth={selectedLayer === 4 ? "3" : "2"}
              />
              <text x="150" y="364" textAnchor="middle" fill="#6b7280" fontSize="10" fontWeight="600">💿 Kettasalvestus (HDD/SSD)</text>
            </motion.g>

            {/* Arrow marker definition */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
              </marker>
            </defs>

            {/* Data flow labels */}
            <text x="170" y="70" fill="#888" fontSize="7">HTTP/HTTPS</text>
            <text x="170" y="150" fill="#888" fontSize="7">API päringud</text>
            <text x="170" y="230" fill="#888" fontSize="7">SQL päringud</text>
            <text x="170" y="337" fill="#888" fontSize="7">I/O operatsioonid</text>
          </svg>

          {/* Legend */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.7rem", color: colors.textMuted }}>
              <span>Klõpsa elemendil, et näha detaile</span>
            </div>
          </div>
        </motion.div>

        {/* Right: Layer details */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            padding: "20px",
            borderRadius: "20px",
            background: colors.backgroundLight,
            border: `1px solid ${colors.surface}`,
            display: "flex",
            flexDirection: "column",
            alignSelf: "stretch",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLayer}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "15px", flexShrink: 0 }}>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "12px",
                    background: `${layers[selectedLayer].color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.8rem",
                  }}
                >
                  {layers[selectedLayer].icon}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: layers[selectedLayer].color }}>
                    {layers[selectedLayer].name}
                  </h3>
                  {layers[selectedLayer].subtitle && (
                    <span style={{ fontSize: "0.85rem", color: colors.textMuted }}>
                      {layers[selectedLayer].subtitle}
                    </span>
                  )}
                </div>
              </div>

              <div
                style={{
                  fontSize: "0.85rem",
                  lineHeight: 1.8,
                  color: colors.text,
                  whiteSpace: "pre-line",
                  flex: 1,
                  overflow: "auto",
                  minHeight: 0,
                }}
              >
                {layers[selectedLayer].details}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom: Why database */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          marginTop: "20px",
          padding: "15px 20px",
          borderRadius: "16px",
          background: `${colors.primary}10`,
          border: `1px solid ${colors.primary}30`,
        }}
      >
        <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "12px", color: colors.primary }}>
          Miks on andmebaas vajalik?
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "10px" }}>
          {whyDatabase.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -3 }}
              style={{
                padding: "12px 10px",
                borderRadius: "10px",
                background: colors.surface,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "6px" }}>{item.icon}</div>
              <div style={{ fontSize: "0.75rem", fontWeight: 600, marginBottom: "4px" }}>{item.title}</div>
              <div style={{ fontSize: "0.65rem", color: colors.textMuted, lineHeight: 1.4 }}>
                {item.description}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
