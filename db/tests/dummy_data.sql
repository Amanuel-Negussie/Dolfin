-- Begin Transaction
BEGIN TRANSACTION;

-- Insert into [dbo].[users_table]
INSERT INTO [dbo].[users_table] (username, created_at, updated_at, auth0_id)
VALUES 
('john_doe', GETDATE(), GETDATE(), 'auth0|1234567890'),
('jane_smith', GETDATE(), GETDATE(), 'auth0|0987654321');

-- Insert into [dbo].[plaid_api_events_table]
INSERT INTO [dbo].[plaid_api_events_table] (item_id, user_id, plaid_method, arguments, request_id, error_type, error_code, created_at)
VALUES 
(1, 1, 'connect', 'arg1,arg2', 'req1', NULL, NULL, GETDATE()),
(2, 2, 'disconnect', 'arg1,arg2', 'req2', 'type1', 'code1', GETDATE());

-- Insert into [dbo].[link_events_table]
INSERT INTO [dbo].[link_events_table] (type, user_id, link_session_id, request_id, error_type, error_code, status, created_at)
VALUES 
('link_created', 1, 'link1', 'req1', NULL, NULL, 'active', GETDATE()),
('link_deleted', 2, 'link2', 'req2', 'type2', 'code2', 'inactive', GETDATE());

-- Insert into [dbo].[items_table]
INSERT INTO [dbo].[items_table] (user_id, plaid_access_token, plaid_item_id, plaid_institution_id, status, created_at, updated_at, transactions_cursor)
VALUES 
(1, 'access_token_1', 'item1', 'institution1', 'active', GETDATE(), GETDATE(), 'cursor1'),
(2, 'access_token_2', 'item2', 'institution2', 'inactive', GETDATE(), GETDATE(), 'cursor2');

-- Insert into [dbo].[accounts_table]
INSERT INTO [dbo].[accounts_table] (item_id, plaid_account_id, name, mask, official_name, current_balance, available_balance, iso_currency_code, unofficial_currency_code, type, subtype, created_at, updated_at)
VALUES 
(1, 'account1', 'Checking Account', '1234', 'Official Checking', 1000.00, 950.00, 'USD', 'USD', 'checking', 'savings', GETDATE(), GETDATE()),
(2, 'account2', 'Savings Account', '5678', 'Official Savings', 5000.00, 4800.00, 'USD', 'USD', 'savings', 'retirement', GETDATE(), GETDATE());

-- Insert into [dbo].[assets_table]
INSERT INTO [dbo].[assets_table] (user_id, value, description, created_at, updated_at)
VALUES 
(1, 10000.00, 'Asset 1 Description', GETDATE(), GETDATE()),
(2, 20000.00, 'Asset 2 Description', GETDATE(), GETDATE());

-- Insert into [dbo].[transactions_table]
INSERT INTO [dbo].[transactions_table] (account_id, plaid_transaction_id, plaid_category_id, category, subcategory, type, name, amount, iso_currency_code, unofficial_currency_code, date, pending, account_owner, created_at, updated_at)
VALUES 
(1, 'trans1', 'category1', 'Category 1', 'Subcategory 1', 'credit', 'Transaction 1', 100.00, 'USD', 'USD', GETDATE(), 0, 'owner1', GETDATE(), GETDATE()),
(2, 'trans2', 'category2', 'Category 2', 'Subcategory 2', 'debit', 'Transaction 2', 50.00, 'USD', 'USD', GETDATE(), 1, 'owner2', GETDATE(), GETDATE());

-- Commit Transaction
COMMIT TRANSACTION;
