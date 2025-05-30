USE [Attendance_Monitoring]
GO
/****** Object:  Table [dbo].[instructorrec]    Script Date: 5/23/2025 10:14:02 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[instructorrec](
	[instructorcode] [varchar](50) NOT NULL,
	[instructor_fn] [varchar](100) NULL,
	[instructor_ln] [varchar](100) NULL,
	[instructor_mi] [varchar](50) NULL,
	[email] [varchar](100) NULL,
	[password] [varchar](250) NULL,
	[role] [varchar](50) NULL,
 CONSTRAINT [PK_instructorrec_new] PRIMARY KEY CLUSTERED 
(
	[instructorcode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
