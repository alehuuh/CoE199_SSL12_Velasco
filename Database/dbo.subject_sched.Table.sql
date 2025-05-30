USE [Attendance_Monitoring]
GO
/****** Object:  Table [dbo].[subject_sched]    Script Date: 5/23/2025 10:14:02 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[subject_sched](
	[schedcode] [varchar](50) NOT NULL,
	[subjectcode] [varchar](50) NULL,
	[description] [varchar](100) NULL,
	[sched_days] [varchar](50) NULL,
	[sched_time_from] [time](7) NULL,
	[sched_time_to] [time](7) NULL,
	[section] [varchar](100) NULL,
	[classcode] [varchar](100) NULL,
	[room] [varchar](50) NULL,
 CONSTRAINT [PK_subject_sched] PRIMARY KEY CLUSTERED 
(
	[schedcode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
