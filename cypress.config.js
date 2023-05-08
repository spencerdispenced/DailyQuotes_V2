const { defineConfig } = require('cypress');
const mongo = require('cypress-mongodb');
const { getLastEmail, parseEmail } = require('./tests/cypress/plugins/testEmailAccount');

module.exports = defineConfig({
  fixturesFolder: 'tests/cypress/fixtures',
  screenshotsFolder: 'tests/cypress/screenshots',
  videosFolder: 'tests/cypress/videos',
  downloadsFolder: 'tests/cypress/downloads',
  chromeWebSecurity: false,
  e2e: {
    setupNodeEvents: async (on, config) => {
      // implement node event listeners here
      mongo.configurePlugin(on);

      on('task', {
        async getLastEmail({ user, pass }) {
          const getEmail = await getLastEmail(user, pass);
          return getEmail;
        },

        async parseEmail({ message }) {
          const email = await parseEmail(message);
          return email;
        },
      });
    },
    baseUrl: 'http://localhost:3000',
    supportFile: 'tests/cypress/support/e2e.js',
    video: false,
    specPattern: 'tests/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
});
