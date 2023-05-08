class UnsubscribePage {
  nameMsg = () => cy.get('[data-cy="confirm-unsub-card"] h4');
  emailMsg = () => cy.get('[data-cy="confirm-unsub-card"] p');
  confirmUnsubBtn = () => cy.get('[data-cy="unsubscribe-btn"]');
}

module.exports = new UnsubscribePage();
