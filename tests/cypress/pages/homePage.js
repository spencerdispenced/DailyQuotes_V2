class HomePage {
  signUpform = {
    nameInput: () => cy.get('[data-cy="signup-name-input"]'),
    emailInput: () => cy.get('[data-cy="signup-email-input"]'),
    Btn: () => cy.get('[data-cy="submit-signup-form"]'),
  };

  newUserSignUp = (name, email) => {
    this.signUpform.nameInput().type(name);
    this.signUpform.emailInput().type(email);
    this.signUpform.Btn().click();
  };

  clearForm = () => {
    this.signUpform.nameInput().clear();
    this.signUpform.emailInput().clear();
  };
}

module.exports = new HomePage();
