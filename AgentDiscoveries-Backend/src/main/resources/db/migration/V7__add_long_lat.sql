ALTER TABLE locations ADD longitude FLOAT(10,6) NOT NULL DEFAULT 90.000000;
ALTER TABLE locations ADD latitude FLOAT(10,6) NOT NULL DEFAULT 135.000000;
UPDATE locations SET longitude = -0.124403, latitude = 51.487267 WHERE site_name = 'MI6';