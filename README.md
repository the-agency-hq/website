# website

The [theagencyhq.dev](https://theagencyhq.dev/) website.

Built with [Hugo](https://gohugo.io/) (extended) and [Tailwind CSS v4](https://tailwindcss.com/).

## Requirements

* Hugo extended (`brew install hugo`)
* Node.js and npm

## Local development

Install the CSS toolchain once:

```bash
npm install
```

Then run the dev server:

```bash
hugo server
```

The site is served at http://localhost:1313/ with live reload.

## Production build

```bash
hugo --gc --minify
```

The generated site is written to `public/`.

## Layout

```
assets/css/main.css   Tailwind entry point and theme tokens
content/              Page front matter and prose
layouts/              Templates and partials
static/               Images, favicons, and other files copied as-is
```
