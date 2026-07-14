CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    logo TEXT,
    category VARCHAR(100),
    featured BOOLEAN DEFAULT false,
    prices JSONB
);