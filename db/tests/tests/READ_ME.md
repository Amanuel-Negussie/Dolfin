# Database Testing Report

This report outlines the tests conducted on the database schema and data integrity. The focus is on ensuring data consistency, correctness, and adherence to business rules.

## Test Categories

### 1. Data Integrity Tests
These tests ensure that critical fields contain valid and non-null values to maintain the integrity and reliability of the data.

- **Test 1: Non-Null Usernames**
  - **Description:** Checks that the `username` field in the `users_table` is not null.
  - **Purpose:** Ensures that every user has a unique identifier, which is crucial for authentication and identification.

- **Test 2: Non-Null Auth0 IDs**
  - **Description:** Checks that the `auth0_id` field in the `users_table` is not null.
  - **Purpose:** Auth0 IDs are essential for linking users to their authentication profiles. This test ensures that no user entry is missing this critical link.

### 2. Referential Integrity Tests
These tests verify that foreign keys and related fields correctly reference existing entries in the database, maintaining consistent relationships between tables.

- **Test 3: Valid User IDs in Related Tables**
  - **Description:** Ensures that `user_id` in tables like `plaid_api_events_table`, `link_events_table`, and `items_table` references an existing user in the `users_table`.
  - **Purpose:** Prevents orphaned records and maintains data consistency across related entities.

- **Test 4: Valid Item IDs in Accounts Table**
  - **Description:** Verifies that `item_id` in the `accounts_table` references an existing item in the `items_table`.
  - **Purpose:** Ensures that accounts are properly linked to items, maintaining accurate tracking of financial data.

### 3. Uniqueness Tests
These tests check that certain fields, which are meant to be unique identifiers, do not contain duplicate values.

- **Test 5: Unique Auth0 IDs**
  - **Description:** Checks that the `auth0_id` field in the `users_table` is unique.
  - **Purpose:** Ensures that each user can be uniquely identified and associated with a single Auth0 profile.

- **Test 6: Unique Plaid Account IDs**
  - **Description:** Ensures that the `plaid_account_id` in the `accounts_table` is unique.
  - **Purpose:** Prevents confusion and data errors that could arise from having multiple accounts with the same identifier.

### 4. Value Range and Consistency Tests
These tests verify that the data adheres to expected ranges or consistency rules, particularly for financial data.

- **Test 7: Non-Negative Balances for Depository Accounts**
  - **Description:** Checks that the `current_balance` and `available_balance` fields in depository accounts are not negative.
  - **Purpose:** Prevents inconsistencies in financial data, ensuring that balances reflect reality and do not suggest erroneous overdrafts unless explicitly allowed.

- **Test 8: Valid Transaction Amounts**
  - **Description:** Ensures that transaction amounts in the `transactions_table` are consistent with the type of transaction (`debit` or `credit`).
  - **Purpose:** Validates that debits (money out) are negative and credits (money in) are positive, aligning with standard financial practices.

### 5. Business Rule Validation Tests
These tests confirm that the data aligns with business logic and rules specific to the application's domain.

- **Test 9: Account Type and Status Consistency**
  - **Description:** Verifies that the `status` field in the `items_table` is either 'active' or 'inactive'.
  - **Purpose:** Ensures that accounts have valid statuses that reflect their current state in the system.

- **Test 10: Plaid Integration Data Integrity**
  - **Description:** Checks that critical fields like `plaid_access_token` and `plaid_item_id` in the `items_table` are not null.
  - **Purpose:** Ensures the integrity of data required for integration with the Plaid API, which is crucial for accessing financial data.

## Conclusion

The tests conducted provide a comprehensive check of the database's structure and data integrity, ensuring that critical fields are valid, relationships between tables are consistent, and data adheres to business rules. These tests are crucial for maintaining the accuracy and reliability of the system, especially in handling sensitive financial information.
