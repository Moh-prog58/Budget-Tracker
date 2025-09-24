let categories = JSON.parse(localStorage.getItem("categories")) || [];

const categoryName = document.getElementById("categoryName");
const categoryLimit = document.getElementById("categoryLimit");
const addCategoryBtn = document.getElementById("addCategoryBtn");
const categorySelect = document.getElementById("categorySelect");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const categoriesList = document.getElementById("categoriesList");

addCategoryBtn.addEventListener("click", () => {
  const name = categoryName.value.trim();
  const limit = parseFloat(categoryLimit.value);

  if (!name || isNaN(limit) || limit <= 0) {
    alert("Please enter a valid category name and budget.");
    return;
  }

  const category = { name, limit, spent: 0, expenses: [] };
  categories.push(category);

  saveData();
  updateCategorySelect();
  displayCategories();

  categoryName.value = "";
  categoryLimit.value = "";
});

addExpenseBtn.addEventListener("click", () => {
  const selectedCategory = categorySelect.value;
  const expName = expenseName.value.trim();
  const expAmount = parseFloat(expenseAmount.value);

  if (!selectedCategory || !expName || isNaN(expAmount) || expAmount <= 0) {
    alert("Please fill all fields correctly.");
    return;
  }

  const category = categories.find(cat => cat.name === selectedCategory);

  const expense = {
    name: expName,
    amount: expAmount,
    date: new Date().toLocaleString()
  };

  category.spent += expAmount;
  category.expenses.push(expense);

  saveData();
  displayCategories();

  expenseName.value = "";
  expenseAmount.value = "";
});

function updateCategorySelect() {
  categorySelect.innerHTML = '<option value="">-- Select Category --</option>';
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.name;
    option.textContent = cat.name;
    categorySelect.appendChild(option);
  });
}

function displayCategories() {
  categoriesList.innerHTML = "";
  categories.forEach((cat, catIndex) => {
    const div = document.createElement("div");
    div.classList.add("category");

    let warning = "";
    if (cat.spent > cat.limit) {
      warning = `<p class="warning">⚠ Over budget by ${cat.spent - cat.limit}</p>`;
    }

    div.innerHTML = `
      <h3>${cat.name}</h3>
      <p>Budget: ${cat.limit}</p>
      <p>Spent: ${cat.spent}</p>
      <p>Remaining: ${cat.limit - cat.spent}</p>
      ${warning}
      <button onclick="toggleDetails(${catIndex})">View Expenses</button>
      <button onclick="removeCategory(${catIndex})">Delete Category</button>
      <div id="details-${catIndex}" class="details" style="display:none;">
        <h4>Expenses:</h4>
        <ul>
          ${cat.expenses
            .map(
              (exp, expIndex) => `
              <li>
                ${exp.name} - ${exp.amount} 
                <small>(Added on ${exp.date})</small>
                <button onclick="removeExpense(${catIndex}, ${expIndex})">❌ Remove</button>
              </li>`
            )
            .join("")}
        </ul>
      </div>
    `;

    categoriesList.appendChild(div);
  });
}

function toggleDetails(catIndex) {
  const detailsDiv = document.getElementById(`details-${catIndex}`);
  detailsDiv.style.display =
    detailsDiv.style.display === "none" ? "block" : "none";
}

function removeExpense(catIndex, expIndex) {
  const expense = categories[catIndex].expenses[expIndex];
  categories[catIndex].spent -= expense.amount;
  categories[catIndex].expenses.splice(expIndex, 1);
  saveData();
  displayCategories();
}

function removeCategory(catIndex) {
  if (confirm(`Are you sure you want to delete "${categories[catIndex].name}"?`)) {
    categories.splice(catIndex, 1);
    saveData();
    updateCategorySelect();
    displayCategories();
  }
}

function saveData() {
  localStorage.setItem("categories", JSON.stringify(categories));
}

updateCategorySelect();
displayCategories();
