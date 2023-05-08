const { recurse } = require('cypress-recurse');

class TestEmailInbox {
  confirmationEmail = () => cy.get('[data-cy="confirm-email-body"]');
  confirmEmailLink = () => cy.get('[data-cy="confirm-email-body"]').contains('a', 'Click here');
  quoteEmail = () => cy.get('[data-cy="quote-email-body"]');
  quoteBody = () => cy.get('[data-cy="quote-body"]');
  quoteAuthor = () => cy.get('[data-cy="quote-author"]');
  unsubscribeMsg = () => cy.get('[data-cy="unsubscribe-msg"]');
  unsubscribeLink = () => cy.get('[data-cy="unsubscribe-link"]');

  goToInbox = () => {
    recurse(
      () =>
        cy.task('getLastEmail', {
          user: Cypress.env('EMAIL_ID'),
          pass: Cypress.env('EMAIL_PASS'),
        }),
      Cypress._.isObject,
      {
        timeout: 30000,
        delay: 5000,
        error: 'Message not found',
      }
    ).then((message) => {
      cy.task('parseEmail', { message })
        .its('html')
        .then((html) => {
          cy.document().then((document) => {
            document.body.innerHTML = html;
          });
        });
    });
  };
}

module.exports = new TestEmailInbox();
