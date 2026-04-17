function aplicarTemaSalvo() {
  const temaSalvo = localStorage.getItem('tema');
  const darkAtivo = temaSalvo === 'dark';
  document.body.classList.toggle('dark-mode', darkAtivo);
  atualizarRotuloTema(darkAtivo);
}

function atualizarRotuloTema(darkAtivo) {
  const botao = document.getElementById('toggleTema');
  if (!botao) return;
  botao.innerHTML = darkAtivo ? '☀️ Tema claro' : '🌙 Tema escuro';
  botao.setAttribute('aria-label', darkAtivo ? 'Ativar tema claro' : 'Ativar tema escuro');
}

function alternarTema() {
  const darkAtivo = document.body.classList.toggle('dark-mode');
  localStorage.setItem('tema', darkAtivo ? 'dark' : 'light');
  atualizarRotuloTema(darkAtivo);
}

document.addEventListener('DOMContentLoaded', () => {
  aplicarTemaSalvo();
  const botao = document.getElementById('toggleTema');
  if (botao) botao.addEventListener('click', alternarTema);
});
