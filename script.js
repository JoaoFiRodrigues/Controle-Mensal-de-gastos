let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

function adicionarGasto() {
    const descricao = document.getElementById("descricao").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const data = document.getElementById("data").value;
    const categoria = document.getElementById("categoria").value;

if (!descricao || isNaN(valor) || !data) {
    alert("Preencha todos os campos corretamente!");
    return;
}

gastos.push({ descricao, valor, data, categoria });
localStorage.setItem("gastos", JSON.stringify(gastos));

    document.getElementById("descricao").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("data").value = "";

      listarGastos();
}

function listarGastos() {
    const tabela = document.getElementById("tabelaGastos");
    const filtro = document.getElementById("filtroCategoria").value;
    tabela.innerHTML = "";

    let total = 0;

      gastos.forEach(gasto => {
        if (filtro && gasto.categoria !== filtro) return;

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${gasto.descricao}</td>
          <td>R$ ${gasto.valor.toFixed(2)}</td>
          <td>${gasto.data}</td>
          <td>${gasto.categoria}</td>
        `;
        tabela.appendChild(tr);
        total += gasto.valor;
      });

      document.getElementById("totalGastos").textContent = `Total: R$ ${total.toFixed(2)}`;
      atualizarGrafico();
    }

    listarGastos();

function atualizarGrafico() {
  const categorias = {};
  gastos.forEach(gasto => {
    if (!categorias[gasto.categoria]) {
      categorias[gasto.categoria] = 0;
    }
    categorias[gasto.categoria] += gasto.valor;
  });

  const labels = Object.keys(categorias);
  const valores = Object.values(categorias);

  if (window.graficoPizza) {
    window.graficoPizza.destroy(); // Evita gráfico duplicado
  }

  const ctx = document.getElementById('graficoGastos').getContext('2d');
  window.graficoPizza = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: valores,
        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#9ccc65'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' },
        title: {
          display: false
        }
      }
    }
  });
}

function exportarPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // título
  doc.setFontSize(18);
  doc.text("Relatório de Gastos", 14, 20);

  // gera tabela automaticamente
  doc.autoTable({
    html: '#tabelaGastos',
    startY: 30,
    headStyles: { fillColor: [22, 160, 133] },
    styles: { fontSize: 12 }
  });

  // total ao final
  const totalTexto = document.getElementById('totalGastos').textContent;
  doc.text(totalTexto, 14, doc.autoTable.previous.finalY + 10);

  // salva arquivo
  doc.save('gastos.pdf');
}


function resetarGastos() {
  if (confirm("Tem certeza que deseja apagar todos os gastos?")) {
    localStorage.removeItem("gastos");
    gastos = [];
    listarGastos();
  }
}
