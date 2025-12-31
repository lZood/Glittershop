const crypto = require('crypto');

function base64UrlEncode(str) {
    return Buffer.from(str)
        .toString('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function signJwt(payload, secret) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));

    const signature = crypto
        .createHmac('sha256', secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64')
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

const jwtSecret = crypto.randomBytes(32).toString('hex');

const anonPayload = {
    role: 'anon',
    iss: 'supabase',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365 * 10), // 10 years
};

const servicePayload = {
    role: 'service_role',
    iss: 'supabase',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365 * 10), // 10 years
    admin: true,
};

const anonKey = signJwt(anonPayload, jwtSecret);
const serviceKey = signJwt(servicePayload, jwtSecret);

console.log('--- COPIA ESTOS VALORES EN TU DOCKPLOY ---');
console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`ANON_KEY=${anonKey}`);
console.log(`SERVICE_ROLE_KEY=${serviceKey}`);
console.log('------------------------------------------');
