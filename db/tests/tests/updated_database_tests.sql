
-- Begin Transaction
BEGIN TRANSACTION;

-- Data Integrity Tests

-- Ensure no NULL values in critical columns (e.g., username in users_table)
IF EXISTS (SELECT 1 FROM dbo.users_table WHERE username IS NULL)
    THROW 50000, 'Data Integrity Test: Username cannot be NULL', 1;
ELSE
    PRINT 'Data Integrity Test: Username non-null constraint validated';

-- Referential Integrity Tests

-- Ensure user_id in plaid_api_events_table exists in users_table
IF EXISTS (
    SELECT 1 
    FROM dbo.plaid_api_events_table pa
    LEFT JOIN dbo.users_table u ON pa.user_id = u.id
    WHERE u.id IS NULL
)
    THROW 50000, 'Referential Integrity Test: Invalid user_id in plaid_api_events_table', 1;
ELSE
    PRINT 'Referential Integrity Test: All user_ids in plaid_api_events_table are valid';

-- Ensure item_id in accounts_table exists in items_table
IF EXISTS (
    SELECT 1 
    FROM dbo.accounts_table a
    LEFT JOIN dbo.items_table i ON a.item_id = i.id
    WHERE i.id IS NULL
)
    THROW 50000, 'Referential Integrity Test: Invalid item_id in accounts_table', 1;
ELSE
    PRINT 'Referential Integrity Test: All item_ids in accounts_table are valid';

-- Uniqueness Tests

-- Ensure unique auth0_id in users_table
IF EXISTS (
    SELECT auth0_id
    FROM dbo.users_table
    GROUP BY auth0_id
    HAVING COUNT(*) > 1
)
    THROW 50000, 'Uniqueness Test: Duplicate auth0_id found in users_table', 1;
ELSE
    PRINT 'Uniqueness Test: All auth0_ids in users_table are unique';

-- Ensure unique plaid_account_id in accounts_table
IF EXISTS (
    SELECT plaid_account_id
    FROM dbo.accounts_table
    GROUP BY plaid_account_id
    HAVING COUNT(*) > 1
)
    THROW 50000, 'Uniqueness Test: Duplicate plaid_account_id found in accounts_table', 1;
ELSE
    PRINT 'Uniqueness Test: All plaid_account_ids in accounts_table are unique';

-- Value Range and Consistency Tests

-- Ensure no negative balances in accounts_table for depository accounts
IF EXISTS (
    SELECT 1
    FROM dbo.accounts_table
    WHERE type = 'depository' AND current_balance < 0
)
    THROW 50000, 'Value Range Test: Negative current_balance found in depository account', 1;
ELSE
    PRINT 'Value Range Test: All current_balances in depository accounts are non-negative';

-- Ensure positive transaction amounts for 'credit' type in transactions_table
IF EXISTS (
    SELECT 1
    FROM dbo.transactions_table
    WHERE type = 'credit' AND amount < 0
)
    THROW 50000, 'Value Range Test: Negative amount found for credit transaction', 1;
ELSE
    PRINT 'Value Range Test: Credit transaction amounts are positive';

-- Business Rule Validation Tests

-- Ensure transaction amounts align with account types in transactions_table
IF EXISTS (
    SELECT 1 
    FROM dbo.transactions_table
    WHERE (amount < 0 AND type IN ('investment', 'credit', 'depository')) OR (amount > 0 AND type = 'loan')
)
    THROW 50000, 'Business Rule Test: Inconsistent transaction amount and type', 1;
ELSE
    PRINT 'Business Rule Test: Transaction amount and type consistency validated';

-- Ensure valid status values in items_table
IF EXISTS (
    SELECT 1
    FROM dbo.items_table
    WHERE status NOT IN ('active', 'inactive')
)
    THROW 50000, 'Business Rule Test: Invalid status value found in items_table', 1;
ELSE
    PRINT 'Business Rule Test: Status values in items_table are valid';

-- End Transaction
COMMIT TRANSACTION;
