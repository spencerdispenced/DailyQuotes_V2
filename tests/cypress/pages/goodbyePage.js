class GoodbyePage {
  Msg = () => cy.get('[data-cy="goodbye-msg"]');
}

module.exports = new GoodbyePage();
