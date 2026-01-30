# jwks

A static, client-side web application for generating JWT (JSON Web Token) private keys and JWKS (JSON Web Key Sets) directly in the browser. This tool provides a user-friendly interface to the manual key generation process described in Convex Auth documentation, enhancing privacy and security by performing all computations locally without sending data to external servers.

## Features

- **Client-Side Generation**: All key generation happens in your browser, ensuring your private keys never leave your device.
- **Convex Auth Integration**: Generates keys compatible with Convex Auth setup for secure authentication.
- **Simple UI**: Web-based interface for the `generateKeys.mjs` script from Convex Labs.
- **No Installation Required**: Access directly via the hosted version – no dependencies to install.
- **Privacy-Focused**: Static site with no server-side processing or data collection.

## Live Demo

Try it out at: [https://chof64.github.io/jwks](https://chof64.github.io/jwks)

## How It Works

This application wraps the key generation logic from [Convex Auth's manual setup guide](https://labs.convex.dev/auth/setup/manual). Instead of running the Node.js script locally, you can use the web interface to generate the required `JWT_PRIVATE_KEY` and `JWKS` values for your Convex deployment.

The underlying process uses the `jose` library to:
1. Generate an RSA key pair (RS256 algorithm).
2. Export the private key in PKCS#8 format.
3. Create a JWKS with the public key.
4. Output the values for copying into your Convex environment variables.

All operations are performed client-side using JavaScript crypto APIs and the `jose` library, ensuring your keys remain private.

## Usage

1. Visit the live demo: [https://chof64.github.io/jwks](https://chof64.github.io/jwks)
2. Click "Generate Keys" to create a new JWT private key and JWKS.
3. Copy the generated `JWT_PRIVATE_KEY` and `JWKS` values.
4. Paste them into your Convex deployment's [Environment Variables](https://dashboard.convex.dev/deployment/settings/environment-variables) page.
5. Follow the remaining steps in the [Convex Auth setup guide](https://labs.convex.dev/auth/setup/manual).

## Privacy & Security

- No data is transmitted or stored externally.
- Keys are generated and displayed only in your browser.
- The application is a static site hosted on GitHub Pages.
- Refresh the page to clear all generated data from memory.

## Tech Stack

- **Frontend**: Astro with React.js
- **Crypto Library**: [jose](https://github.com/panva/jose) for JWT/JWK operations
- **Hosting**: GitHub Pages for static deployment

## License

[MIT License](LICENSE) - Feel free to use and modify as needed.

## Related Links

- [Convex Auth Documentation](https://labs.convex.dev/auth)
- [Convex Auth Manual Setup](https://labs.convex.dev/auth/setup/manual)
- [JOSE Library](https://github.com/panva/jose)
