import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "../styles";
import InfoButton from "../components/InfoButton";
import SQLHighlighter from "../components/SQLHighlighter";

const teacherGuide = `Selle slaidiga taoteldakse, et õpilased mõistaksid andmebaaside skaleerimise põhimõtteid ja oskaksid valida sobiva tehnika.

📌 Interaktiivsuse kasutamine:

• Klõpsa vasakul menüüs erinevatel skaleerimistehnikatel
• Paremal kuvatakse tehnika selgitus, näited ja toetavad andmebaasid
• Iga tehnika juures on praktiline koodinäide

🎯 Soovitused esitlemiseks:

1. Alusta küsimusega: "Mis juhtub, kui 1 miljon kasutajat üritab korraga sisse logida?"

2. VERTIKAALNE vs HORISONTAALNE:
   • Vertikaalne = suurem server (lihtsam, aga piiratud)
   • Horisontaalne = rohkem servereid (keerulisem, aga piiramatu)
   • Analoogia: suurem buss vs rohkem busse

3. TEHNIKAD DETAILSELT:

   Replikatsioon:
   • Primary-Replica: kirjutamine → primary, lugemine → replica'd
   • MySQL, PostgreSQL, MongoDB - kõik toetavad
   • Näide: e-pood, 90% on toodete vaatamine (lugemine)

   Sharding:
   • Andmete jagamine serverite vahel
   • Shard key valik on KRIITILINE (kasutaja_id, piirkond)
   • MongoDB toetab natiivselt, MySQL vajab ProxySQL

   Partitioning:
   • Ühe tabeli jagamine osadeks (range, list, hash)
   • Kiirendab päringuid, lihtsustab hooldust
   • Vana andmete arhiveerimine

   Connection Pooling:
   • Ühenduste taaskasutamine
   • PgBouncer, ProxySQL, HikariCP
   • VÄGA oluline veebirakendustes

   Caching:
   • Redis, Memcached vahemäluna
   • 95%+ päringuid vahemälust
   • Cache invalidation on RASKE probleem

4. PRAKTILINE NÄIDE:
   "Kuidas skaleerida Facebooki?"
   → Sharding kasutaja_id järgi
   → Read replica'd iga piirkonna jaoks
   → Redis sessioonide ja feed'i jaoks

💡 VIHJE: Alusta alati lihtsast (vertikaalne), skaleeri vastavalt vajadusele!`;

const scalingTechniques = [
  {
    name: "Vertikaalne skaleerimine",
    shortName: "Vertikaalne",
    icon: "⬆️",
    color: "#22c55e",
    description: "Serveri ressursside suurendamine (rohkem RAM-i, CPU tuumasid, kiiremat SSD-d). Kõige lihtsam viis, kuid füüsilised piirangud.",
    pros: ["Lihtne rakendada", "Pole vaja koodi muuta", "Üks server = lihtsam haldus"],
    cons: ["Füüsilised piirangud", "Kallis tippklassi riistvara", "Üks tõrkepunkt"],
    supportedBy: [
      { name: "MySQL", support: "full", note: "Kuni serveri piirideni" },
      { name: "PostgreSQL", support: "full", note: "Kuni serveri piirideni" },
      { name: "MongoDB", support: "full", note: "Kuni serveri piirideni" },
      { name: "Redis", support: "full", note: "Mälu on peamine piirang" },
      { name: "Oracle", support: "full", note: "RAC võimaldab suuri servereid" },
    ],
    example: {
      title: "AWS RDS näide",
      code: `-- Vertikaalne skaleerimine AWS-is
-- db.t3.micro → db.r5.4xlarge

-- Enne: 1 vCPU, 1 GB RAM
-- Pärast: 16 vCPU, 128 GB RAM

-- MySQL konfiguratsioon suuremale serverile:
[mysqld]
innodb_buffer_pool_size = 100G  -- 80% RAM-ist
innodb_log_file_size = 2G
max_connections = 1000
thread_cache_size = 100`,
    },
  },
  {
    name: "Horisontaalne skaleerimine",
    shortName: "Horisontaalne",
    icon: "↔️",
    color: "#3b82f6",
    description: "Serverite arvu suurendamine ja koormuse jagamine nende vahel. Teoreetiliselt piiramatu, kuid keerulisem arhitektuur.",
    pros: ["Piiramatu skaleeritavus", "Kõrge käideldavus", "Kulutõhus (tavalised serverid)"],
    cons: ["Keerulisem arhitektuur", "Andmete sünkroniseerimine", "Vajab koodi muudatusi"],
    supportedBy: [
      { name: "MySQL", support: "partial", note: "Vitess, ProxySQL abil" },
      { name: "PostgreSQL", support: "partial", note: "Citus, Patroni abil" },
      { name: "MongoDB", support: "full", note: "Natiivne sharding" },
      { name: "CockroachDB", support: "full", note: "Loodud hajusaks" },
      { name: "Cassandra", support: "full", note: "Loodud hajusaks" },
    ],
    example: {
      title: "Load balancer konfiguratsioon",
      code: `-- HAProxy konfiguratsioon MySQL'ile
# /etc/haproxy/haproxy.cfg

frontend mysql_front
    bind *:3306
    default_backend mysql_back

backend mysql_back
    balance roundrobin
    option mysql-check user haproxy
    server db1 10.0.0.1:3306 check
    server db2 10.0.0.2:3306 check
    server db3 10.0.0.3:3306 check`,
    },
  },
  {
    name: "Replikatsioon",
    shortName: "Replikatsioon",
    icon: "🔄",
    color: "#f59e0b",
    description: "Andmete kopeerimine mitmele serverile. Primary (master) võtab kirjutusi, Replica'd (slave'd) teenindavad lugemisi.",
    pros: ["Logemiste skaleerimine", "Kõrge käideldavus", "Geograafiline jaotus"],
    cons: ["Replikatsiooni viivitus", "Konfliktid multi-master korral", "Kirjutamist ei skaleeri"],
    supportedBy: [
      { name: "MySQL", support: "full", note: "Async, semi-sync, group replication" },
      { name: "PostgreSQL", support: "full", note: "Streaming, logical replication" },
      { name: "MongoDB", support: "full", note: "Replica sets" },
      { name: "MariaDB", support: "full", note: "Galera Cluster multi-master" },
      { name: "SQL Server", support: "full", note: "Always On Availability Groups" },
    ],
    example: {
      title: "MySQL Primary-Replica seadistus",
      code: `-- PRIMARY serveril (my.cnf):
[mysqld]
server-id = 1
log_bin = mysql-bin
binlog_format = ROW

-- REPLICA serveril (my.cnf):
[mysqld]
server-id = 2
relay_log = relay-bin
read_only = ON

-- Replica ühendamine PRIMARY-ga:
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST = '10.0.0.1',
  SOURCE_USER = 'repl_user',
  SOURCE_PASSWORD = 'salajane',
  SOURCE_LOG_FILE = 'mysql-bin.000001',
  SOURCE_LOG_POS = 4;

START REPLICA;
SHOW REPLICA STATUS\\G`,
    },
  },
  {
    name: "Sharding",
    shortName: "Sharding",
    icon: "🧩",
    color: "#ec4899",
    description: "Andmete horisontaalne jagamine mitme andmebaasi vahel shard key alusel. Iga shard sisaldab osa andmetest.",
    pros: ["Kirjutamise skaleerimine", "Väiksemad indeksid", "Paralleelne töötlemine"],
    cons: ["Keeruline JOIN", "Shard key valik kriitiline", "Tasakaalustamine vajalik"],
    supportedBy: [
      { name: "MongoDB", support: "full", note: "Natiivne sharding" },
      { name: "MySQL", support: "partial", note: "Vitess, ProxySQL" },
      { name: "PostgreSQL", support: "partial", note: "Citus laiendus" },
      { name: "CockroachDB", support: "full", note: "Automaatne sharding" },
      { name: "Cassandra", support: "full", note: "Partition key" },
    ],
    example: {
      title: "MongoDB sharding näide",
      code: `// MongoDB shardingu seadistus

// 1. Shardingu lubamine andmebaasile
sh.enableSharding("epood")

// 2. Shard key määramine kollektsioonile
sh.shardCollection(
  "epood.tellimused",
  { "kasutaja_id": "hashed" }  // Hash-põhine jaotus
)

// Alternatiiv: vahemiku-põhine (range)
sh.shardCollection(
  "epood.logid",
  { "kuupaev": 1 }  // Kuupäeva järgi
)

// 3. Shard'ide lisamine klastrisse
sh.addShard("rs1/mongo1:27017")
sh.addShard("rs2/mongo2:27017")
sh.addShard("rs3/mongo3:27017")

// Jaotuse vaatamine
db.tellimused.getShardDistribution()`,
    },
  },
  {
    name: "Partitioning",
    shortName: "Partitioning",
    icon: "📊",
    color: "#8b5cf6",
    description: "Ühe tabeli jagamine väiksemateks osadeks (partitsioonideks) ühe serveri piires. Kiirendab päringuid ja lihtsustab hooldust.",
    pros: ["Kiiremad päringud", "Lihtne vana andmete arhiveerimine", "Paralleelne hooldus"],
    cons: ["Ainult üks server", "Partitsioonivõtme valik oluline", "Mõned piirangud päringutele"],
    supportedBy: [
      { name: "MySQL", support: "full", note: "RANGE, LIST, HASH, KEY" },
      { name: "PostgreSQL", support: "full", note: "Declarative partitioning (v10+)" },
      { name: "Oracle", support: "full", note: "Kõige võimsam tugi" },
      { name: "SQL Server", support: "full", note: "Table partitioning" },
      { name: "MariaDB", support: "full", note: "Sama mis MySQL" },
    ],
    example: {
      title: "MySQL partitioning näide",
      code: `-- RANGE partitioning kuupäeva järgi
CREATE TABLE tellimused (
  id INT AUTO_INCREMENT,
  kasutaja_id INT,
  summa DECIMAL(10,2),
  loodud DATE,
  PRIMARY KEY (id, loodud)
)
PARTITION BY RANGE (YEAR(loodud)) (
  PARTITION p2022 VALUES LESS THAN (2023),
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p_future VALUES LESS THAN MAXVALUE
);

-- Vana partitsiooni eemaldamine (kiire!)
ALTER TABLE tellimused DROP PARTITION p2022;

-- Uue partitsiooni lisamine
ALTER TABLE tellimused REORGANIZE PARTITION p_future
INTO (
  PARTITION p2025 VALUES LESS THAN (2026),
  PARTITION p_future VALUES LESS THAN MAXVALUE
);`,
    },
  },
  {
    name: "Connection Pooling",
    shortName: "Pooling",
    icon: "🔌",
    color: "#06b6d4",
    description: "Andmebaasiühenduste taaskasutamine, et vältida iga päringu jaoks uue ühenduse loomist. Kriitiliselt oluline veebirakendustes.",
    pros: ["Vähem ühenduste overhead", "Kiirem vastus", "Vähem serveri koormust"],
    cons: ["Vajab seadistamist", "Ühenduse lekked võimalikud", "Transaktsioonide haldus keerulisem"],
    supportedBy: [
      { name: "PostgreSQL", support: "full", note: "PgBouncer, Pgpool-II" },
      { name: "MySQL", support: "full", note: "ProxySQL, MySQL Router" },
      { name: "Oracle", support: "full", note: "UCP, HikariCP" },
      { name: "SQL Server", support: "full", note: "ADO.NET sisseehitatud" },
      { name: "MongoDB", support: "full", note: "Driver sisseehitatud" },
    ],
    example: {
      title: "PgBouncer konfiguratsioon",
      code: `-- PgBouncer konfiguratsioon (pgbouncer.ini)
[databases]
mydb = host=127.0.0.1 port=5432 dbname=mydb

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt

-- Pool režiimid:
pool_mode = transaction  -- Parim veebile
-- pool_mode = session   -- Pikad sessioonid
-- pool_mode = statement -- Ainult lihtsad päringud

-- Ühenduste piirangud:
max_client_conn = 1000    -- Klientide max
default_pool_size = 20    -- Ühendusi DB-ga
reserve_pool_size = 5     -- Reserv tipuks
reserve_pool_timeout = 3  -- Reservi timeout

-- HikariCP (Java) näide:
-- spring.datasource.hikari.maximum-pool-size=20
-- spring.datasource.hikari.minimum-idle=5`,
    },
  },
  {
    name: "Caching",
    shortName: "Caching",
    icon: "⚡",
    color: "#ef4444",
    description: "Sageli kasutatavate andmete hoidmine kiires mälupõhises vahemälus (Redis, Memcached). Vähendab andmebaasi koormust 90%+.",
    pros: ["Ülikiire vastus (<1ms)", "Vähendab DB koormust", "Skaleerib lugemisi"],
    cons: ["Cache invalidation keeruline", "Mälukulu", "Andmete aegumise haldus"],
    supportedBy: [
      { name: "Redis", support: "full", note: "Populaarseim, andmestruktuurid" },
      { name: "Memcached", support: "full", note: "Lihtsam, ainult key-value" },
      { name: "MySQL", support: "partial", note: "Query cache (deprecated)" },
      { name: "PostgreSQL", support: "partial", note: "Shared buffers" },
      { name: "MongoDB", support: "partial", note: "WiredTiger cache" },
    ],
    example: {
      title: "Redis caching pattern",
      code: `-- Cache-Aside pattern (Python pseudokood)

def get_user(user_id):
    # 1. Proovi vahemälust
    cache_key = f"user:{user_id}"
    cached = redis.get(cache_key)

    if cached:
        return json.loads(cached)

    # 2. Kui pole, loe andmebaasist
    user = db.query(
        "SELECT * FROM users WHERE id = %s",
        user_id
    )

    # 3. Salvesta vahemällu (TTL 1h)
    redis.setex(
        cache_key,
        3600,  -- 1 tund
        json.dumps(user)
    )

    return user

-- Cache invalidation UPDATE korral:
def update_user(user_id, data):
    db.query("UPDATE users SET ... WHERE id=%s")
    redis.delete(f"user:{user_id}")  -- Kustuta cache`,
    },
  },
];

const SupportBadge = ({ support }: { support: string }) => {
  const config = {
    full: { bg: "#22c55e30", color: "#22c55e", text: "Täielik" },
    partial: { bg: "#f59e0b30", color: "#f59e0b", text: "Osaline" },
    none: { bg: "#ef444430", color: "#ef4444", text: "Puudub" },
  }[support] || { bg: "#64748b30", color: "#64748b", text: "?" };

  return (
    <span style={{
      padding: "2px 8px",
      borderRadius: "4px",
      background: config.bg,
      color: config.color,
      fontSize: "0.7rem",
      fontWeight: 600,
    }}>
      {config.text}
    </span>
  );
};

export default function ScalingTechniques() {
  const [activeTechnique, setActiveTechnique] = useState(0);

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
        Skaleerimistehnikad
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          textAlign: "center",
          color: colors.textMuted,
          marginBottom: "30px",
          fontSize: "1.1rem",
        }}
      >
        Kuidas käsitleda miljoneid kasutajaid ja terabaite andmeid
      </motion.p>

      <div style={{ display: "flex", gap: "25px" }}>
        {/* Technique selector */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            minWidth: "180px",
          }}
        >
          {scalingTechniques.map((tech, index) => (
            <motion.button
              key={tech.name}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTechnique(index)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 14px",
                borderRadius: "10px",
                border: "none",
                background: activeTechnique === index ? tech.color : colors.backgroundLight,
                cursor: "pointer",
                transition: "all 0.3s",
                textAlign: "left",
              }}
            >
              <span style={{ fontSize: "1.3rem" }}>{tech.icon}</span>
              <span style={{
                color: colors.text,
                fontWeight: activeTechnique === index ? 600 : 400,
                fontSize: "0.85rem",
              }}>
                {tech.shortName}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* Technique content */}
        <div style={{ flex: 1 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTechnique}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              {/* Header and description */}
              <div style={{
                padding: "18px",
                borderRadius: "14px",
                background: colors.backgroundLight,
                border: `2px solid ${scalingTechniques[activeTechnique].color}40`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "2rem" }}>{scalingTechniques[activeTechnique].icon}</span>
                  <h3 style={{
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: scalingTechniques[activeTechnique].color,
                  }}>
                    {scalingTechniques[activeTechnique].name}
                  </h3>
                </div>
                <p style={{ color: colors.text, fontSize: "0.9rem", lineHeight: 1.6 }}>
                  {scalingTechniques[activeTechnique].description}
                </p>
              </div>

              {/* Pros and Cons */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{
                  padding: "14px",
                  borderRadius: "12px",
                  background: "#22c55e15",
                  border: "1px solid #22c55e40",
                }}>
                  <div style={{ fontWeight: 600, marginBottom: "8px", color: "#22c55e", fontSize: "0.85rem" }}>
                    ✅ Eelised
                  </div>
                  {scalingTechniques[activeTechnique].pros.map((pro, i) => (
                    <div key={i} style={{ fontSize: "0.8rem", marginBottom: "4px", color: colors.text }}>
                      • {pro}
                    </div>
                  ))}
                </div>
                <div style={{
                  padding: "14px",
                  borderRadius: "12px",
                  background: "#ef444415",
                  border: "1px solid #ef444440",
                }}>
                  <div style={{ fontWeight: 600, marginBottom: "8px", color: "#ef4444", fontSize: "0.85rem" }}>
                    ❌ Puudused
                  </div>
                  {scalingTechniques[activeTechnique].cons.map((con, i) => (
                    <div key={i} style={{ fontSize: "0.8rem", marginBottom: "4px", color: colors.text }}>
                      • {con}
                    </div>
                  ))}
                </div>
              </div>

              {/* Supported databases */}
              <div style={{
                padding: "14px",
                borderRadius: "12px",
                background: colors.backgroundLight,
                border: `1px solid ${colors.surface}`,
              }}>
                <div style={{ fontWeight: 600, marginBottom: "10px", fontSize: "0.85rem" }}>
                  🗄️ DBMS tugi
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {scalingTechniques[activeTechnique].supportedBy.map((db, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "8px",
                        background: colors.surface,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: "0.8rem" }}>{db.name}</span>
                      <SupportBadge support={db.support} />
                      <span style={{ fontSize: "0.7rem", color: colors.textMuted }}>{db.note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code example */}
              <div style={{
                borderRadius: "12px",
                background: "#1a1a2e",
                border: `1px solid ${colors.surface}`,
                overflow: "hidden",
              }}>
                <div style={{
                  padding: "10px 14px",
                  borderBottom: `1px solid ${colors.surface}`,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ff5f56" }} />
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffbd2e" }} />
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#27ca40" }} />
                  <span style={{ marginLeft: "8px", color: colors.textMuted, fontSize: "0.8rem" }}>
                    {scalingTechniques[activeTechnique].example.title}
                  </span>
                </div>
                <div style={{ padding: "14px", maxHeight: "200px", overflow: "auto" }}>
                  <SQLHighlighter
                    code={scalingTechniques[activeTechnique].example.code}
                    fontSize="0.75rem"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
