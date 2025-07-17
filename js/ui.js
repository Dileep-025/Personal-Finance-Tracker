const ui = {
  // DOM Elements
  totalIncomeEl: document.getElementById("total-income"),
  totalExpenseEl: document.getElementById("total-expense"),
  balanceEl: document.getElementById("balance"),
  transactionListEl: document.getElementById("transaction-list"), // This is the tbody
  form: document.getElementById("transaction-form"),
  titleInput: document.getElementById("title"),
  amountInput: document.getElementById("amount"),
  typeInput: document.getElementById("type"),
  categoryInput: document.getElementById("category"),
  loader: document.getElementById("loader"),
  themeToggleBtn: document.getElementById("theme-toggle"),

  updateSummary: (transactions) => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expense;
    ui.totalIncomeEl.innerHTML = `<i class="fas fa-arrow-up icon"></i> ₹${income.toFixed(
      2
    )}`;
    ui.totalExpenseEl.innerHTML = `<i class="fas fa-arrow-down icon"></i> ₹${expense.toFixed(
      2
    )}`;
    ui.balanceEl.innerHTML = `<i class="fas fa-wallet icon"></i> ₹${balance.toFixed(
      2
    )}`;
  },

  updateThemeToggleIcon: (isLight) => {
    if (isLight) {
      ui.themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      ui.themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
  },

  renderTransactions: (transactions) => {
    ui.transactionListEl.innerHTML = "";
    if (transactions.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="5" class="empty-message">No transactions yet.</td>`;
      ui.transactionListEl.appendChild(row);
      return;
    }
    const sortedTransactions = [...transactions].sort((a, b) => b.id - a.id);
    sortedTransactions.forEach((transaction) => {
      const row = ui.createTransactionRow(transaction);
      ui.transactionListEl.appendChild(row);
    });
  },

  createTransactionRow: (transaction) => {
    const row = document.createElement("tr");
    row.dataset.id = transaction.id;
    const statusIcon =
      transaction.type === "income" ? "fa-circle-up" : "fa-circle-down";
    row.innerHTML = `
            <td class="status-cell ${
              transaction.type
            }-color" data-label="Status"><i class="fa-solid ${statusIcon}"></i></td>
            <td data-label="Title">${transaction.title}</td>
            <td data-label="Category">${transaction.category}</td>
            <td data-label="Amount" class="amount-cell ${
              transaction.type
            }-color">${
      transaction.type === "income" ? "+" : "-"
    }₹${transaction.amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</td>
            <td data-label="Action"><button class="delete-btn" onclick="app.deleteTransaction(${
              transaction.id
            })"><i class="fas fa-trash-alt"></i></button></td>
        `;
    return row;
  },

  addTransactionToDOM: (transaction) => {
    const row = ui.createTransactionRow(transaction);
    row.classList.add("fade-in");
    const emptyMessage = ui.transactionListEl.querySelector(".empty-message");
    if (emptyMessage) {
      emptyMessage.parentElement.remove();
    }
    ui.transactionListEl.prepend(row);
  },

  removeTransactionFromDOM: (id) => {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
      row.classList.add("fade-out");
      setTimeout(() => {
        row.remove();
        if (app.transactions.length === 0) {
          ui.renderTransactions([]);
        }
      }, 500);
    }
  },

  clearForm: () => {
    ui.form.reset();
  },

  toggleLoader: (show) => {
    if (show) {
      ui.loader.style.visibility = "visible";
      ui.loader.style.opacity = "1";
    } else {
      ui.loader.style.visibility = "hidden";
      ui.loader.style.opacity = "0";
    }
  },
};
