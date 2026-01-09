import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "../styles";
import InfoButton from "../components/InfoButton";
import SQLHighlighter from "../components/SQLHighlighter";

const teacherGuide = `Selle slaidiga taoteldakse, et õpilased mõistaksid SQL keele ajalugu, standardeid ja erinevate andmebaaside dialekte.

📌 Interaktiivsuse kasutamine:

• AJATELG - näitab SQL arengu olulisi verstaposte
• STANDARDID - klõpsa, et näha, mida iga standard lisas
• DIALEKTID - näitab erinevusi PostgreSQL, MySQL, Oracle vahel

🎯 Põhjalik esitlusjuhend:

1️⃣ AJALUGU (3-4 min):
   • 1970 - Edgar F. Codd (IBM) leiutas relatsioonimudelil
   • 1974 - SEQUEL (Structured English Query Language) IBM-is
   • 1979 - Oracle esimene kommertstarkvara
   • 1986 - ANSI standard (SQL-86)

   KÜSIMUS: "Miks on SQL 50+ aastat vana, aga ikka kasutusel?"
   → Lihtne, deklaratiivne, standardiseeritud

2️⃣ STANDARDID (4-5 min):
   Klõpsa igal standardil, et näha uusi funktsioone!

   SQL-92: JOIN süntaks, CASE, CAST
   → Ennem: WHERE a.id = b.id
   → Pärast: JOIN ... ON a.id = b.id

   SQL:1999: CTE-d (WITH), trigerid, regulaaravaldised
   SQL:2003: XML, aknapäringud (ROW_NUMBER, RANK)
   SQL:2011: Temporaalsed tabelid!
   SQL:2016: JSON tugi

3️⃣ DIALEKTID (5 min):
   "SQL on nagu inglise keel - britid ja ameeriklased räägivad erinevalt"

   NÄITED:
   • LIMIT vs FETCH FIRST vs ROWNUM
   • AUTO_INCREMENT vs SERIAL vs IDENTITY
   • || vs CONCAT() vs +
   • ILIKE vs UPPER(col) LIKE

   KÜSIMUS: "Miks on dialektid olemas?"
   → Ajaloolised põhjused, konkurentsieelised, erinevad vajadused

4️⃣ PRAKTILINE ÕPPETUND:
   • Kui kirjutate SQL-i, kontrollige, millist dialekti kasutate
   • ORM-id (Hibernate, Sequelize) aitavad dialektide vahel tõlkida
   • Eelistage standardset SQL-i, kui võimalik

❓ KÜSIMUSED ÕPILASTELE:

• "Mis on deklaratiivse keele eelis?"
  → Ütled MIDA tahad, mitte KUIDAS seda teha

• "Miks kasutavad firmad erinevaid andmebaase?"
  → Ajalugu, maksumus, spetsialiseerumine

• "Kuidas tagada, et SQL töötab mitmes andmebaasis?"
  → Kasuta standardset SQL-i, testi erinevates keskkondades

💡 KOKKUVÕTE:
• SQL on 50+ aastat vana, aga endiselt dominant
• Standardid lisavad uusi funktsioone iga paari aasta tagant
• Dialektid on reaalsus - peab teadma, millist kasutate`;

const timeline = [
  {
    year: "1970",
    event: "Relatsiooniline mudel",
    desc: "Edgar F. Codd (IBM) avaldab relatsiooniandmebaaside teooria",
    icon: "📜",
    personPhoto: "https://upload.wikimedia.org/wikipedia/en/5/58/Edgar_F_Codd.jpg",
    personName: "Edgar F. Codd",
    details: `Edgar Frank Codd (1923-2003) oli Briti arvutiteadlane IBM-is, kes 1970. aastal avaldas revolutsioonilise artikli "A Relational Model of Data for Large Shared Data Banks".

🔑 PÕHIIDEED:
• Andmed esitatakse tabelitena (relatsioonidena)
• Andmete vahel on seosed võtmete kaudu
• SQL-i matemaatiline alus: relatsiooniline algebra

📊 MÕJU:
• Lõi aluse KÕIGILE kaasaegsetele SQL andmebaasidele
• Sai 1981. aastal ACM Turing Award'i
• IBM esialgu EI rakendanud tema ideid (sisepoliitika!)
• Larry Ellison (Oracle) kasutas Codd'i ideid ENNE IBM-i`
  },
  {
    year: "1974",
    event: "SEQUEL",
    desc: "IBM loob SEQUEL keele (hiljem SQL)",
    icon: "💻",
    personPhoto: "https://upload.wikimedia.org/wikipedia/commons/6/62/Don_Chamberlin_%28cropped%29.jpg",
    personName: "Donald Chamberlin",
    details: `SEQUEL (Structured English Query Language) loodi IBM-i San Jose uurimislaboris Donald Chamberlin'i ja Raymond Boyce'i poolt.

🔧 DISAINI EESMÄRGID:
• Lihtne kasutada ka mitte-programmeerijatel
• Inglise keelele sarnane süntaks
• Deklaratiivne: kirjelda MIDA, mitte KUIDAS

📝 NIME MUUTUS:
• "SEQUEL" oli kaubamärgina juba registreeritud
• Muudeti "SQL"-iks (hääldus jäi "see-kwel")
• Mõned ütlevad "S-Q-L", mõned "sequel"

💡 RAYMOND BOYCE suri 1974, vaid 26-aastasena, enne kui nägi SQL-i edu.`
  },
  {
    year: "1979",
    event: "Oracle v2",
    desc: "Esimene kommerts-SQL andmebaas",
    icon: "🔴",
    personPhoto: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Larry_Ellison_picture.png/440px-Larry_Ellison_picture.png",
    personName: "Larry Ellison",
    details: `Larry Ellison, Bob Miner ja Ed Oates asutasid Software Development Laboratories (hiljem Oracle Corporation) 1977. aastal.

🚀 ORACLE V2:
• Esimene kommerts-SQL andmebaas (1979)
• Kirjutatud assembleris, 128KB mäluga
• Versioon 1 oli prototüüp, ei müüdud kunagi
• CIA oli üks esimesi kliente!

💰 ÄRISTRATEEGIA:
• Ellison luges Codd'i artiklit ja ehitas ENNE IBM-i
• IBM System R oli uurimisprojekt, mitte toode
• Oracle sai turueelise standardse SQL-iga

📈 TULEMUS:
• Oracle on täna ~$300 miljardi väärtuses ettevõte
• Larry Ellison üks maailma rikkamaid inimesi`
  },
  {
    year: "1986",
    event: "SQL-86",
    desc: "Esimene ANSI/ISO standard",
    icon: "📋",
    details: `SQL-86 (ka SQL-87) oli esimene ametlik ANSI (American National Standards Institute) standard SQL-i jaoks.

📋 STANDARDISEERIMISE PÕHJUSED:
• Mitmed tootjad (Oracle, IBM, Ingres) tekitasid killustumist
• Kliendid tahtsid porditavust
• Valitsusasutused nõudsid standardeid

🔧 SQL-86 SISU:
• Põhilised SELECT, INSERT, UPDATE, DELETE
• WHERE tingimused
• CREATE TABLE, DROP TABLE
• GRANT ja REVOKE õigused

⚠️ PUUDUSED:
• Väga minimaalne (umbes 100 lehekülge)
• Puudusid JOIN-id, tüübiteisendused, NULL-i käsitlus ebaselge
• Iga tootja lisas oma laiendusi`
  },
  {
    year: "1992",
    event: "SQL-92",
    desc: "JOIN süntaks, CASE, tüübiteisendused",
    icon: "🔗",
    details: `SQL-92 (ka SQL2) oli suur uuendus - 600+ lehekülge (vs SQL-86 ~100 lk).

🔗 OLULISIMAD UUENDUSED:

1. JOIN SÜNTAKS:
   Vana: SELECT * FROM a, b WHERE a.id = b.id
   Uus:  SELECT * FROM a JOIN b ON a.id = b.id

2. OUTER JOIN-id:
   LEFT JOIN, RIGHT JOIN, FULL OUTER JOIN

3. CASE avaldis:
   CASE WHEN tingimus THEN väärtus ELSE väärtus END

4. CAST tüübiteisendus:
   CAST(veerg AS INTEGER)

5. Stringifunktsioonid:
   SUBSTRING, TRIM, UPPER, LOWER

📊 KOLM TASET:
• Entry - minimaalne nõue
• Intermediate - keskmine
• Full - täielik (keegi ei implementeerinud!)

💡 SQL-92 on siiani kõige laialdasemalt toetatud standard!`
  },
  {
    year: "1999",
    event: "SQL:1999",
    desc: "CTE-d, trigerid, rekursioon",
    icon: "🔄",
    details: `SQL:1999 (ka SQL3) tõi objektrelatsioonilised võimalused ja protseduurilise programmeerimise.

🔄 PEAMISED UUENDUSED:

1. CTE-d (Common Table Expressions):
   WITH päring AS (SELECT ...) SELECT * FROM päring;

2. Rekursiivsed päringud:
   WITH RECURSIVE - hierarhiate ja graafide jaoks!

3. TRIGERID:
   Automaatsed toimingud INSERT/UPDATE/DELETE korral

4. Kasutaja defineeritud tüübid:
   CREATE TYPE aadress AS (tänav VARCHAR, linn VARCHAR);

5. Rollid turvalisuses:
   CREATE ROLE, GRANT TO ROLE

📈 REGULAARAVALDISED:
   SIMILAR TO ja LIKE_REGEX (erinev toetus!)

⚠️ PROBLEEMID:
• Väga keeruline (1000+ lehekülge)
• Tootjad implementeerisid valikuliselt
• Dialektid hakkasid lahknema`
  },
  {
    year: "2003",
    event: "SQL:2003",
    desc: "XML, aknapäringud, MERGE",
    icon: "🪟",
    details: `SQL:2003 keskendus XML integratsioonile ja analüütikale.

🪟 AKNAPÄRINGUD (Window Functions):
Revolutsiooniline võimalus analüütikaks!

ROW_NUMBER() OVER (ORDER BY palk DESC)
RANK() OVER (PARTITION BY osakond ORDER BY palk)
SUM(palk) OVER (ORDER BY kuupäev ROWS BETWEEN 3 PRECEDING AND CURRENT ROW)

📊 KASUTUSJUHTUMID:
• Top N päringud
• Liikuvad keskmised
• Aruandlus ja BI

🔀 MERGE käsk (UPSERT):
MERGE INTO siht USING allikas ON tingimus
WHEN MATCHED THEN UPDATE ...
WHEN NOT MATCHED THEN INSERT ...

📄 XML/SQL:
• XMLTYPE andmetüüp
• XMLQUERY, XMLTABLE funktsioonid
• XML Schema valideerimine

💡 Aknapäringud on üks KÕIGE kasulikumaid SQL funktsioone - kindlasti õppida!`
  },
  {
    year: "2011",
    event: "SQL:2011",
    desc: "Temporaalsed tabelid",
    icon: "⏰",
    details: `SQL:2011 lisas ametliku toe temporaalsetele andmetele - üks kauaoodatumaid funktsioone!

⏰ TEMPORAALSED TABELID:

1. SYSTEM-VERSIONED:
   Süsteem jälgib automaatselt, millal rida lisati/muudeti
   CREATE TABLE t (...) WITH SYSTEM VERSIONING;

2. APPLICATION-TIME:
   Rakendus määrab kehtivusaja
   PERIOD FOR valid_time (start_date, end_date)

3. BITEMPORAALNE:
   Kombineerib mõlemad - täielik ajalugu!

📊 PÄRINGUD:
• FOR SYSTEM_TIME AS OF '2020-01-01'
• FOR SYSTEM_TIME BETWEEN ... AND ...
• FOR SYSTEM_TIME ALL

💼 KASUTUSJUHTUMID:
• Pangad ja kindlustus (audit)
• Meditsiinilised andmed
• Hinnamuutuste ajalugu
• GDPR - "õigus unustamisele" keerulisem!

⚠️ TOETUS: PostgreSQL ei toeta natiivselt, MariaDB ja SQL Server toetavad.`
  },
  {
    year: "2016",
    event: "SQL:2016",
    desc: "JSON tugi, polümorfism",
    icon: "📦",
    details: `SQL:2016 lisas JSON toe, vastuseks NoSQL andmebaaside populaarsusele.

📦 JSON FUNKTSIOONID:

1. JSON_VALUE - skalaarvärtuse väljatõmbamine:
   JSON_VALUE(dokument, '$.nimi')

2. JSON_QUERY - objekti/massiivi väljatõmbamine:
   JSON_QUERY(dokument, '$.aadress')

3. JSON_TABLE - JSON massiivi tabeliks:
   JSON_TABLE(dokument, '$.tooted[*]' COLUMNS (...))

4. JSON_EXISTS - olemasolu kontroll:
   JSON_EXISTS(dokument, '$.email')

🔧 LISTAGG:
Stringide agregeerimine:
SELECT osakond, LISTAGG(nimi, ', ') FROM ...

📊 POLÜMORFSED TABELIFUNKTSIOONID:
Dünaamilised veergude komplektid - kasulik ETL-is.

💡 MIKS OLULINE:
• SQL ja NoSQL koonduvad
• Paindlikud andmed SQL andmebaasis
• PostgreSQL JSONB on eriti võimas
• MongoDB vastulöök: SQL-laadne aggregatsioon`
  },
];

const standards = [
  {
    name: "SQL-92",
    year: "1992",
    features: [
      {
        name: "JOIN ... ON süntaks",
        example: `SELECT k.nimi, t.summa
FROM kliendid k
JOIN tellimused t
  ON k.id = t.klient_id
WHERE t.summa > 100;`,
        result: [
          ["nimi", "summa"],
          ["Mari", "150.00"],
          ["Jaan", "200.00"],
        ],
      },
      {
        name: "CASE avaldis",
        example: `SELECT nimi,
  CASE
    WHEN vanus < 18 THEN 'Alaealine'
    WHEN vanus < 65 THEN 'Täiskasvanu'
    ELSE 'Pensionär'
  END AS vanusegrupp
FROM isikud;`,
        result: [
          ["nimi", "vanusegrupp"],
          ["Mia", "Alaealine"],
          ["Mari", "Täiskasvanu"],
          ["Ants", "Pensionär"],
        ],
      },
      {
        name: "CAST tüübiteisendus",
        example: `SELECT
  CAST(hind AS DECIMAL(10,2)) AS hind,
  CAST(kogus AS CHAR) AS kogus_tekst
FROM tooted;`,
        result: [
          ["hind", "kogus_tekst"],
          ["19.99", "5"],
          ["149.00", "12"],
        ],
      },
      {
        name: "Stringifunktsioonid",
        example: `SELECT
  UPPER(nimi) AS suurtahed,
  LOWER(email) AS email,
  SUBSTRING(telefon, 1, 3) AS suund
FROM kliendid;`,
        result: [
          ["suurtahed", "email", "suund"],
          ["MARI", "mari@test.ee", "372"],
          ["JAAN", "jaan@test.ee", "371"],
        ],
      },
      {
        name: "Alamotsed (subqueries)",
        example: `SELECT nimi, hind FROM tooted
WHERE hind > (
  SELECT AVG(hind) FROM tooted
);`,
        result: [
          ["nimi", "hind"],
          ["Sülearvuti", "899.00"],
          ["Telefon", "599.00"],
        ],
      },
    ],
  },
  {
    name: "SQL:1999",
    year: "1999",
    features: [
      {
        name: "WITH (CTE)",
        example: `WITH suured_tellimused AS (
  SELECT id, summa
  FROM tellimused
  WHERE summa > 1000
)
SELECT * FROM suured_tellimused;`,
        result: [
          ["id", "summa"],
          ["5", "1500.00"],
          ["8", "2300.00"],
          ["12", "1100.00"],
        ],
      },
      {
        name: "Rekursiivsed päringud",
        example: `WITH RECURSIVE alamad AS (
  SELECT id, nimi, 1 AS tase
  FROM tootajad
  WHERE juht_id IS NULL
  UNION ALL
  SELECT t.id, t.nimi, a.tase + 1
  FROM tootajad t
  JOIN alamad a ON t.juht_id = a.id
)
SELECT * FROM alamad;`,
        result: [
          ["id", "nimi", "tase"],
          ["1", "Peeter (CEO)", "1"],
          ["2", "Mari (CTO)", "2"],
          ["5", "Jaan (dev)", "3"],
        ],
      },
      {
        name: "Trigerid",
        example: `CREATE TRIGGER audit_log
AFTER UPDATE ON kasutajad
FOR EACH ROW
INSERT INTO audit
  (tabel, kirje_id, muudetud)
VALUES
  ('kasutajad', NEW.id, NOW());`,
        result: [
          ["tabel", "kirje_id", "muudetud"],
          ["kasutajad", "5", "2024-01-15 10:30"],
        ],
      },
      {
        name: "Kasutajatüübid",
        example: `-- JSON alternatiiv MySQL-is
INSERT INTO kliendid
  (nimi, aadress)
VALUES (
  'Mari',
  '{"tanav":"Tamme 5",
    "linn":"Tartu"}'
);`,
        result: [
          ["nimi", "aadress"],
          ["Mari", '{"tanav":"Tamme 5"...}'],
        ],
      },
      {
        name: "ROLLUP, CUBE",
        example: `SELECT osakond, amet,
  SUM(palk) AS kokku
FROM tootajad
GROUP BY osakond, amet
WITH ROLLUP;`,
        result: [
          ["osakond", "amet", "kokku"],
          ["IT", "arendaja", "5000"],
          ["IT", "NULL", "7000"],
          ["NULL", "NULL", "15000"],
        ],
      },
    ],
  },
  {
    name: "SQL:2003",
    year: "2003",
    features: [
      {
        name: "Aknapäringud",
        example: `SELECT nimi, osakond, palk,
  AVG(palk) OVER (
    PARTITION BY osakond
  ) AS osk_keskmine
FROM tootajad;`,
        result: [
          ["nimi", "osakond", "palk", "osk_keskmine"],
          ["Mari", "IT", "3000", "2750"],
          ["Jaan", "IT", "2500", "2750"],
          ["Kati", "Müük", "2800", "2800"],
        ],
      },
      {
        name: "ROW_NUMBER, RANK",
        example: `SELECT nimi, palk,
  ROW_NUMBER() OVER (
    ORDER BY palk DESC
  ) AS koht
FROM tootajad;`,
        result: [
          ["nimi", "palk", "koht"],
          ["Mari", "3000", "1"],
          ["Kati", "2800", "2"],
          ["Jaan", "2500", "3"],
        ],
      },
      {
        name: "MERGE käsk",
        example: `-- MySQL alternatiiv:
INSERT INTO siht (id, nimi)
VALUES (1, 'Test')
ON DUPLICATE KEY UPDATE
  nimi = VALUES(nimi);`,
        result: [
          ["id", "nimi"],
          ["1", "Test"],
        ],
      },
      {
        name: "XML funktsioonid",
        example: `SELECT ExtractValue(
  '<raamat>
    <pealkiri>SQL</pealkiri>
  </raamat>',
  '/raamat/pealkiri'
) AS pealkiri;`,
        result: [
          ["pealkiri"],
          ["SQL"],
        ],
      },
      {
        name: "MULTISET",
        example: `SELECT osakond,
  JSON_ARRAYAGG(nimi) AS tootajad
FROM tootajad
GROUP BY osakond;`,
        result: [
          ["osakond", "tootajad"],
          ["IT", '["Mari","Jaan"]'],
          ["Müük", '["Kati"]'],
        ],
      },
    ],
  },
  {
    name: "SQL:2011",
    year: "2011",
    features: [
      {
        name: "Temporaalsed tabelid",
        example: `CREATE TABLE hinnad_ajalugu (
  toode_id INT,
  hind DECIMAL(10,2),
  kehtiv_alates DATETIME,
  kehtiv_kuni DATETIME
);`,
        result: [
          ["toode_id", "hind", "kehtiv_alates", "kehtiv_kuni"],
          ["1", "99.00", "2024-01-01", "2024-06-01"],
          ["1", "89.00", "2024-06-01", "NULL"],
        ],
      },
      {
        name: "PERIOD FOR",
        example: `CREATE TABLE lepingud (
  id INT PRIMARY KEY,
  klient_id INT,
  algus DATE NOT NULL,
  lopp DATE
);`,
        result: [
          ["id", "klient_id", "algus", "lopp"],
          ["1", "100", "2024-01-01", "2024-12-31"],
          ["2", "101", "2024-03-15", "NULL"],
        ],
      },
      {
        name: "Süsteemiversioonid",
        example: `CREATE TABLE audit_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tabel_nimi VARCHAR(50),
  kirje_id INT,
  toiming VARCHAR(10),
  muudetud TIMESTAMP
);`,
        result: [
          ["id", "tabel_nimi", "kirje_id", "toiming"],
          ["1", "kasutajad", "5", "UPDATE"],
          ["2", "tooted", "12", "DELETE"],
        ],
      },
      {
        name: "Ajaloolised päringud",
        example: `SELECT * FROM hinnad_ajalugu
WHERE toode_id = 1
  AND kehtiv_alates <= '2024-03-15'
  AND (kehtiv_kuni IS NULL
    OR kehtiv_kuni > '2024-03-15');`,
        result: [
          ["toode_id", "hind", "kehtiv_alates"],
          ["1", "99.00", "2024-01-01"],
        ],
      },
      {
        name: "AS OF süntaks",
        example: `-- MariaDB näide:
SELECT * FROM tooted
FOR SYSTEM_TIME
AS OF '2024-01-15';`,
        result: [
          ["id", "nimi", "hind"],
          ["1", "Arvuti", "899.00"],
          ["2", "Hiir", "29.00"],
        ],
      },
    ],
  },
  {
    name: "SQL:2016",
    year: "2016",
    features: [
      {
        name: "JSON funktsioonid",
        example: `SELECT
  id,
  andmed->>'$.nimi' AS nimi,
  andmed->>'$.email' AS email
FROM kliendid;`,
        result: [
          ["id", "nimi", "email"],
          ["1", "Mari", "mari@test.ee"],
          ["2", "Jaan", "jaan@test.ee"],
        ],
      },
      {
        name: "JSON_TABLE",
        example: `SELECT jt.* FROM tellimused,
JSON_TABLE(tooted, '$[*]'
  COLUMNS (
    nimi VARCHAR(100) PATH '$.nimi',
    kogus INT PATH '$.kogus'
  )
) AS jt;`,
        result: [
          ["nimi", "kogus"],
          ["Arvuti", "1"],
          ["Hiir", "2"],
          ["Klaviatuur", "1"],
        ],
      },
      {
        name: "Polümorfne tabel",
        example: `-- Dünaamiline SQL
SET @sql = CONCAT(
  'SELECT ', @veerud,
  ' FROM raport'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;`,
        result: [
          ["nimi", "summa"],
          ["Mari", "1500"],
          ["Jaan", "2300"],
        ],
      },
      {
        name: "Reataseme turvalisus",
        example: `CREATE VIEW minu_andmed AS
SELECT * FROM tellimused
WHERE kasutaja_id = @uid;

SET @uid = 123;
SELECT * FROM minu_andmed;`,
        result: [
          ["id", "summa", "kasutaja_id"],
          ["5", "150.00", "123"],
          ["8", "299.00", "123"],
        ],
      },
      {
        name: "LISTAGG",
        example: `SELECT osakond,
  GROUP_CONCAT(
    nimi ORDER BY nimi
    SEPARATOR ', '
  ) AS tootajad
FROM tootajad
GROUP BY osakond;`,
        result: [
          ["osakond", "tootajad"],
          ["IT", "Jaan, Mari"],
          ["Müük", "Kati, Peeter"],
        ],
      },
    ],
  },
];

const dialects = [
  {
    feature: "Piirangu seadmine",
    postgresql: "LIMIT 10",
    mysql: "LIMIT 10",
    oracle: "FETCH FIRST 10 ROWS ONLY",
    mssql: "TOP 10",
  },
  {
    feature: "Auto-ID veerg",
    postgresql: "SERIAL / IDENTITY",
    mysql: "AUTO_INCREMENT",
    oracle: "IDENTITY / SEQUENCE",
    mssql: "IDENTITY(1,1)",
  },
  {
    feature: "Stringi ühendamine",
    postgresql: "|| (operaator)",
    mysql: "CONCAT()",
    oracle: "|| (operaator)",
    mssql: "+ (operaator)",
  },
  {
    feature: "Tõstutundetu otsing",
    postgresql: "ILIKE",
    mysql: "LIKE (vaikimisi)",
    oracle: "UPPER() + LIKE",
    mssql: "LIKE (vaikimisi)",
  },
  {
    feature: "Praegune aeg",
    postgresql: "NOW() / CURRENT_TIMESTAMP",
    mysql: "NOW() / CURRENT_TIMESTAMP",
    oracle: "SYSDATE / SYSTIMESTAMP",
    mssql: "GETDATE() / SYSDATETIME()",
  },
  {
    feature: "UPSERT",
    postgresql: "ON CONFLICT DO UPDATE",
    mysql: "ON DUPLICATE KEY UPDATE",
    oracle: "MERGE INTO",
    mssql: "MERGE INTO",
  },
];

export default function SQLHistory() {
  const [selectedStandard, setSelectedStandard] = useState<number | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<number>(0);
  const [selectedTimelineEvent, setSelectedTimelineEvent] = useState<number | null>(null);

  return (
    <div style={{ width: "100%", maxWidth: "1200px" }}>
      <InfoButton content={teacherGuide} />
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: "2.8rem",
          fontWeight: 700,
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        SQL Ajalugu ja Dialektid
      </motion.h2>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          marginBottom: "15px",
          padding: "15px 20px",
          borderRadius: "16px",
          background: colors.backgroundLight,
          border: `1px solid ${colors.surface}`,
        }}
      >
        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "15px", color: colors.primary }}>
          SQL Ajalugu (klõpsa ikoonil!)
        </h3>
        <div style={{ display: "flex", alignItems: "flex-start", overflowX: "auto", gap: "5px", paddingBottom: "5px" }}>
          {timeline.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTimelineEvent(selectedTimelineEvent === index ? null : index)}
              style={{
                minWidth: "100px",
                textAlign: "center",
                position: "relative",
                cursor: "pointer",
                padding: "8px 5px",
                borderRadius: "10px",
                background: selectedTimelineEvent === index ? `${colors.primary}30` : "transparent",
                border: selectedTimelineEvent === index ? `2px solid ${colors.primary}` : "2px solid transparent",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "3px" }}>{item.icon}</div>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: colors.primary }}>{item.year}</div>
              <div style={{ fontSize: "0.65rem", fontWeight: 600, marginBottom: "2px" }}>{item.event}</div>
              {index < timeline.length - 1 && (
                <div style={{
                  position: "absolute",
                  top: "22px",
                  right: "-5px",
                  width: "10px",
                  height: "2px",
                  background: colors.primary,
                }} />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Timeline Event Details (inline, not modal) */}
      <AnimatePresence>
        {selectedTimelineEvent !== null && (
          <motion.div
            key="timeline-detail-box"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              marginBottom: "15px",
              padding: "18px",
              borderRadius: "16px",
              background: `${colors.primary}10`,
              border: `2px solid ${colors.primary}40`,
              overflow: "hidden",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`timeline-content-${selectedTimelineEvent}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ display: "flex", gap: "20px" }}
              >
                {/* Person photo if available */}
                {timeline[selectedTimelineEvent].personPhoto && (
                  <div style={{ flexShrink: 0 }}>
                    <img
                      src={timeline[selectedTimelineEvent].personPhoto}
                      alt={timeline[selectedTimelineEvent].personName || ""}
                      style={{
                        width: "90px",
                        height: "110px",
                        objectFit: "cover",
                        borderRadius: "10px",
                        border: `2px solid ${colors.primary}`,
                      }}
                    />
                    {timeline[selectedTimelineEvent].personName && (
                      <div style={{ fontSize: "0.7rem", textAlign: "center", marginTop: "4px", color: colors.textMuted }}>
                        {timeline[selectedTimelineEvent].personName}
                      </div>
                    )}
                  </div>
                )}

                {/* Event details */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                    <span style={{ fontSize: "2rem" }}>{timeline[selectedTimelineEvent].icon}</span>
                    <div>
                      <h4 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "2px" }}>
                        {timeline[selectedTimelineEvent].event}
                      </h4>
                      <span style={{ fontSize: "0.9rem", color: colors.primary, fontWeight: 600 }}>
                        {timeline[selectedTimelineEvent].year}
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      lineHeight: 1.7,
                      color: colors.text,
                      whiteSpace: "pre-line",
                      maxHeight: "150px",
                      overflow: "auto",
                    }}
                  >
                    {timeline[selectedTimelineEvent].details}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "20px" }}>
        {/* Standards */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            padding: "15px",
            borderRadius: "16px",
            background: colors.backgroundLight,
            border: `1px solid ${colors.surface}`,
          }}
        >
          <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "12px", color: colors.secondary }}>
            SQL Standardid (klõpsa!)
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {standards.map((std, index) => (
              <motion.button
                key={std.name}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setSelectedStandard(selectedStandard === index ? null : index); setSelectedFeature(0); }}
                style={{
                  padding: "10px 15px",
                  borderRadius: "10px",
                  border: "none",
                  background: selectedStandard === index ? colors.primary : colors.surface,
                  color: colors.text,
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontWeight: 600 }}>{std.name}</span>
                <span style={{ fontSize: "0.8rem", color: colors.textMuted }}>{std.year}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Standard details or Dialects */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            padding: "15px",
            borderRadius: "16px",
            background: colors.backgroundLight,
            border: `1px solid ${colors.surface}`,
            maxHeight: "280px",
            overflow: "auto",
          }}
        >
          <AnimatePresence mode="wait">
            {selectedStandard !== null ? (
              <motion.div
                key={`standard-${selectedStandard}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "8px", color: colors.accent }}>
                  {standards[selectedStandard].name} uuendused
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "15px" }}>
                  {standards[selectedStandard].features.map((f, fIndex) => (
                    <motion.button
                      key={f.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedFeature(fIndex)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        background: selectedFeature === fIndex ? colors.accent : `${colors.accent}20`,
                        color: selectedFeature === fIndex ? "white" : colors.text,
                        fontSize: "0.75rem",
                        border: "none",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      {f.name}
                    </motion.button>
                  ))}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      padding: "10px",
                      borderRadius: "10px",
                      background: "#1a1a2e",
                      overflow: "auto",
                    }}
                  >
                    <div style={{ fontSize: "0.65rem", color: colors.textMuted, marginBottom: "6px", fontWeight: 600 }}>
                      Päring:
                    </div>
                    <SQLHighlighter code={standards[selectedStandard].features[selectedFeature]?.example || ""} fontSize="0.65rem" />
                  </div>
                  <div
                    style={{
                      padding: "10px",
                      borderRadius: "10px",
                      background: colors.background,
                      border: `1px solid ${colors.surface}`,
                      overflow: "auto",
                    }}
                  >
                    <div style={{ fontSize: "0.65rem", color: colors.textMuted, marginBottom: "6px", fontWeight: 600 }}>
                      Tulemus:
                    </div>
                    {(standards[selectedStandard].features[selectedFeature] as { result?: string[][] })?.result && (
                      <div style={{ borderRadius: "6px", overflow: "hidden", border: `1px solid ${colors.surface}` }}>
                        {(standards[selectedStandard].features[selectedFeature] as { result: string[][] }).result.map((row, rowIndex) => (
                          <div
                            key={rowIndex}
                            style={{
                              display: "grid",
                              gridTemplateColumns: `repeat(${row.length}, 1fr)`,
                              background: rowIndex === 0 ? colors.surface : (rowIndex % 2 === 0 ? colors.backgroundLight : colors.background),
                              borderTop: rowIndex > 0 ? `1px solid ${colors.surface}` : "none",
                            }}
                          >
                            {row.map((cell, cellIndex) => (
                              <div
                                key={cellIndex}
                                style={{
                                  padding: "5px 8px",
                                  fontSize: "0.6rem",
                                  fontWeight: rowIndex === 0 ? 600 : 400,
                                  fontFamily: rowIndex === 0 ? "inherit" : "'Fira Code', monospace",
                                  borderRight: cellIndex < row.length - 1 ? `1px solid ${colors.surface}` : "none",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {cell}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="dialects"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "10px", color: colors.accent }}>
                  Dialektide erinevused
                </h3>
                <div style={{
                  fontSize: "0.7rem",
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: `1px solid ${colors.surface}`,
                }}>
                  {/* Header */}
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr",
                    background: colors.surface,
                  }}>
                    <div style={{ padding: "8px 10px", fontWeight: 600, borderRight: `1px solid ${colors.background}` }}>Funktsioon</div>
                    <div style={{ padding: "8px 10px", fontWeight: 600, color: "#22c55e", background: "#22c55e15", borderRight: `1px solid ${colors.background}` }}>PostgreSQL</div>
                    <div style={{ padding: "8px 10px", fontWeight: 600, color: "#3b82f6", background: "#3b82f615", borderRight: `1px solid ${colors.background}` }}>MySQL</div>
                    <div style={{ padding: "8px 10px", fontWeight: 600, color: "#ef4444", background: "#ef444415", borderRight: `1px solid ${colors.background}` }}>Oracle</div>
                    <div style={{ padding: "8px 10px", fontWeight: 600, color: "#f59e0b", background: "#f59e0b15" }}>MS SQL</div>
                  </div>
                  {/* Rows */}
                  {dialects.map((d, i) => (
                    <div
                      key={d.feature}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr",
                        borderTop: `1px solid ${colors.surface}`,
                      }}
                    >
                      <div style={{
                        padding: "8px 10px",
                        fontWeight: 500,
                        background: i % 2 === 0 ? colors.background : colors.backgroundLight,
                        borderRight: `1px solid ${colors.surface}`,
                      }}>{d.feature}</div>
                      <div style={{
                        padding: "8px 10px",
                        fontFamily: "'Fira Code', monospace",
                        fontSize: "0.65rem",
                        background: i % 2 === 0 ? "#22c55e08" : "#22c55e12",
                        borderRight: `1px solid ${colors.surface}`,
                        color: "#a0f0a0",
                      }}>{d.postgresql}</div>
                      <div style={{
                        padding: "8px 10px",
                        fontFamily: "'Fira Code', monospace",
                        fontSize: "0.65rem",
                        background: i % 2 === 0 ? "#3b82f608" : "#3b82f612",
                        borderRight: `1px solid ${colors.surface}`,
                        color: "#90c0ff",
                      }}>{d.mysql}</div>
                      <div style={{
                        padding: "8px 10px",
                        fontFamily: "'Fira Code', monospace",
                        fontSize: "0.65rem",
                        background: i % 2 === 0 ? "#ef444408" : "#ef444412",
                        borderRight: `1px solid ${colors.surface}`,
                        color: "#ffa0a0",
                      }}>{d.oracle}</div>
                      <div style={{
                        padding: "8px 10px",
                        fontFamily: "'Fira Code', monospace",
                        fontSize: "0.65rem",
                        background: i % 2 === 0 ? "#f59e0b08" : "#f59e0b12",
                        color: "#ffd080",
                      }}>{d.mssql}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
