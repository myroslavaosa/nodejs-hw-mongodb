import path from 'path';

export const SORT_ORDER = {
    ASC: 'asc',
    DESC: 'desc',
};

export const SMTP = {
    SMTP_HOST: 'SMTP_HOST',
    SMTP_PORT: 'SMTP_PORT',
    SMTP_USER: 'SMTP_USER',
    SMTP_PASSWORD: 'SMTP_PASSWORD',
    SMTP_FROM: 'SMTP_FROM',
};

// Path to your Swagger JSON
export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'openapi.yaml');
