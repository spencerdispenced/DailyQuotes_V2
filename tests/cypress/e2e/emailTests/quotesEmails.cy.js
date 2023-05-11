const { fakeInput } = require('../../../fixtures/fakeNewUserData');
const TestEmailInbox = require('../../pages/testEmailInbox');
const UnsubscribePage = require('../../pages/unsubscribePage');
const GoodbyePage = require('../../pages/goodbyePage');
const ErrorPage = require('../../pages/errorPage');


describe('Daily Quotes Emails', () => {
  const fakeUser = {
    name: fakeInput.name + '1',
    email: fakeInput.email.slice(0,16) + '+test1@gmail.com'
  }
  

  before(() => {
    //cy.exec('npm run seed-one-user-dev');
    //cy.exec('npm run send-emails-dev');

    cy.exec('npm run seed-one-user-test');
    cy.exec('npm run send-emails-test');
  });

  beforeEach(() => {
    TestEmailInbox.goToInbox();
  });

  context('User views quote email', () => {
    it('Quote email is properly formatted', () => {
      TestEmailInbox.quoteBody().invoke('text').should('not.be.empty');
      TestEmailInbox.quoteAuthor().invoke('text').should('not.be.empty');
      TestEmailInbox.unsubscribeMsg().should('have.text', `If you're sick of these quotes: Unsubscribe`);
      TestEmailInbox.unsubscribeLink().should('have.text', 'Unsubscribe');
    });
  });

  context('User decides to unsubscribe', () => {
    beforeEach(() => {
      TestEmailInbox.unsubscribeLink().click();
    });

    it('Clicking link goes to confirm unsubscribe page', () => {
      UnsubscribePage.nameMsg().should(
        'have.text',
        `${fakeUser.name}, are you sure you want to unsubscribe?`
      );
      UnsubscribePage.emailMsg().should(
        'have.text',
        `${fakeUser.email} will be removed from the mailing list.`
      );
      UnsubscribePage.confirmUnsubBtn().should('have.text', 'Confirm Unsubscribe');
    });

    it(`Clicking Confirm button unsubscribes user
        Reclicking Confirm button results in error`, () => {
      UnsubscribePage.confirmUnsubBtn().click();
      GoodbyePage.Msg()
        .find('h4')
        .should('have.text', `Sorry to see you go, you're dead to me now.`);

      GoodbyePage.Msg()
        .find('p')
        .should(
          'have.text',
          'Successfully unsubscribed. You will no longer receive Daily Quotes. :('
        );

      // Trying to unsubscribe again fails because user is already deleted
      TestEmailInbox.goToInbox();
      TestEmailInbox.unsubscribeLink().click();
      ErrorPage.msg().find('h4').should('have.text', 'ERROR: 400, User not found');
    });
  });
});
