//
//  Functions to render HTML elements
//
export function populateTable(transactions) {
  let tbody = document.querySelector("#tbody");
  tbody.innerHTML = "";

  transactions.forEach((transaction) => {
    // Create and populate a table row
    let tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${transaction.name}</td>
        <td>${transaction.value}</td>
      `;

    tbody.appendChild(tr);
  });
}
export function populateTotal(transactions) {
  // Reduce transaction amounts to a single total value
  let total = transactions.reduce((total, t) => {
    return total + parseInt(t.value);
  }, 0);

  let totalEl = document.querySelector("#total");
  totalEl.textContent = total;
}
