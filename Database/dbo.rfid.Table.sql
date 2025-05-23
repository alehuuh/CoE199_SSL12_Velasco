USE [Attendance_Monitoring]
GO
/****** Object:  Table [dbo].[rfid]    Script Date: 5/23/2025 10:14:02 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[rfid](
	[id] [int] IDENTITY(1,1) NOT FOR REPLICATION NOT NULL,
	[rfid] [varchar](50) NULL,
 CONSTRAINT [PK_rfid] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
