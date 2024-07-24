-- TEST 1 --- 
IF 
(SELECT TOP 1 Amount FROM dbo.transactions WHERE account_id = 1)=100.00 
PRINT 'Transaction Amount 100.00 is validated'
ELSE THROW 50000, '100.00 expected but received', 1;
GO

--- TEST 2 ---

IF 
(SELECT TOP 1 Amount FROM dbo.transactions WHERE account_id = 2)=50.00 
PRINT 'Transaction Amount 100.00 is validated'
ELSE THROW 50000, '100.00 expected but received', 1;
GO