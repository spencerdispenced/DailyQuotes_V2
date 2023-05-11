const { fakeInput } = require('../../../fixtures/fakeNewUserData');
const HomePage = require('../../pages/homePage');
const TestEmailInbox = require('../../pages/testEmailInbox');
const StatusPage = require('../../pages/statusPage');

describe('Sign up form', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  const name = fakeInput.name;
  const email = fakeInput.email;

  context('Invalid form submission', () => {
    it('Should require both field inputs', () => {
      HomePage.signUpform.Btn().click();
      cy.get('.invalid-feedback').first().should('contain', 'Enter a username');
      cy.get('.invalid-feedback').eq(1).should('contain', 'Enter a valid email address');

      HomePage.signUpform.nameInput().type(name);

      HomePage.signUpform.Btn().click();
      cy.get('.invalid-feedback').eq(1).should('contain', 'Enter a valid email address');

      HomePage.signUpform.nameInput().clear();
      HomePage.signUpform.emailInput().type(email);
      HomePage.signUpform.Btn().click();

      cy.get('.invalid-feedback').eq(0).should('contain', 'Enter a username');
    });

    it('Does not allow duplicate emails to register', () => {
      cy.deleteMany({}).then((res) => {
        cy.log(res);
      });
      HomePage.newUserSignUp(name, email);
      cy.go('back');
      HomePage.clearForm();
      HomePage.newUserSignUp(name, email);

      cy.get('#errorFlash').should(($el) =>
        expect($el.text().trim()).to.equal('Email already used!')
      );
    });
  });

  context('Full confirmation flow on valid submission', () => {
    it(`Displays pending page on valid user signup,
        Sends confirmation email,
        Contains valid email body,
        Confirmation link goes to confirmed page,
        Reconfirming displays 'already confirmed' message`, () => {
      cy.deleteMany({}).then((res) => {
        cy.log(res);
      });
      // Enter form data
      HomePage.newUserSignUp(name, email);

      // Validate UI on pending page
      StatusPage.pending().find('h4').should('have.text', `Thanks ${name} for signing up!`);
      StatusPage.pending()
        .find('p')
        .should('have.text', `Confirm your email: ${email} to begin receiving Daily Quotes!`);

      // Get email sent to test inbox
      TestEmailInbox.goToInbox();

      // Validate email body
      TestEmailInbox.confirmationEmail().find('h1').should('have.text', 'Email Confirmation');
      TestEmailInbox.confirmationEmail().find('h2').should('have.text', `Hello ${name}`);
      TestEmailInbox.confirmationEmail()
        .find('p')
        .should(
          'have.text',
          'Thank you for subscribing. Please confirm your email by clicking on the following link:'
        );

      // Click confirmation link, validate Confirmed page
      TestEmailInbox.confirmEmailLink().click();
      StatusPage.confirmed().find('h4').should('have.text', `Thanks ${name} for signing up!`);
      StatusPage.confirmed()
        .find('p')
        .should('have.text', `${email} is confirmed. You will start receiving Daily Quotes!`);

      // Go back, try to confirm again
      TestEmailInbox.goToInbox();

      // Validate that Flash is now present on confirmation page
      TestEmailInbox.confirmEmailLink().click();
      cy.get('#successFlash').should(($el) =>
        expect($el.text().trim()).to.equal('You already confirmed!')
      );
    });
  });
});
