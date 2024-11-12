  document.addEventListener("DOMContentLoaded", () => {
    const fields = ["email", "name", "birthDate", "salary", "interestRate", "loanTerm", "homeValue", "loanAmount"];
    fields.forEach(field => {
        if (localStorage.getItem(field)) {
            document.getElementById(field).value = localStorage.getItem(field);
        }
    });
  });
  
  function saveDataToLocalStorage() {
    const fields = ["email", "name", "birthDate", "salary", "interestRate", "loanTerm", "homeValue", "loanAmount"];
    fields.forEach(field => {
        localStorage.setItem(field, document.getElementById(field).value);
    });
  }
  
  document.getElementById("loanTerm").addEventListener("input", function() {
    document.getElementById("loanTermValue").innerText = this.value + " años";
  });
  
  document.getElementById("homeValue").addEventListener("input", function() {
    const homeValue = parseFloat(this.value) || 0;
    document.getElementById("loanAmount").max = (homeValue * 0.8).toFixed(2);
  });
  
  function calculateLoan() {
    const loanAmount = parseFloat(document.getElementById("loanAmount").value);
    const annualInterestRate = parseFloat(document.getElementById("interestRate").value);
    const loanTermYears = parseInt(document.getElementById("loanTerm").value);
    const salary = parseFloat(document.getElementById("salary").value);
    const birthDate = new Date(document.getElementById("birthDate").value);
  
    const monthlyInterestRate = annualInterestRate / 12;
    const loanTermMonths = loanTermYears * 12;
  
    const numerator = loanAmount * (monthlyInterestRate / 100) * Math.pow(1 + (monthlyInterestRate / 100), loanTermMonths);
    const denominator = Math.pow(1 + (monthlyInterestRate / 100), loanTermMonths) - 1;
    const monthlyPayment = numerator / denominator;
  
    document.getElementById("monthlyPayment").value = monthlyPayment.toFixed(2);
  
    const minRequiredSalary = monthlyPayment / 0.40;
    document.getElementById("minRequiredSalary").value = minRequiredSalary.toFixed(2);
  
    const salaryValidation = salary >= minRequiredSalary ? "Monto de salario suficiente para el crédito" : "Monto de salario insuficiente";
    document.getElementById("salaryValidation").innerText = salaryValidation;
  
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const ageValidation = (age > 22 && age < 55) ? "Cliente con edad suficiente para crédito" : "Cliente no califica para crédito por edad";
    document.getElementById("ageValidation").innerText = ageValidation;
  
    const homeValue = parseFloat(document.getElementById("homeValue").value);
    const financingPercentage = (loanAmount / homeValue) * 100;
    document.getElementById("financingPercentage").innerText = `Porcentaje a financiar: ${financingPercentage.toFixed(2)}%`;
  
    saveDataToLocalStorage();
  }


function interes(tasaMensual, mes, pagoMensual, montoSolicitado) {
    let vInteres = 0;
    let amortiza = montoSolicitado;

    for (let i = 1; i <= mes; i++) {
        vInteres = amortiza * (tasaMensual / 100);
        amortiza -= (pagoMensual - vInteres);
    }

    return vInteres;
}

function mostrarProyeccion() {
    const montoSolicitado = parseFloat(document.getElementById("loanAmount").value);
    const tasaInteresAnual = parseFloat(document.getElementById("interestRate").value);
    const plazoEnMeses = parseInt(document.getElementById("loanTerm").value) * 12;
    const pagoMensual = parseFloat(document.getElementById("monthlyPayment").value);

    const tasaMensual = tasaInteresAnual / 12;
    let saldo = montoSolicitado;

    let tablaHTML = `
      <html>
      <head>
        <title>Proyección de Pago</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        <style>
          body {
            background-color: grey; 
            color: white; 
          }
          .header {
            text-align: center;
            margin-top: 20px;
          }
          .container {
            background-color: white;
            color: black;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
          }
         th{
             background-color: blue;
             color: white;
          }
         .tittle{
            background-color: #572364;
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="container mt-5">
         <div class="tittle mt-5">
          <h2 class="text-center mb-4">Crédito Happy Eart</h2>
          <h2 class="text-center mb-4">Proyección de Crédito</h2>
          </div>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Mes</th>
                <th>Pago Mensual</th>
                <th>Interés</th>
                <th>Monto Amortiza</th>
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
    `;

    for (let mes = 1; mes <= plazoEnMeses; mes++) {
        const interesMensual = interes(tasaMensual, mes, pagoMensual, saldo);
        const montoAmortiza = pagoMensual - interesMensual;
        saldo -= montoAmortiza;

        tablaHTML += `
          <tr>
            <td>${mes}</td>
            <td>${pagoMensual.toFixed(2)}</td>
            <td>${interesMensual.toFixed(2)}</td>
            <td>${montoAmortiza.toFixed(2)}</td>
            <td>${saldo.toFixed(2)}</td>
          </tr>
        `;
    }

    tablaHTML += `
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;

    // Abrir una nueva pestaña y escribir el HTML generado
    const nuevaVentana = window.open();
    nuevaVentana.document.write(tablaHTML);
    nuevaVentana.document.close();  // Importante para cargar el contenido
}