-- Replace 'YOUR_HASHED_PASSWORD' with the output from generate-admin-hash.js
-- Replace 'Admin Name' and 'admin@example.com' with actual credentials

INSERT INTO admin (name, email, password) 
VALUES ('SysAdmin', 'admin@carrental.com', 'YOUR_HASHED_PASSWORD');
