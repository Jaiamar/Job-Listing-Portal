# Comprehensive Authentication & JWT Guide

## 1. Introduction to JWT
JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.

### JWT Structure
A JWT consists of three parts separated by dots (`.`):
1. **Header**: Contains token type (JWT) and signing algorithm (e.g., HS256 or RS256).
2. **Payload**: Contains the claims. This is the actual data you want to transmit.
3. **Signature**: Used to verify that the sender of the JWT is who it says it is and to ensure that the message wasn't changed along the way.

**Format**: `xxxxx.yyyyy.zzzzz`

---

## 2. Security Best Practices

When implementing authentication systems, adhere to these critical security measures:

### Token Storage
- **XSS (Cross-Site Scripting)**: Storing tokens in `localStorage` or `sessionStorage` makes them vulnerable to XSS attacks.
- **Best Practice Frontend**: Store the **Access Token** in memory (e.g., React state) or in an `HttpOnly`, `Secure`, `SameSite=Strict` cookie to prevent JavaScript access.
- Store the **Refresh Token** exclusively in an `HttpOnly` cookie.

### Token Configuration
- **Short Lifespan**: Access tokens should expire quickly (e.g., 10-15 minutes).
- **Refresh Token Rotation**: Issue a new Refresh Token every time the current one is utilized, invalidating the old one to prevent reuse.
- **Revocation List**: Maintain a list (in a DB like Redis) of revoked tokens or increment a token version on the user model to invalidate tokens upon password change or logout.

### Password Security
- Never store plain-text passwords.
- Always use a strong hashing algorithm like **Bcrypt** with a minimum of 10 salt rounds.

### Rate Limiting & Lockouts
- Apply rate limiting on authentication routes to prevent Brute Force and Credential Stuffing attacks.
- Implement soft locks (e.g., 15 minutes) after consecutive failed login attempts (e.g., 5 attempts).

---

## 3. Database Schema Design (Authentication Focused)

A typical User model should encompass fields specifically for security tracking:

\`\`\`javascript
{
  id: "uuid",                 // Subject (sub)
  email: "string",            // Indexed, Unique
  passwordHash: "string",     // Bcrypt hashed
  role: "string",             // e.g., 'user', 'admin'
  
  // Security Features
  loginAttempts: "number",    // Brute force tracking
  lockUntil: "datetime",      // Account lockout state
  passwordChangedAt: "date",  // To invalidate old JWTs
  
  // Refresh Tokens
  refreshTokens: ["string"],  // Array for multi-device support
  
  // 2FA / Verification
  isEmailVerified: "boolean",
  twoFactorEnabled: "boolean",
  twoFactorSecret: "string"
}
\`\`\`

---

## 4. Understanding Standard Security Claims

When constructing the JWT **Payload**, standard reserved claims should be used:

- `iss` (Issuer): Who created and signed this token (e.g., `https://api.myapp.com`).
- `sub` (Subject): Whom the token refers to, usually the unique User ID.
- `aud` (Audience): Who or what the token is intended for.
- `exp` (Expiration Time): Time after which the token is invalid (Unix timestamp).
- `iat` (Issued At): Time at which the JWT was issued.
- `jti` (JWT ID): Unique identifier for the token. Useful to prevent replay attacks and for constructing blocklists.

---

## 5. What Can Be Added to JWT Tokens?

Beyond standard claims, JWTs can be enriched to prevent continuous database lookups, providing a "stateless" authorization mechanism.

### User Information
- Primary identifiers: `email`, `name`, `username`.
- Authorization: `role`, `permissions` array, `subscriptionTier`.
- Status flags: `email_verified`, `is_onboarded`.

### Security Information
- `sessionId`: To map the token to an active database session.
- `amr` (Authentication Methods Reference): Indicates how the user authenticated (e.g., `pwd` for password, `mfa` for 2FA).
- IP Address or Device fingerprint (Use cautiously, as users switch IPs frequently on mobile).

### Application Data
- `orgId` / `tenantId`: For multi-tenant B2B applications, dictating scope.
- Feature flags or A/B testing cohort identifiers.

> ⚠️ **IMPORTANT SENSITIVE DATA RULE**
> Never put passwords, personal identifying secrets (SSNs), or sensitive API keys inside a JWT payload. The payload is merely base64 encoded, not encrypted. Anyone who intercepts the token can read its contents.

---

## 6. Advanced Authentication Features

### Two-Factor Authentication (2FA) / MFA
A robust authentication requires a second layer:
1. User logs in with Username + Password.
2. Server returns an intermediate JWT granting access *only* to the `/verify-2fa` route.
3. User submits TOTP (Time-based One-Time Password) from an authenticator app.
4. Server verifies TOTP and issues the standard Access Token + Refresh Token suite.

### OAuth / Single Sign-On (SSO)
Implement generic "Sign in with Google/GitHub" flows:
1. Client requests authentication from Google.
2. Client sends the received Google Auth Code token to the Backend.
3. Backend validates with Google, searches for an existing user or creates a new one.
4. Backend issues its *own* custom JWT identical to a standard login.

### Password Reset Flow
1. User requests reset.
2. Backend generates a distinct JWT (secret embedded with the user's current password hash) lasting exactly 10-15 minutes.
3. Link sent to email: `https://myapp.com/reset?token=xyz...`
4. When resetting, if the password was changed previously, the hash changes, inherently invalidating the reset token.
