IF (SELECT TOP 1 username FROM users_table WHERE auth0_id = 'auth0|1234567890') = 'john_doe' 
PRINT 'Users-Test 1: This is a success' 
ELSE THROW 50000, 'Users-Test 1: This is a failure', 1;
GO