# tools

A static, client-side collection of developer tools that run directly in the browser. Everything is computed locally — nothing leaves your device.

## Features

- **Client-Side Only**: All processing happens in your browser, ensuring your data never leaves your device.
- **JWT Key Generation**: Generates keys compatible with Convex Auth setup for secure authentication.
- **Base64 Encoder/Decoder**: Encode and decode text to and from Base64 (UTF-8 safe).
- **Simple UI**: Clean, focused interface for each tool.
- **No Installation Required**: Access directly via the hosted version – no dependencies to install.
- **Privacy-Focused**: Static site with no server-side processing or data collection.

## Live Demo

Try it out at: [https://chof64.github.io/tools](https://chof64.github.io/tools)

## Tools

### JWKS Generator

Generates a JWT private key and matching JWKS (JSON Web Key Set) for your Convex deployment. This wraps the key generation logic from [Convex Auth's manual setup guide](https://labs.convex.dev/auth/setup/manual).

The underlying process uses the `jose` library to:
1. Generate an RSA key pair (RS256 algorithm).
2. Export the private key in PKCS#8 format.
3. Create a JWKS with the public key.
4. Output the values for copying into your Convex environment variables.

### Base64 Encoder/Decoder

Encode text into Base64 or decode Base64 back into text. Uses the `TextEncoder`/`TextDecoder` APIs, so non-ASCII characters (accented letters, emoji, etc.) are handled correctly.

## Usage

1. Visit the live demo: [https://chof64.github.io/tools](https://chof64.github.io/tools)
2. Choose a tool from the navigation.
3. Follow the on-screen instructions for the selected tool.

### JWKS Generator

1. Click "Generate Keys" to create a new JWT private key and JWKS.
2. Copy the generated `JWT_PRIVATE_KEY` and `JWKS` values.
3. Paste them into your Convex deployment's [Environment Variables](https://dashboard.convex.dev/deployment/settings/environment-variables) page.
4. Follow the remaining steps in the [Convex Auth setup guide](https://labs.convex.dev/auth/setup/manual).

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
