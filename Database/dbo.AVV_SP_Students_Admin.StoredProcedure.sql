USE [Attendance_Monitoring]
GO
/****** Object:  StoredProcedure [dbo].[AVV_SP_Students_Admin]    Script Date: 5/23/2025 10:14:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Creating the procedure
CREATE PROCEDURE [dbo].[AVV_SP_Students_Admin]
	@subjectcode VARCHAR(50)
AS
Select distinct T0.studcode, T0.studnum, T0.studlname, T0.studfname, T0.studmi, T0.studrfid
from studentrec T0 inner join student_subject T1 ON T0.studcode = T1.studcode
GROUP BY T0.studcode, T0.studnum, T0.studlname, T0.studfname, T0.studmi, T0.studrfid

GO
