/**
 * Analizador de Bonificaciones - JavaScript
 * Calcula el beneficio de las bonificaciones de hipoteca
 */

class MortgageCalculator {
  constructor() {
    this.initializeProducts();
    this.initializeElements();
    this.loadFromLocalStorage();
    this.setupEventListeners();
    this.updateProductsTable();
    this.chartInstance = null;
  }

  initializeProducts() {
    // Productos disponibles (como BoniCalc)
    this.productos = {
      nomina: {
        nombre: "Domiciliación de nómina",
        bonificacion: 0.5,
        banco: 0,
        externo: 0,
        activo: true,
      },
      seguroHogar: {
        nombre: "Seguro de hogar",
        bonificacion: 0.25,
        banco: 300,
        externo: 200,
        activo: true,
      },
      seguroVida: {
        nombre: "Seguro de vida",
        bonificacion: 0.25,
        banco: 400,
        externo: 250,
        activo: true,
      },
      tarjetas: {
        nombre: "Tarjetas y uso mínimo",
        bonificacion: 0.15,
        banco: 60,
        externo: 0,
        activo: true,
      },
      planPensiones: {
        nombre: "Plan de pensiones/fondos",
        bonificacion: 0.1,
        banco: 120,
        externo: 120,
        activo: false,
      },
      cuenta: {
        nombre: "Cuenta sin comisiones",
        bonificacion: 0.1,
        banco: 0,
        externo: 0,
        activo: false,
      },
      recibos: {
        nombre: "Domiciliación de recibos",
        bonificacion: 0.05,
        banco: 0,
        externo: 0,
        activo: false,
      },
      otros: {
        nombre: "Otros productos",
        bonificacion: 0.1,
        banco: 100,
        externo: 50,
        activo: false,
      },
    };
  }

  initializeElements() {
    // Form elements
    this.amountInput = document.getElementById("amount");
    this.baseRateInput = document.getElementById("baseRate");
    this.termInput = document.getElementById("term");

    // Button and results
    this.calculateBtn = document.getElementById("calculateBtn");
    this.resultsSection = document.getElementById("results");
    this.chartCanvas = document.getElementById("savingsChart");
  }

  loadFromLocalStorage() {
    const saved = localStorage.getItem("analizador-bonificaciones");
    if (saved) {
      try {
        const data = JSON.parse(saved);

        // Cargar datos básicos
        if (data.amount) this.amountInput.value = data.amount;
        if (data.baseRate) this.baseRateInput.value = data.baseRate;
        if (data.term) this.termInput.value = data.term;

        // Cargar productos
        if (data.productos) {
          Object.keys(data.productos).forEach((key) => {
            if (this.productos[key]) {
              this.productos[key] = {
                ...this.productos[key],
                ...data.productos[key],
              };
            }
          });
        }
      } catch (e) {
        console.log("Error loading from localStorage:", e);
      }
    }
  }

  saveToLocalStorage() {
    const data = {
      amount: this.amountInput.value,
      baseRate: this.baseRateInput.value,
      term: this.termInput.value,
      productos: this.productos,
    };
    localStorage.setItem("analizador-bonificaciones", JSON.stringify(data));
  }

  setupEventListeners() {
    // Auto-save when inputs change
    [this.amountInput, this.baseRateInput, this.termInput].forEach((input) => {
      input.addEventListener("input", () => this.saveToLocalStorage());
    });

    this.calculateBtn.addEventListener("click", () => {
      this.performCalculation();
    });
  }

  updateProductsTable() {
    const tbody = document.getElementById("productosBody");
    tbody.innerHTML = "";

    Object.entries(this.productos).forEach(([key, producto]) => {
      const tr = document.createElement("tr");
      tr.className = "border-b border-gray-100 hover:bg-gray-50";

      const diferencia = producto.banco - producto.externo;

      tr.innerHTML = `
        <td class="py-4 px-4">
          <div class="flex items-center gap-2">
            <span class="font-medium text-gray-700">${producto.nombre}</span>
          </div>
        </td>
        <td class="text-center py-4 px-4">
          <input
            type="checkbox"
            ${producto.activo ? "checked" : ""}
            onchange="calculator.toggleProducto('${key}')"
            class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
        </td>
        <td class="text-center py-4 px-4">
          <input
            type="number"
            step="0.01"
            value="${producto.bonificacion}"
            onchange="calculator.actualizarProducto('${key}', 'bonificacion', this.value)"
            ${!producto.activo ? "disabled" : ""}
            class="w-20 px-2 py-1 border rounded text-center ${
              producto.activo
                ? "border-green-300 focus:ring-2 focus:ring-green-500 bg-green-50"
                : "border-gray-200 bg-gray-100 text-gray-400"
            }"
          />
        </td>
        <td class="text-center py-4 px-4">
          <input
            type="number"
            value="${producto.banco}"
            onchange="calculator.actualizarProducto('${key}', 'banco', this.value)"
            ${!producto.activo ? "disabled" : ""}
            class="w-24 px-2 py-1 border rounded text-center ${
              producto.activo
                ? "border-gray-300 focus:ring-2 focus:ring-blue-500"
                : "border-gray-200 bg-gray-100 text-gray-400"
            }"
          />
        </td>
        <td class="text-center py-4 px-4">
          <input
            type="number"
            value="${producto.externo}"
            onchange="calculator.actualizarProducto('${key}', 'externo', this.value)"
            ${!producto.activo ? "disabled" : ""}
            class="w-24 px-2 py-1 border rounded text-center ${
              producto.activo
                ? "border-gray-300 focus:ring-2 focus:ring-blue-500"
                : "border-gray-200 bg-gray-100 text-gray-400"
            }"
          />
        </td>
        <td class="text-center py-4 px-4">
          ${
            producto.activo
              ? `
            <span class="font-semibold ${
              diferencia > 0
                ? "text-red-600"
                : diferencia < 0
                ? "text-green-600"
                : "text-gray-500"
            }">
              ${diferencia > 0 ? "+" : ""}${diferencia}€
            </span>
          `
              : ""
          }
        </td>
      `;

      tbody.appendChild(tr);
    });

    this.updateTotals();
  }

  toggleProducto(key) {
    this.productos[key].activo = !this.productos[key].activo;
    this.updateProductsTable();
    this.saveToLocalStorage();
  }

  actualizarProducto(key, campo, valor) {
    this.productos[key][campo] = Number(valor);
    this.updateProductsTable();
    this.saveToLocalStorage();
  }

  updateTotals() {
    let bonificacionTotal = 0;
    let costeAnualBanco = 0;
    let costeAnualExterno = 0;

    Object.values(this.productos).forEach((producto) => {
      if (producto.activo) {
        bonificacionTotal += producto.bonificacion;
        costeAnualBanco += producto.banco;
        costeAnualExterno += producto.externo;
      }
    });

    const totalDiferencia = costeAnualBanco - costeAnualExterno;

    document.getElementById(
      "totalBonificacion"
    ).textContent = `${bonificacionTotal.toFixed(2)}%`;
    document.getElementById("totalBanco").textContent = `${costeAnualBanco}€`;
    document.getElementById(
      "totalExterno"
    ).textContent = `${costeAnualExterno}€`;
    document.getElementById("totalDiferencia").innerHTML = `
      <span class="${
        totalDiferencia > 0
          ? "text-red-600"
          : totalDiferencia < 0
          ? "text-green-600"
          : "text-gray-500"
      }">
        ${totalDiferencia > 0 ? "+" : ""}${totalDiferencia}€
      </span>
    `;
  }

  validateInputs() {
    const amount = parseFloat(this.amountInput.value);
    const baseRate = parseFloat(this.baseRateInput.value);
    const term = parseInt(this.termInput.value);

    if (!amount || amount < 1000 || amount > 2000000) {
      alert("El importe debe estar entre 1.000€ y 2.000.000€");
      return false;
    }

    if (!baseRate || baseRate < 0.1 || baseRate > 15) {
      alert("El TIN base debe estar entre 0.1% y 15%");
      return false;
    }

    if (!term || term < 5 || term > 40) {
      alert("El plazo debe estar entre 5 y 40 años");
      return false;
    }

    return true;
  }

  async performCalculation() {
    if (!this.validateInputs()) return;

    // Show loading state
    this.calculateBtn.disabled = true;
    this.calculateBtn.querySelector(".calculate-text").classList.add("hidden");
    this.calculateBtn
      .querySelector(".calculate-loading")
      .classList.remove("hidden");

    try {
      // Simulate calculation delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      const results = this.calculateMortgageAnalysis();
      this.displayResults(results);
      this.createChart(results);

      // Show results section with animation
      this.resultsSection.classList.remove("hidden");
      this.resultsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } catch (error) {
      console.error("Error en el cálculo:", error);
      alert(
        "Ha ocurrido un error en el cálculo. Por favor, inténtalo de nuevo."
      );
    } finally {
      // Reset button state
      this.calculateBtn.disabled = false;
      this.calculateBtn
        .querySelector(".calculate-text")
        .classList.remove("hidden");
      this.calculateBtn
        .querySelector(".calculate-loading")
        .classList.add("hidden");
    }
  }

  calculateMortgageAnalysis() {
    const amount = parseFloat(this.amountInput.value);
    const baseRate = parseFloat(this.baseRateInput.value);
    const termYears = parseInt(this.termInput.value);
    const termMonths = termYears * 12;

    // Calculate total discount from active products
    let totalDiscount = 0;
    let annualOvercost = 0; // Solo sobrecoste (banco - externo)

    Object.values(this.productos).forEach((producto) => {
      if (producto.activo) {
        totalDiscount += producto.bonificacion;
        annualOvercost += producto.banco - producto.externo; // Solo el sobrecoste
      }
    });

    const bonifiedRate = Math.max(0, baseRate - totalDiscount);

    // Calculate mortgages
    const baseMortgage = this.calculateMortgage(amount, baseRate, termMonths);
    const bonifiedMortgage = this.calculateMortgage(
      amount,
      bonifiedRate,
      termMonths
    );

    // Calculate evolution with overcost only
    const { evolution: savingsEvolution, inflectionYear } =
      this.calculateSavingsEvolution(
        baseMortgage,
        bonifiedMortgage,
        annualOvercost,
        termMonths
      );

    const netSavings =
      baseMortgage.totalInterest -
      bonifiedMortgage.totalInterest -
      annualOvercost * termYears;

    return {
      baseMortgage,
      bonifiedMortgage,
      totalDiscount,
      annualOvercost,
      savingsEvolution,
      inflectionYear,
      netSavings,
    };
  }

  calculateMortgage(principal, annualRate, termMonths) {
    const monthlyRate = annualRate / 100 / 12;
    let monthlyPayment;

    if (monthlyRate === 0) {
      monthlyPayment = principal / termMonths;
    } else {
      monthlyPayment =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
        (Math.pow(1 + monthlyRate, termMonths) - 1);
    }

    let remainingBalance = principal;
    let totalInterest = 0;
    const schedule = [];

    for (let month = 1; month <= termMonths; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;

      remainingBalance -= principalPayment;
      totalInterest += interestPayment;

      schedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, remainingBalance),
      });

      if (remainingBalance <= 0) break;
    }

    return {
      monthlyPayment,
      totalInterest,
      schedule,
    };
  }

  calculateSavingsEvolution(
    baseMortgage,
    bonifiedMortgage,
    annualOvercost,
    termMonths
  ) {
    const evolution = [];
    let cumulativeInterestSavings = 0;
    let cumulativeOvercost = 0;
    let inflectionYear = null;

    // Calculate year by year
    const termYears = Math.ceil(termMonths / 12);

    for (let year = 1; year <= termYears; year++) {
      let yearlyInterestSavings = 0;
      const yearlyOvercost = annualOvercost; // Solo sobrecoste anual

      // Calculate monthly savings for this year
      const startMonth = (year - 1) * 12 + 1;
      const endMonth = Math.min(year * 12, termMonths);

      for (let month = startMonth; month <= endMonth; month++) {
        if (month <= baseMortgage.schedule.length) {
          const baseInterest = baseMortgage.schedule[month - 1].interest;
          const bonifiedInterest =
            bonifiedMortgage.schedule[month - 1].interest;
          yearlyInterestSavings += baseInterest - bonifiedInterest;
        }
      }

      const yearlyNetBalance = yearlyInterestSavings - yearlyOvercost;
      cumulativeInterestSavings += yearlyInterestSavings;
      cumulativeOvercost += yearlyOvercost;

      // Detect inflection point (when yearly balance becomes negative)
      if (inflectionYear === null && yearlyNetBalance < 0) {
        inflectionYear = year;
      }

      evolution.push({
        year,
        yearlyInterestSavings,
        yearlyOvercost,
        yearlyNetBalance,
        cumulativeInterestSavings,
        cumulativeOvercost,
        netSavings: cumulativeInterestSavings - cumulativeOvercost,
        isRentable: yearlyNetBalance >= 0,
      });
    }

    return { evolution, inflectionYear };
  }

  displayResults(results) {
    // Update summary cards
    document.getElementById("baseTinResult").textContent = `${parseFloat(
      this.baseRateInput.value
    ).toFixed(2)}%`;
    document.getElementById("baseMonthlyResult").textContent = `${Math.round(
      results.baseMortgage.monthlyPayment
    ).toLocaleString()}€`;
    document.getElementById(
      "baseTotalInterestResult"
    ).textContent = `${Math.round(
      results.baseMortgage.totalInterest
    ).toLocaleString()}€`;

    const finalRate =
      parseFloat(this.baseRateInput.value) - results.totalDiscount;
    document.getElementById(
      "finalTinResult"
    ).textContent = `${finalRate.toFixed(2)}%`;
    document.getElementById("finalMonthlyResult").textContent = `${Math.round(
      results.bonifiedMortgage.monthlyPayment
    ).toLocaleString()}€`;
    document.getElementById(
      "finalTotalInterestResult"
    ).textContent = `${Math.round(
      results.bonifiedMortgage.totalInterest
    ).toLocaleString()}€`;

    const interestSavings =
      results.baseMortgage.totalInterest -
      results.bonifiedMortgage.totalInterest;
    document.getElementById("savingsResult").textContent = `${Math.round(
      interestSavings
    ).toLocaleString()}€`;

    // Display yearly evolution table
    this.displayYearlyEvolution(
      results.savingsEvolution,
      results.inflectionYear
    );

    // Display analysis summary (no recommendations, just data)
    this.displayAnalysisSummary(results);
  }

  displayYearlyEvolution(evolution, inflectionYear) {
    const container = document.getElementById("yearlyTable");

    // Show first 10 years max for better readability
    const displayData = evolution.slice(0, 10);

    let tableHTML = `
      <table class="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">Año</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b border-gray-200">Ahorro intereses</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b border-gray-200">Sobrecoste productos</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b border-gray-200">Balance anual</th>
            <th class="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b border-gray-200">Acumulado</th>
          </tr>
        </thead>
        <tbody>
    `;

    displayData.forEach((year) => {
      let rowClass = "hover:bg-gray-50 transition-colors";

      if (inflectionYear && year.year === inflectionYear) {
        rowClass += " bg-amber-50 border-l-4 border-amber-400";
      } else if (year.isRentable) {
        rowClass += " bg-green-50 bg-opacity-30";
      } else {
        rowClass += " bg-red-50 bg-opacity-30";
      }

      const formatValue = (value) => {
        const sign = value >= 0 ? "+" : "";
        return `${sign}${Math.round(value).toLocaleString()}€`;
      };

      const getValueClass = (value) => {
        return value > 0
          ? "text-green-600 font-semibold"
          : value < 0
          ? "text-red-600 font-semibold"
          : "text-gray-500";
      };

      tableHTML += `
        <tr class="${rowClass}">
          <td class="px-4 py-3 text-sm font-medium text-gray-900 border-b border-gray-100">
            ${year.year}
            ${
              inflectionYear && year.year === inflectionYear
                ? ' <span class="text-amber-600">⚠️</span>'
                : ""
            }
          </td>
          <td class="px-4 py-3 text-sm text-center text-green-600 font-semibold border-b border-gray-100">${formatValue(
            year.yearlyInterestSavings
          )}</td>
          <td class="px-4 py-3 text-sm text-center text-red-600 font-semibold border-b border-gray-100">${
            year.yearlyOvercost > 0 ? "-" : ""
          }${Math.round(Math.abs(year.yearlyOvercost)).toLocaleString()}€</td>
          <td class="px-4 py-3 text-sm text-center border-b border-gray-100 ${getValueClass(
            year.yearlyNetBalance
          )}">${formatValue(year.yearlyNetBalance)}</td>
          <td class="px-4 py-3 text-sm text-center border-b border-gray-100 ${getValueClass(
            year.netSavings
          )}">${formatValue(year.netSavings)}</td>
        </tr>
      `;
    });

    tableHTML += `
        </tbody>
      </table>
    `;

    if (evolution.length > 10) {
      tableHTML += `
        <div class="text-center text-xs text-gray-500 mt-4 p-2">
          Se muestran los primeros 10 años. Consulta el gráfico para ver la evolución completa.
        </div>
      `;
    }

    container.innerHTML = tableHTML;
  }

  displayAnalysisSummary(results) {
    const container = document.getElementById("recommendationText");

    let summaryText = "";

    // Solo mostrar datos, no recomendaciones
    if (results.netSavings > 0) {
      summaryText = `<strong>💰 Ahorro neto total: ${Math.round(
        results.netSavings
      ).toLocaleString()}€</strong> durante toda la hipoteca.<br><br>
        📊 <strong>Desglose:</strong> Ahorro en intereses de ${Math.round(
          results.baseMortgage.totalInterest -
            results.bonifiedMortgage.totalInterest
        ).toLocaleString()}€ 
        menos sobrecoste de productos de ${Math.round(
          results.annualOvercost * parseInt(this.termInput.value)
        ).toLocaleString()}€.`;
    } else {
      summaryText = `<strong>💸 Coste neto total: ${Math.round(
        Math.abs(results.netSavings)
      ).toLocaleString()}€</strong> durante toda la hipoteca.<br><br>
        📊 <strong>Desglose:</strong> Ahorro en intereses de ${Math.round(
          results.baseMortgage.totalInterest -
            results.bonifiedMortgage.totalInterest
        ).toLocaleString()}€ 
        no compensa el sobrecoste de productos de ${Math.round(
          results.annualOvercost * parseInt(this.termInput.value)
        ).toLocaleString()}€.`;
    }

    // Add inflection year info with more prominent styling
    if (results.inflectionYear) {
      summaryText += `<br><br><div class="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg border border-amber-200">
        <span>⏰</span>
        <span><strong>Año ${results.inflectionYear}:</strong> Momento óptimo para cancelar bonificaciones</span>
      </div>`;
    } else if (results.netSavings > 0) {
      summaryText += `<br><br><div class="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg border border-green-200">
        <span>📈</span>
        <span><strong>Rentable durante toda la hipoteca</strong></span>
      </div>`;
    } else {
      summaryText += `<br><br><div class="inline-flex items-center space-x-2 bg-red-100 text-red-800 px-4 py-2 rounded-lg border border-red-200">
        <span>📉</span>
        <span><strong>No rentable desde el primer año</strong></span>
      </div>`;
    }

    container.innerHTML = summaryText;
  }

  createChart(results) {
    const canvas = this.chartCanvas;
    const ctx = canvas.getContext("2d");

    // Destroy existing chart if it exists
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const data = results.savingsEvolution;
    if (data.length === 0) return;

    // Prepare annotations for inflection point
    const annotations = {};

    if (results.inflectionYear) {
      annotations.inflectionLine = {
        type: "line",
        xMin: results.inflectionYear - 1,
        xMax: results.inflectionYear - 1,
        borderColor: "#f59e0b",
        borderWidth: 3,
        borderDash: [8, 4],
        label: {
          enabled: true,
          content: `Año ${results.inflectionYear}: Momento óptimo para cancelar`,
          position: "start",
          backgroundColor: "rgba(245, 158, 11, 0.9)",
          color: "white",
          padding: 8,
          borderRadius: 4,
          font: {
            size: 12,
            weight: "bold",
          },
        },
      };
    }

    // Create background colors for bars based on profitability
    const barColors = data.map((d) =>
      d.isRentable ? "rgba(16, 185, 129, 0.8)" : "rgba(239, 68, 68, 0.8)"
    );
    const barBorderColors = data.map((d) =>
      d.isRentable ? "rgb(16, 185, 129)" : "rgb(239, 68, 68)"
    );

    this.chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((d) => `Año ${d.year}`),
        datasets: [
          {
            label: "Balance anual",
            data: data.map((d) => d.yearlyNetBalance),
            backgroundColor: barColors,
            borderColor: barBorderColors,
            borderWidth: 2,
            yAxisID: "y",
          },
          {
            label: "Ahorro acumulado",
            data: data.map((d) => d.netSavings),
            type: "line",
            borderColor: "#2563eb",
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            borderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: "#2563eb",
            pointBorderColor: "#ffffff",
            pointBorderWidth: 2,
            fill: false,
            tension: 0.2,
            yAxisID: "y",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: {
              usePointStyle: true,
              padding: 20,
              font: {
                size: 12,
                family: "Inter",
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            titleColor: "white",
            bodyColor: "white",
            borderColor: "#e5e7eb",
            borderWidth: 1,
            titleFont: {
              size: 14,
              weight: "bold",
            },
            bodyFont: {
              size: 12,
            },
            callbacks: {
              label: function (context) {
                const label = context.dataset.label || "";
                const value = context.parsed.y;
                const formattedValue =
                  value >= 0
                    ? `+${Math.round(value).toLocaleString()}€`
                    : `${Math.round(value).toLocaleString()}€`;
                return `${label}: ${formattedValue}`;
              },
              afterBody: function (tooltipItems) {
                const yearIndex = tooltipItems[0].dataIndex;
                const yearData = data[yearIndex];
                if (
                  results.inflectionYear &&
                  yearData.year === results.inflectionYear
                ) {
                  return ["", "⚠️ Momento óptimo para cancelar"];
                }
                return [];
              },
            },
          },
          annotation: {
            annotations: annotations,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              font: {
                size: 11,
                family: "Inter",
              },
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: function (context) {
                if (context.tick.value === 0) {
                  return "#374151";
                }
                return "#f3f4f6";
              },
              lineWidth: function (context) {
                return context.tick.value === 0 ? 2 : 1;
              },
            },
            ticks: {
              callback: function (value) {
                return value >= 0
                  ? `+${Math.round(value).toLocaleString()}€`
                  : `${Math.round(value).toLocaleString()}€`;
              },
              font: {
                size: 11,
                family: "Inter",
              },
            },
          },
        },
      },
    });
  }
}

// Initialize calculator when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.calculator = new MortgageCalculator();
});
