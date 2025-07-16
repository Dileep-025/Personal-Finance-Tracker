const app = {
  transactions: [],
  currentTheme: "dark",

  init: () => {
    // Show loader
    ui.toggleLoader(true);

    // Load data and initialize the app
    document.addEventListener("DOMContentLoaded", () => {
      app.loadTransactions(); // This will now just load transactions without updating UI immediately
      app.loadTheme();
      app.setupEventListeners();
      app.update(); // Call update here after everything is loaded

      // Hide loader after a short delay to simulate loading
      setTimeout(() => {
        ui.toggleLoader(false);
      }, 1000);
    });
  },

  loadTransactions: () => {
    app.transactions = storage.getTransactions();
  },

  loadTheme: () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      app.currentTheme = savedTheme;
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
    ) {
      app.currentTheme = "light";
    }
    app.applyTheme();
  },

  applyTheme: () => {
    if (app.currentTheme === "light") {
      document.body.classList.add("theme-neofin");
      ui.updateThemeToggleIcon(true);
    } else {
      document.body.classList.remove("theme-neofin");
      ui.updateThemeToggleIcon(false);
    }
  },

  toggleTheme: () => {
    app.currentTheme = app.currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", app.currentTheme);
    app.applyTheme();
  },

  setupEventListeners: () => {
    ui.form.addEventListener("submit", app.addTransaction);
    ui.themeToggleBtn.addEventListener("click", app.toggleTheme);
  },

  addTransaction: (e) => {
    e.preventDefault();

    const title = ui.titleInput.value.trim();
    const amount = parseFloat(ui.amountInput.value);
    const type = ui.typeInput.value;
    const category = ui.categoryInput.value;

    if (!title || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid title and amount.");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      title,
      amount,
      type,
      category,
    };

    app.transactions.push(newTransaction);
    storage.saveTransactions(app.transactions);
    ui.addTransactionToDOM(newTransaction);
    app.update();
    ui.clearForm();
  },

  deleteTransaction: (id) => {
    app.transactions = app.transactions.filter((t) => t.id !== id);
    storage.saveTransactions(app.transactions);
    ui.removeTransactionFromDOM(id);
    app.update();
  },

  update: () => {
    ui.updateSummary(app.transactions);
    ui.renderTransactions(app.transactions);
    charts.updateExpensePieChart(app.transactions);
    charts.updateMonthlyLineChart(app.transactions);
  },
};

// Initialize the application
app.init();
