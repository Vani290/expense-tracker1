let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

const form = document.getElementById("transaction-form");
const descInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const list = document.getElementById("transaction-list");
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

let chart;


function updateChart(incomeTotal, expenseTotal) {
  const ctx = document.getElementById("expenseChart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [incomeTotal, expenseTotal],
        backgroundColor: ["#28a745", "#dc3545"]
      }]
    }
  });
}

function updateSummary() {
  const amounts = transactions.map(t => t.amount);
  const incomeTotal = amounts.filter(val => val > 0).reduce((a, b) => a + b, 0);
  const expenseTotal = amounts.filter(val => val < 0).reduce((a, b) => a + b, 0);

  balance.textContent = incomeTotal + expenseTotal;
  income.textContent = incomeTotal;
  expense.textContent = Math.abs(expenseTotal);

  updateChart(incomeTotal, Math.abs(expenseTotal));
}


function addTransactionDOM(transaction) {
  const li = document.createElement("li");
  li.innerHTML = `
    ${transaction.description}: ₹${transaction.amount}
    <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">x</button>
  `;
  list.appendChild(li);
}


function deleteTransaction(id) {
  transactions = transactions.filter(t => t.id !== id);
  updateLocalStorage();
  init();
}


function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function init() {
  list.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateSummary();
}


form.addEventListener("submit", e => {
  e.preventDefault();
  const desc = descInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (desc === "" || isNaN(amount)) {
    alert("Please provide valid inputs.");
    return;
  }

  const transaction = {
    id: Date.now(),
    description: desc,
    amount
  };

  transactions.push(transaction);
  updateLocalStorage();
  init();

  descInput.value = "";
  amountInput.value = "";
});

init();
