const app = {
    transactions: [],

    init: () => {
        // Show loader
        ui.toggleLoader(true);

        // Load data and initialize the app
        document.addEventListener('DOMContentLoaded', () => {
            app.loadTransactions();
            app.setupEventListeners();
            
            // Hide loader after a short delay to simulate loading
            setTimeout(() => {
                ui.toggleLoader(false);
            }, 1000);
        });
    },

    loadTransactions: () => {
        app.transactions = storage.getTransactions();
        app.update();
    },

    setupEventListeners: () => {
        ui.form.addEventListener('submit', app.addTransaction);
    },

    addTransaction: (e) => {
        e.preventDefault();

        const title = ui.titleInput.value.trim();
        const amount = parseFloat(ui.amountInput.value);
        const type = ui.typeInput.value;
        const category = ui.categoryInput.value;

        if (!title || isNaN(amount) || amount <= 0) {
            alert('Please enter a valid title and amount.');
            return;
        }

        const newTransaction = {
            id: Date.now(),
            title,
            amount,
            type,
            category
        };

        app.transactions.push(newTransaction);
        storage.saveTransactions(app.transactions);
        ui.addTransactionToDOM(newTransaction);
        app.update();
        ui.clearForm();
    },

    deleteTransaction: (id) => {
        app.transactions = app.transactions.filter(t => t.id !== id);
        storage.saveTransactions(app.transactions);
        ui.removeTransactionFromDOM(id);
        app.update();
    },

    update: () => {
        ui.updateSummary(app.transactions);
        ui.renderTransactions(app.transactions);
        charts.updateExpensePieChart(app.transactions);
        charts.updateIncomeExpenseBarChart(app.transactions);
    }
};

// Initialize the application
app.init();
