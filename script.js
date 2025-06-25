let currentPage = 0;

// Daten aus localStorage laden oder Default-Werte
const meatStats = JSON.parse(localStorage.getItem("meatStats")) || {
  beef: 0,
  pork: 0,
  chicken: 0,
  fish: 0
};

const pages = [
  // 0: Ankündigung
  `<h2>📣 Ankündigungen & Events</h2>
   <ul>
    <li><strong>NEU:</strong> CO₂-Zahlung aktiv! 🌍</li>
    <li><strong>Event:</strong> Veggie-Woche startet am Montag 🥦</li>
    <li><strong>Update:</strong> Tierzähler online 🐄🐔</li>
   </ul>`,
  
  // 1: Bestellung (interaktives Formular)
  `<h2>🧾 Bestellung</h2>
   <label for="meatInput">Menge Fleisch (in g):</label><br />
   <input type="number" id="meatInput" placeholder="z.B. 150" /><br /><br />
   
   <label for="meatType">Fleischart:</label><br />
   <select id="meatType">
     <option value="beef">Rind</option>
     <option value="pork">Schwein</option>
     <option value="chicken">Huhn</option>
     <option value="fish">Fisch</option>
   </select><br /><br />
   
   <button onclick="addMeat()">Eintragen</button>
   <p id="order-msg" style="color:green;"></p>`,
  
  // 2: Statistik (wird dynamisch aktualisiert)
  `<h2>📊 Statistik</h2>
   <div id="stats">Hier erscheinen deine Fleischverbrauchs-Statistiken</div>`,
  
  // 3: Abzeichen (Platzhalter)
  `<h2>🏅 Abzeichen</h2>
   <p>Hier erscheinen später deine Erfolge!</p>`
];

function showPage(index) {
  currentPage = index;
  document.getElementById("page-content").innerHTML = pages[index];
  
  // Wenn Statistik-Seite -> Werte anzeigen
  if (index === 2) {
    updateStats();
  }
  
  // Auf Bestellung-Seite Eingabefelder zurücksetzen und Nachricht löschen
  if (index === 1) {
    document.getElementById("meatInput").value = "";
    document.getElementById("order-msg").textContent = "";
  }
}

function nextPage() {
  if (currentPage < pages.length - 1) {
    showPage(currentPage + 1);
  }
}

function prevPage() {
  if (currentPage > 0) {
    showPage(currentPage - 1);
  }
}

function addMeat() {
  const inputEl = document.getElementById("meatInput");
  const amount = parseFloat(inputEl.value);
  const type = document.getElementById("meatType").value;
  const msgEl = document.getElementById("order-msg");

  if (isNaN(amount) || amount <= 0) {
    alert("Bitte gib eine gültige Menge ein.");
    return;
  }

  // Menge addieren
  meatStats[type] += amount;
  localStorage.setItem("meatStats", JSON.stringify(meatStats));

  // Nachricht anzeigen
  msgEl.textContent = `Erfolg! ${amount}g ${type} wurde eingetragen.`;

  // Eingabefeld leeren
  inputEl.value = "";
}

function updateStats() {
  const output = document.getElementById("stats");

  const animals = {
    beef: meatStats.beef / 250000,
    pork: meatStats.pork / 60000,
    chicken: meatStats.chicken / 1500,
    fish: meatStats.fish / 1500
  };

  output.innerHTML = `
    <p>Rind: ${(meatStats.beef / 1000).toFixed(1)} kg (${animals.beef.toFixed(2)} Tiere)</p>
    <p>Schwein: ${(meatStats.pork / 1000).toFixed(1)} kg (${animals.pork.toFixed(2)} Tiere)</p>
    <p>Huhn: ${(meatStats.chicken / 1000).toFixed(1)} kg (${animals.chicken.toFixed(2)} Tiere)</p>
    <p>Fisch: ${(meatStats.fish / 1000).toFixed(1)} kg (${animals.fish.toFixed(2)} Tiere)</p>
  `;
}

window.onload = () => showPage(0);
