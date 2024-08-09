-- Create Database
CREATE DATABASE DolfinDB;
GO

-- Switch to the newly created database
USE [DolfinDB]
GO
/****** Object:  Table [dbo].[transactions_table]    Script Date: 2024-08-07 11:48:51 AM ******/
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
	[amount] [decimal](18, 0) NULL,
	[iso_currency_code] [nvarchar](3) NULL,
	[unofficial_currency_code] [nvarchar](3) NULL,
	[date] [date] NOT NULL,
	[pending] [bit] NOT NULL,
	[account_owner] [nvarchar](255) NULL,
	[logo_url] [nvarchar](255) NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
	[frequency] [int] NULL,
	[last_transaction_date] [date] NULL,
 CONSTRAINT [PK__transact__3213E83F57E64497] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ__transact__DFCAD0995D73BB7B] UNIQUE NONCLUSTERED 
(
	[plaid_transaction_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[accounts_table]    Script Date: 2024-08-07 11:48:51 AM ******/
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
	[logo_url] [nvarchar](max) NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
 CONSTRAINT [PK__accounts__3213E83F64501EE6] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
 CONSTRAINT [UQ__accounts__8FBDE4EE24CDEE04] UNIQUE NONCLUSTERED 
(
	[plaid_account_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[items_table]    Script Date: 2024-08-07 11:48:51 AM ******/
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
	[transactions_cursor] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[plaid_access_token] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[plaid_item_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[accounts]    Script Date: 2024-08-07 11:48:51 AM ******/
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
/****** Object:  View [dbo].[transactions]    Script Date: 2024-08-07 11:48:51 AM ******/
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
	t.logo_url,
    t.created_at,
    t.updated_at,
	t.last_transaction_date,
	t.frequency,
	a.official_name
FROM
    transactions_table t
    LEFT JOIN accounts a ON t.account_id = a.id;
GO
/****** Object:  Table [dbo].[assets_table]    Script Date: 2024-08-07 11:48:51 AM ******/
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
	[updated_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[budget_table]    Script Date: 2024-08-07 11:48:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[budget_table](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[category] [nvarchar](255) NOT NULL,
	[budgeted_value] [decimal](10, 2) NOT NULL,
	[actual_value] [decimal](10, 2) NOT NULL,
	[remaining_value]  AS ([budgeted_value]-[actual_value]) PERSISTED,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[income_bills_table]    Script Date: 2024-08-07 11:48:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[income_bills_table](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[user_id] [int] NOT NULL,
	[income] [decimal](10, 2) NOT NULL,
	[bills] [decimal](10, 2) NOT NULL,
	[created_at] [datetime2](7) NULL,
	[updated_at] [datetime2](7) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[link_events_table]    Script Date: 2024-08-07 11:48:51 AM ******/
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
	[created_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[request_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[plaid_api_events_table]    Script Date: 2024-08-07 11:48:51 AM ******/
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
	[created_at] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[request_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[users_table]    Script Date: 2024-08-07 11:48:51 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[users_table](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[username] [nvarchar](255) NOT NULL,
	[created_at] [datetime] NULL,
	[updated_at] [datetime] NULL,
	[auth0_id] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[username] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[accounts_table] ADD  CONSTRAINT [DF__accounts___creat__4BAC3F29]  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[accounts_table] ADD  CONSTRAINT [DF__accounts___updat__4CA06362]  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[assets_table] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[assets_table] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[budget_table] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[budget_table] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[income_bills_table] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[income_bills_table] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[items_table] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[items_table] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[link_events_table] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[plaid_api_events_table] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[transactions_table] ADD  CONSTRAINT [DF__transacti__creat__6383C8BA]  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[transactions_table] ADD  CONSTRAINT [DF__transacti__updat__6477ECF3]  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[users_table] ADD  DEFAULT (getdate()) FOR [created_at]
GO
ALTER TABLE [dbo].[users_table] ADD  DEFAULT (getdate()) FOR [updated_at]
GO
ALTER TABLE [dbo].[accounts_table]  WITH CHECK ADD  CONSTRAINT [FK__accounts___item___571DF1D5] FOREIGN KEY([item_id])
REFERENCES [dbo].[items_table] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[accounts_table] CHECK CONSTRAINT [FK__accounts___item___571DF1D5]
GO
ALTER TABLE [dbo].[assets_table]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users_table] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[budget_table]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users_table] ([id])
GO
ALTER TABLE [dbo].[income_bills_table]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users_table] ([id])
GO
ALTER TABLE [dbo].[items_table]  WITH CHECK ADD FOREIGN KEY([user_id])
REFERENCES [dbo].[users_table] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[transactions_table]  WITH CHECK ADD  CONSTRAINT [FK__transacti__accou__656C112C] FOREIGN KEY([account_id])
REFERENCES [dbo].[accounts_table] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[transactions_table] CHECK CONSTRAINT [FK__transacti__accou__656C112C]
GO
