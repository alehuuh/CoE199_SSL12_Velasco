USE [Attendance_Monitoring]
GO
/****** Object:  StoredProcedure [dbo].[AVV_SP_AddCourses]    Script Date: 5/23/2025 10:14:02 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AVV_SP_AddCourses]
@coursecode varchar(50),
@description varchar(100)
AS
Insert into courses (coursecode, description) 
	values (@coursecode, @description)


GO
