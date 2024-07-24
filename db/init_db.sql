BEGIN TRANSACTION;
-- [dbo].[users_table]
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users_table](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](255) NOT NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
	[auth0_id] [nvarchar](50) NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[users_table] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[users_table] ADD UNIQUE NONCLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[users_table] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[users_table] ADD  DEFAULT (getdate()) FOR [updated_at]
GO

-- [dbo].][plaid_api_events_table]

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[plaid_api_events_table](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[item_id] [int] NULL,
	[user_id] [int] NULL,
	[plaid_method] [nvarchar](255) NOT NULL,
	[arguments] [nvarchar](max) NULL,
	[request_id] [nvarchar](255) NULL,
	[error_type] [nvarchar](255) NULL,
	[error_code] [nvarchar](255) NULL,
	[created_at] [datetime] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[plaid_api_events_table] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[plaid_api_events_table] ADD UNIQUE NONCLUSTERED 
(
	[request_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[plaid_api_events_table] ADD  DEFAULT (getdate()) FOR [created_at]
GO

-- [dbo].[link_events_table]

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[link_events_table](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[type] [nvarchar](255) NOT NULL,
	[user_id] [int] NULL,
	[link_session_id] [nvarchar](255) NULL,
	[request_id] [nvarchar](255) NULL,
	[error_type] [nvarchar](255) NULL,
	[error_code] [nvarchar](255) NULL,
	[status] [nvarchar](255) NULL,
	[created_at] [datetime] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[link_events_table] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[link_events_table] ADD UNIQUE NONCLUSTERED 
(
	[request_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[link_events_table] ADD  DEFAULT (getdate()) FOR [created_at]
GO

-- dbo.items_table 
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[items_table](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NULL,
	[plaid_access_token] [nvarchar](255) NOT NULL,
	[plaid_item_id] [nvarchar](255) NOT NULL,
	[plaid_institution_id] [nvarchar](255) NOT NULL,
	[status] [nvarchar](255) NOT NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
	[transactions_cursor] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[items_table] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[items_table] ADD UNIQUE NONCLUSTERED 
(
	[plaid_access_token] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[items_table] ADD UNIQUE NONCLUSTERED 
(
	[plaid_item_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[items_table] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[items_table] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[items_table]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users_table] ([id])
ON DELETE CASCADE
GO

-- accounts table 
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[accounts_table](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[item_id] [int] NULL,
	[plaid_account_id] [nvarchar](255) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[mask] [nvarchar](4) NOT NULL,
	[official_name] [nvarchar](255) NULL,
	[current_balance] [decimal](28, 10) NULL,
	[available_balance] [decimal](28, 10) NULL,
	[iso_currency_code] [nvarchar](3) NULL,
	[unofficial_currency_code] [nvarchar](3) NULL,
	[type] [nvarchar](50) NOT NULL,
	[subtype] [nvarchar](50) NOT NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[accounts_table] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[accounts_table] ADD UNIQUE NONCLUSTERED 
(
	[plaid_account_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[accounts_table] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[accounts_table] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[accounts_table]  WITH CHECK ADD FOREIGN KEY([item_id])
REFERENCES [dbo].[items_table] ([id])
ON DELETE CASCADE
GO

-- dbo.assets_table 
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[assets_table](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NULL,
	[value] [decimal](28, 2) NULL,
	[description] [nvarchar](255) NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[assets_table] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[assets_table] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[assets_table] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[assets_table]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users_table] ([id])
ON DELETE CASCADE
GO






-- [dbo].[transactions_table]
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[transactions_table](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[account_id] [int] NULL,
	[plaid_transaction_id] [nvarchar](255) NOT NULL,
	[plaid_category_id] [nvarchar](255) NULL,
	[category] [nvarchar](255) NULL,
	[subcategory] [nvarchar](255) NULL,
	[type] [nvarchar](255) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
	[amount] [decimal](28, 10) NOT NULL,
	[iso_currency_code] [nvarchar](3) NULL,
	[unofficial_currency_code] [nvarchar](3) NULL,
	[date] [date] NOT NULL,
	[pending] [bit] NOT NULL,
	[account_owner] [nvarchar](255) NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[transactions_table] ADD PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[transactions_table] ADD UNIQUE NONCLUSTERED 
(
	[plaid_transaction_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[transactions_table] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[transactions_table] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[transactions_table]  WITH CHECK ADD FOREIGN KEY([account_id])
REFERENCES [dbo].[accounts_table] ([id])
ON DELETE CASCADE
GO

-- VIEWS --------------------------------

-- VIEW [dbo].[accounts]
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[accounts]
AS
  SELECT
    a.id,
    a.plaid_account_id,
    a.item_id,
    i.plaid_item_id,
    i.user_id,
    a.name,
    a.mask,
    a.official_name,
    a.current_balance,
    a.available_balance,
    a.iso_currency_code,
    a.unofficial_currency_code,
    a.type,
    a.subtype,
    a.created_at,
    a.updated_at
  FROM
    accounts_table a
    LEFT JOIN items_table i ON i.id = a.item_id;
GO

--- VIEW [dbo].transactions]
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[transactions]
AS
SELECT
    t.id,
    t.plaid_transaction_id,
    t.account_id,
    a.plaid_account_id,
    a.item_id,
    a.plaid_item_id,
    a.user_id,
    t.category,
    t.subcategory,
    t.type,
    t.name,
    t.amount,
    t.iso_currency_code,
    t.unofficial_currency_code,
    t.date,
    t.pending,
    t.account_owner,
    t.created_at,
    t.updated_at
FROM
    transactions_table t
    LEFT JOIN accounts a ON t.account_id = a.id;

GO



-- commit transaction


COMMIT TRANSACTION;