# Cassmo Homes — Website

A marketing website for **Cassmo Homes**, a real estate company in Abuja, Nigeria.
Built with **Next.js 14 (App Router)** and **Tailwind CSS**.

*Redefining Comfort And Hospitality.*

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Build for production

```bash
npm run build
npm start
```

## Structure

```
app/
  layout.jsx        # shell: navbar + footer, metadata
  page.jsx          # Home
  about/page.jsx    # Mission, vision, values
  services/page.jsx # Core + full capabilities
  gallery/page.jsx  # Campaigns + brand applications
  contact/page.jsx  # Details + message form
components/          # Navbar, Footer, Logo (SVG), Reveal, ContactForm, data
public/images/       # Brand images from the identity PDF
```

## Notes

- Brand colors, the SVG logo mark, and the orange "sharp-corner" bracket motif
  are all derived from the Cassmo Homes brand identity.
- Fonts (Fraunces + Inter) load from Google Fonts — you need an internet
  connection the first time.
- The contact form is front-end only. Wire `handleSubmit` in
  `components/ContactForm.jsx` to an API route or email service to go live.
