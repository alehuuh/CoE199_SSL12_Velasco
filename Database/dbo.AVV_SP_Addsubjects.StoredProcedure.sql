USE [Attendance_Monitoring]
GO
/****** Object:  StoredProcedure [dbo].[AVV_SP_Addsubjects]    Script Date: 5/23/2025 10:14:02 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AVV_SP_Addsubjects]
@subjectcode varchar(50),
@description varchar(100),
@section varchar(100),
@classcode varchar(100)
AS

begin 
	Insert into subjects (subjectcode, description, section, classcode) 
		values (@subjectcode, @description, @section, @classcode)
end


GO
