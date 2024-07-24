-- TEST 1 --- 
IF 
(SELECT TOP 1 Amount FROM dbo.transactions WHERE account_id = 1)=100.00 
PRINT 'Transactions Test 1: Transaction Amount 100.00 is validated'
ELSE THROW 50000, 'Transactions Test 1 100.00 expected', 1;
GO

--- TEST 2 ---

IF 
(SELECT TOP 1 Amount FROM dbo.transactions WHERE account_id = 2)=50.00 
PRINT 'Transactions Test 2: Transaction Amount 50.00 is validated'
ELSE THROW 50000, 'Transactions Test 2: 50.00 expected', 1;
GO