# Discover Ceylon

A bilingual English/Japanese travel website concept for private journeys in Sri Lanka. The site uses the existing Create React App setup.

## Run locally

```sh
npm install
npm start
```

Run the test suite with `npm test -- --watchAll=false --runInBand` and create a production build with `npm run build`.

## Editing the site

- Update the temporary brand and business contact placeholders in `src/config/business.js`.
- Update English and Japanese copy in `src/i18n/translations.js`.
- Update destination, tour, experience, and gallery content in `src/data/content.js`.
- Images are loaded from Unsplash URLs and require an internet connection.

The inquiry form is a frontend preview only. It does not transmit or store visitor information. Configure a real, secure contact integration and confirmed business contact details before accepting inquiries. WhatsApp is hidden until a business number is configured.
