class StatusPage {
  pending = () => cy.get('[data-cy="pending-card"]');
  confirmed = () => cy.get('[data-cy="confirmed-card"]');
}

module.exports = new StatusPage();
