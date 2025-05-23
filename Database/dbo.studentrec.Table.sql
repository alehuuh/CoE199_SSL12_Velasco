USE [Attendance_Monitoring]
GO
/****** Object:  Table [dbo].[studentrec]    Script Date: 5/23/2025 10:14:02 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[studentrec](
	[studcode] [varchar](50) NOT NULL,
	[studfname] [varchar](100) NULL,
	[studlname] [varchar](100) NULL,
	[studmi] [varchar](15) NULL,
	[coursecode] [varchar](50) NULL,
	[studnum] [varchar](50) NULL,
	[studrfid] [varchar](50) NULL,
 CONSTRAINT [PK_studentrec] PRIMARY KEY CLUSTERED 
(
	[studcode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
