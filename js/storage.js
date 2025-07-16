const storage = {
    getTransactions: () => {
        return JSON.parse(localStorage.getItem('transactions')) || [];
    },
    saveTransactions: (transactions) => {
        localStorage.setItem('transactions', JSON.stringify(transactions));
    }
};
