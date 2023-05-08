class ErrorPage {
  msg = () => cy.get('[data-cy="error-msg"]');
}

module.exports = new ErrorPage();
