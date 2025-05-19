
// Dados (mock)
const especialidades = [
  { id: 1, nome: "Alergologia e Imunologia" },
  { id: 6, nome: "Cardiologia" },
  { id: 18, nome: "Dermatologia" },
  { id: 33, nome: "Ginecologia" },
  { id: 44, nome: "Oncologia Clínica" },
  { id: 55, nome: "Pneumologia" },
];

const convenios = [
  { id: 1, nome: "Unimed" },
  { id: 2, nome: "SulAmérica" },
  { id: 3, nome: "Bradesco" },
  { id: 4, nome: "Amil" },
  { id: 5, nome: "Particular"},
];

const medicosPorEspecialidade = {
 1: ["Dr. RAISSA MONTEIRO SOARES DOS ANJOS ROQUE"],
  6: ["Dr.ARTHUR VILLARIM NETO","Dr.FILIPE BARRETO CARLOS REGO","Dr.JOÃO PAULO FERNANDES LIRA DE HOLANDA","Dr.JOSÉ MARTINS DE MENDONÇA NETO","Dr.NICEAS ALVES FERREIRA NETO"
  ],
  18: ["Dra.ANA CLARA BATISTA AZEVEDO PIMENTEL","Dra.ANA CLARA DA SILVA MAIA","Dra.THAIS SILVA MOURAO FARIA","Dra.AMÁLIA LUIZ","Dra.CARLA ANDREA PONTES STAUDINGER","Dr.FÁBIO DE SOUZA GUEDES PEREIRA",
      "Dra.FLÁVIA THOMÉ FRANÇA","Dra.JOSELI BATISTA DE LIMA","Dra.JULIANA CAMARA MARIZ","Dra.MIRELLA DANTAS FULCO","Dra.TATIANA MARIA SABOIA ALVES COELHO" 
    ],
  33: ["Dra. RIANNE FREITAS DE ARAUJO GOMES","Dra. ROSEANNE CHRISTINE DE AZEVEDO BATISTA ARAUJO","Dra. LORENA DE MORAIS VITORIANO","Dra. LORENA DE MORAIS VITORIANO","Dra. ANAISA DANTAS DA SILVA DIAS",
      "Dra. RAISSA DE HOLANDA MELO","Dra. LUIZA DE REZENDE MIZUNO","Dr. ANTÔNIO ALVES DE SOUZA NETO","Dra. ARIANE KARINA LOBO C. LIMA","Dra. CERISE MARIA CORTEZ GOMES","Dr. EVANUEL ELPÍDIO DA SILVA",
      "Dra. FERNANDA MABEL BATISTA DE AQUINO","Dra. MARIA DO PERPETUO SOCORRO NOBRE M. SILVA","Dra. MARIA DO SOCORRO BANDEIRA DO NASCIMENTO MEDEIROS","Dra. MARIA SUERDA FERNANDES","Dra. MICAELA GOIS DIAS",
      "Dra. SILVIA CRISTINA DE ARAÚJO",
    ],
  44: ["Dra. MONALISA CECILIANA FREITAS MOREIRA DE ANDARDE","Dra. RENANNA LYRA LIMA BARBALHO COUTINHO","Dr. ALISON WAGNER AZEVEDO BARROSO","Dra. ANDREA JULIANA PEREIRA DE SANTANA GOMES","Dra. ANNY HELLEN ALBINO DANTAS",
      "Dra. AYALA KALINE FERREIRA ROMÃO","Dra. CAROLINA DE LIMA GOMES","Dra. CAROLINA FIGUEIRA DE CARVALHO FERNANDES CUNHA","Dra. CRISTINA ROCHA DE MEDEIROS MIRANDA","Dra. DANIELLI DE ALMEIDA MATIAS",
      "Dra. ERIKA GABRIELLE PINHEIRO XIMENES","Dra. ISAFRAN EMANUELE DOS SANTOS SILVA SOUZA","Dra. JOILDA BATISTA DE ALMEIDA REGO","Dra. KARLA ASSUNÇÃO DE CARVALHO EMERECIANO","Dra. LAURA PORTO MENDES",
      "Dra. LUCIANA CARLA MARTINS DE AQUINO","Dra. MARCELLE AUREA LOURENÇO","Dr. PIERRE GOIS DO NASCIMENTO JÚNIOR","Dr. ROBERTO MAGNUS DUARTE SALES","Dra. ROCHELLE DE LIMA FARIAS","Dr. RODRIGO JERÔNIMO DE ARAÚJO",
      "Dr. SILVIO CORREIA SALES","Dra. SULENE CUNHA SOUSA OLIVEIRA","Dr. WENDEL FERREIRA COSTA",
],
  55: ["Dr. RENAN LAURINDO DANTAS DOS SANTOS"],
};

// Elementos DOM
const selectEspecialidade = document.getElementById("especialidade");
const selectMedico = document.getElementById("medico");
const selectConvenio = document.getElementById("convenio");
const inputData = document.getElementById("data");
const btnVerificar = document.getElementById("btn-verificar");
const horariosContainer = document.getElementById("horarios-container");
const horariosLista = document.getElementById("horarios-lista");
const form = document.getElementById("agendamento-form");
const agendamentosLista = document.getElementById("agendamentos-lista");

let agendamentos = [];
let horarioSelecionado = null;

// Popula selects
function popularSelects() {
  especialidades.forEach(e => {
    const option = document.createElement("option");
    option.value = e.id;
    option.textContent = e.nome;
    selectEspecialidade.appendChild(option);
  });

  convenios.forEach(c => {
    const option = document.createElement("option");
    option.value = c.id;
    option.textContent = c.nome;
    selectConvenio.appendChild(option);
  });
}

// Atualiza médicos quando especialidade muda
function atualizarMedicos() {
  const espId = selectEspecialidade.value;
  selectMedico.innerHTML = `<option value="">Selecione um médico</option>`;

  if (medicosPorEspecialidade[espId]) {
    medicosPorEspecialidade[espId].forEach(medico => {
      const option = document.createElement("option");
      option.value = medico;
      option.textContent = medico;
      selectMedico.appendChild(option);
    });
  }
}

// Define mínimo da data como hoje (não permite datas passadas)
function setMinDate() {
  const hoje = new Date().toISOString().split('T')[0];
  inputData.min = hoje;
}

// Verifica horários disponíveis simulados
function verificarHorarios() {
  const espId = selectEspecialidade.value;
  const data = inputData.value;

  if (!espId || !data) {
    alert("Selecione especialidade e data para verificar horários.");
    return;
  }

  // Horários das 07h às 17h
  const horariosDisponiveis = [
    "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00"
  ];

  // Filtra horários já ocupados para a especialidade e data
  const ocupados = agendamentos
    .filter(a => a.especialidadeId === Number(espId) && a.data === data)
    .map(a => a.horario);

  horariosLista.innerHTML = "";

  horariosDisponiveis.forEach(horario => {
    const div = document.createElement("div");
    div.classList.add("horario-item");

    if (ocupados.includes(horario)) {
      div.classList.add("indisponivel");
      div.textContent = horario + " (Indisponível)";
    } else {
      div.textContent = horario;
      div.addEventListener("click", () => {
        // Remove seleção anterior
        Array.from(horariosLista.children).forEach(el => el.classList.remove("selecionado"));
        div.classList.add("selecionado");
        horarioSelecionado = horario;
      });
    }

    horariosLista.appendChild(div);
  });

  horariosContainer.classList.remove("hidden");
}

// Atualiza lista de agendamentos na tela
function atualizarAgendamentos() {
  agendamentosLista.innerHTML = "";
  if (agendamentos.length === 0) {
    agendamentosLista.innerHTML = "<li>Nenhum agendamento realizado.</li>";
    return;
  }
  agendamentos.forEach(a => {
    const li = document.createElement("li");
    const medicoTexto = a.medico ? ` - Médico: ${a.medico}` : "";
    li.textContent = `Especialidade: ${a.especialidadeNome}${medicoTexto} | Convênio: ${a.convenioNome} | Data: ${a.data} | Horário: ${a.horario}`;
    agendamentosLista.appendChild(li);
  });
}

// Eventos
selectEspecialidade.addEventListener("change", () => {
  atualizarMedicos();
  horariosContainer.classList.add("hidden");
  horarioSelecionado = null;
});

btnVerificar.addEventListener("click", verificarHorarios);

form.addEventListener("submit", e => {
  e.preventDefault();

  const espId = selectEspecialidade.value;
  const especialidadeNome = selectEspecialidade.options[selectEspecialidade.selectedIndex].text;
  const medico = selectMedico.value;
  const convenioId = selectConvenio.value;
  const convenioNome = selectConvenio.options[selectConvenio.selectedIndex].text;
  const data = inputData.value;

  if (!espId || !convenioId || !data) {
    alert("Preencha todos os campos obrigatórios.");
    return;
  }

  if (!horarioSelecionado) {
    alert("Selecione um horário disponível.");
    return;
  }

  // Salva agendamento
  agendamentos.push({
    especialidadeId: Number(espId),
    especialidadeNome,
    medico,
    convenioId: Number(convenioId),
    convenioNome,
    data,
    horario: horarioSelecionado,
  });

  alert("Consulta agendada com sucesso!");

  // Reset
  form.reset();
  horariosContainer.classList.add("hidden");
  horarioSelecionado = null;
  atualizarAgendamentos();
});

// Inicialização
popularSelects();
setMinDate();
atualizarAgendamentos();





