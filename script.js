function goToProducts() {
    window.location.href = "products.html";
  }
let products = [];
let customers = [];
let selectedProducts = [];
let selectedCustomer = null;

function addProduct() {
    const name = document.getElementById('productName').value;
    const price = parseFloat(document.getElementById('productPrice').value);

    if (name && !isNaN(price)) {
        products.push({ name, price });
        updateProductTable();
        document.getElementById('productName').value = '';
        document.getElementById('productPrice').value = '';

        if (customers.length > 0) {
            hideAllSections();
            document.getElementById('orderSection').style.display = 'block';
        } else {
            hideAllSections();
            document.getElementById('customerSection').style.display = 'block';
        }
    } else {
        alert("Please enter both product name and a valid price.");
    }
}

function updateProductTable() {
    const tableBody = document.getElementById('productTable').querySelector('tbody');
    tableBody.innerHTML = '';

    products.forEach((product, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price.toFixed(2)}</td>
            <td>
                <button onclick="orderProduct(${index})">Order</button>
                <button onclick="deleteProduct(${index})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteProduct(index) {
    products.splice(index, 1);
    updateProductTable();
}

function addCustomer() {
    const customerName = document.getElementById('customerName').value;
    if (customerName) {
        customers.push(customerName);
        updateCustomerList();
        document.getElementById('customerName').value = '';

        hideAllSections();
        document.getElementById('orderSection').style.display = 'block';
    } else {
        alert("Please enter a customer name.");
    }
}

function updateCustomerList() {
    const customerList = document.getElementById('customerList');
    customerList.innerHTML = '<option value="">Select Customer</option>';
    
    customers.forEach((customer, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = customer;
        customerList.appendChild(option);
    });
}

function selectCustomer() {
    const customerList = document.getElementById('customerList');
    const selectedIndex = customerList.value;
    if (selectedIndex) {
        selectedCustomer = customers[selectedIndex];
        document.getElementById('summarySection').style.display = 'block';
        updateSummaryTable();
    } else {
        selectedCustomer = null;
        document.getElementById('summarySection').style.display = 'none';
    }
}

function updateSummaryTable() {
    const tableBody = document.getElementById('summaryTable').querySelector('tbody');
    tableBody.innerHTML = '';

    let totalAmount = 0;

    selectedProducts.forEach((product, index) => {
        const totalPrice = product.price * product.quantity;
        totalAmount += totalPrice;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price.toFixed(2)}</td>
            <td><input type="number" value="${product.quantity}" min="1" onchange="updateQuantity(${index}, this.value)" class="quantity-input"></td>
            <td>${totalPrice.toFixed(2)}</td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('totalAmount').textContent = `TOTAL AMOUNT OF PURCHASE : ₹${totalAmount.toFixed(2)}/-`;
}

function updateQuantity(index, newQuantity) {
    newQuantity = parseInt(newQuantity, 10);

    if (isNaN(newQuantity) || newQuantity < 1) {
        newQuantity = 1;
    }

    selectedProducts[index].quantity = newQuantity;
    updateSummaryTable();
}

function orderProduct(index) {
    if (!selectedCustomer) {
        alert("Please select a customer before adding products to the order.");
        return;
    }

    const product = products[index];
    const existingProduct = selectedProducts.find(p => p.name === product.name);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        selectedProducts.push({ ...product, quantity: 1 });
    }

    if (document.getElementById('orderSection').style.display === 'none') {
        hideAllSections();
        document.getElementById('orderSection').style.display = 'block';
    }

    updateSummaryTable();
}

function completePurchase() {
    if (!selectedCustomer) {
        alert("Please select a customer.");
        return;
    }

    if (selectedProducts.length === 0) {
        alert("Please add products to the purchase.");
        return;
    }

    const invoiceHTML = generateInvoiceHTML();
    const invoiceWindow = window.open('', '_blank');
    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
    selectedProducts = [];
    selectedCustomer = null;
    updateSummaryTable();
    document.getElementById('customerList').value = '';

    hideAllSections();
    document.getElementById('formSection').style.display = 'block';
}

function generateInvoiceHTML() {
    const currentDate = new Date().toLocaleDateString('en-IN');
    let totalAmount = 0;

    const productsHTML = selectedProducts.map(product => {
        const totalPrice = product.price * product.quantity;
        totalAmount += totalPrice;
        return `
            <tr>
                <td>${product.name}</td>
                <td>₹${product.price.toFixed(2)}</td>
                <td>${product.quantity}</td>
                <td>₹${totalPrice.toFixed(2)}</td>
            </tr>
        `;
    }).join('');

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice</title>
             <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.5.0/font/bootstrap-icons.min.css">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }
                .invoice-container {
                    width: 80%;
                    margin: 0 auto;
                    padding: 20px;
                }
                .invoice-header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .invoice-details {
                    margin-bottom: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #f2f2f2;
                }
                .total {
                    font-weight: bold;
                    text-align: right;
                }
                i {
                font-size: 2rem;
                }    
                @media print {
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <div class="invoice-header">   
                <h1>Orders</h1>
                </div>
                <div class="invoice-details">
                    <p><strong>Customer:</strong> ${selectedCustomer}</p>
                    <p><strong>Date:</strong> ${currentDate}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productsHTML}
                    </tbody>
                </table>
                <div class="total">
                    <p>TOTAL AMOUNT OF PURCHASE: ₹${totalAmount.toFixed(2)}/-</p>
                </div>
            </div>
            <script>
                window.onload = function() {
                    window.print();
                }
            </script>
        </body>
        </html>
    `;
}

function showAddProductSection() {
    hideAllSections();
    document.getElementById('formSection').style.display = 'block';
}

function showAddCustomerSection() {
    hideAllSections();
    document.getElementById('customerSection').style.display = 'block';
}

function hideAllSections() {
    document.getElementById('formSection').style.display = 'none';
    document.getElementById('customerSection').style.display = 'none';
    document.getElementById('orderSection').style.display = 'none';
}