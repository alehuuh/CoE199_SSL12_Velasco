USE [Attendance_Monitoring]
GO
/****** Object:  Table [dbo].[student_subject]    Script Date: 5/23/2025 10:14:02 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[student_subject](
	[studsubjectcode] [varchar](50) NOT NULL,
	[studcode] [varchar](50) NULL,
	[subjectcode] [varchar](50) NULL,
 CONSTRAINT [PK_student_subject] PRIMARY KEY CLUSTERED 
(
	[studsubjectcode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
