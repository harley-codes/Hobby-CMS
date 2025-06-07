# Hobby-CMS | [![ESLint](https://github.com/harley-codes/Hobby-CMS/actions/workflows/eslint.yml/badge.svg?branch=main)](https://github.com/harley-codes/Hobby-CMS/actions/workflows/eslint.yml) [![CodeQL](https://github.com/harley-codes/Hobby-CMS/actions/workflows/codeql.yml/badge.svg)](https://github.com/harley-codes/Hobby-CMS/actions/workflows/codeql.yml)

Headless CMS for anything, such as a blog or portfolio.

Using a block style building approach for content with various block types, including a WYSIWYG for fallback.

This supports simple sites, but can be leveraged in a more powerful way by utilizing the 'meta-editor'. Every project category, post, and post content block can have user defined meta data attached. Opening things up to the creativity of the user. Allowing you to handle custom logic on the front end of your site, defined from the CMS itself.

Hobby-Page is a complementing front-end that is still in development, a link will be added here in future for an example of how you can integrate your site.

## Development

- Frontend Framework - React [NextJS](https://nextjs.org/)
- Package manager - [Bun](https://bun.sh/)
- Database Frameworks
  - [Prisma](https://www.prisma.io/) with [CockroachDB](https://www.cockroachlabs.com).
  - [Prisma](https://www.prisma.io/) with [PostgresSQL](https://www.postgresql.org/).
- Authentication - [NextAuth](https://next-auth.js.org/) via Github login.

## Build and Run

These instructions are given for local build, however deployment to services such as Vercel should work out of the box. If not, please submit an [issue](https://github.com/harley-codes/Hobby-CMS/issues).

There is a [.env.template](/.env.template) file you can copy that lists out all the required environment variables that are used. **Note:** the prisma commands won't pick up on a _.env.local_ files anymore. Use _.env_ in your local development, or configure the respective environment variables elsewhere.

Authentication is basic yet secure, a github user id is nominated in the environment variables. Only login attempts from that user are successful. You can head to the GitHub's [developers](https://github.com/settings/developers) page to setup a developer for this application.

```bash
bun install

# Provider=prisma-cockroach, prisma-postgres
bun db:{provider}:generate
bun db:{provider}:push

bun dev
```

## Roadmap

- [x] v1.0.0 release 🥳
- [ ] Add additional analytic data to dashboard including logs.
- [ ] Add telemetry to track who is visiting the Public API.
- [x] Add Postgres DB support.
- [ ] Add bi-directional migration support for moving between DB providers.

##

### License - [MIT](/LICENSE)
