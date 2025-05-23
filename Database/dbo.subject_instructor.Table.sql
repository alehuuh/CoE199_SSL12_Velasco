USE [Attendance_Monitoring]
GO
/****** Object:  Table [dbo].[subject_instructor]    Script Date: 5/23/2025 10:14:02 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[subject_instructor](
	[subjectinstructorcode] [varchar](50) NOT NULL,
	[subjectcode] [varchar](50) NULL,
	[instructorcode] [varchar](50) NULL,
 CONSTRAINT [PK_subject_instructor] PRIMARY KEY CLUSTERED 
(
	[subjectinstructorcode] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
