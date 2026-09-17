# XSS Lab — Professional Edition

A polished, modular, defensive XSS education website.

## Project structure

```text
XSS-Lab/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   ├── tokens.css
    │   ├── base.css
    │   ├── layout.css
    │   ├── components.css
    │   └── responsive.css
    └── js/
        ├── data.js
        ├── ui.js
        ├── lab.js
        ├── quiz.js
        └── app.js
```

The project is deliberately split by responsibility instead of putting the whole site into one giant file.

## Run

Open `index.html` in a modern browser, or serve the folder from a local static web server.

## Security design

- No API keys, credentials, authentication tokens, or secrets are included.
- The site uses a restrictive Content Security Policy and `connect-src 'none'`.
- User input is treated as untrusted.
- Code examples are rendered as escaped text.
- The Practice Lab uses `sandbox="allow-scripts"` without `allow-same-origin`.
- The Lab does not accept arbitrary external URLs and does not submit test payloads to servers.
- The Lab is fictional and educational.

## Responsible use

Only test systems you own or have explicit permission to assess.
