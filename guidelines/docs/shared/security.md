<!-- Activation mode: Always On -->
<!-- DO NOT MODIFY — update from the dev-guidelines repository -->

# Security

- Never hardcode secrets, API keys, tokens, or credentials.
- Use environment variables or `environment.ts` for sensitive configuration.
- Never log sensitive data (tokens, passwords, personal information).
- Validate all user input before processing.
- Sanitize user-generated content to prevent XSS attacks.
- Use Angular's built-in sanitization services (`DomSanitizer`) when handling dynamic HTML.
