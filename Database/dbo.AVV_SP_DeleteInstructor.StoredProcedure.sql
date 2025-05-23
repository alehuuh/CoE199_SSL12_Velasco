USE [Attendance_Monitoring]
GO
/****** Object:  StoredProcedure [dbo].[AVV_SP_DeleteInstructor]    Script Date: 5/23/2025 10:14:02 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AVV_SP_DeleteInstructor]
@instructorcode varchar(50) = null
AS

----declare @studcode varchar(50)
----set @studcode = (select studcode from studentrec where studnum = @studnum)

If exists (Select 1 from subject_instructor where instructorcode = @instructorcode)
begin
	delete from subject_instructor where instructorcode = @instructorcode
end

If exists (Select 1 from instructorrec where instructorcode = @instructorcode)
begin
	delete from instructorrec where instructorcode = @instructorcode
end
GO
