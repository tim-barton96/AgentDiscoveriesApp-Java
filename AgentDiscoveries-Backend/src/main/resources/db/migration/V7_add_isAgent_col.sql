ALTER TABLE users ADD COLUMN agent BOOLEAN NOT NULL DEFAULT False;

UPDATE users SET agent = True WHERE username = 'test_agent';