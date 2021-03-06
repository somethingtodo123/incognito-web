const handleToggleAwardRules = container => {
  const toggleRulesBtn = container.querySelector('#read-the-rules');
  const rulesContainer = container.querySelector('.rules-container');
  if (!toggleRulesBtn) return;

  toggleRulesBtn.addEventListener('click', function() {
    if (!rulesContainer) return;

    rulesContainer.classList.toggle('show');

    if (rulesContainer.classList.contains('show')) {
      rulesContainer.scrollIntoView({ behavior: 'smooth' });
    }
  });
};

const main = () => {
  const container = document.querySelector('#create-tokens-container');
  if (!container) return;

  handleToggleAwardRules(container);
};

main();
