-- Reset password for admin user to a known value
UPDATE auth.users
SET encrypted_password = crypt('Agil@2026', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE email = 'contatoagilpersianas@gmail.com';