USE [Attendance_Monitoring]
GO
/****** Object:  StoredProcedure [dbo].[AVV_SP_Updatestudentrec]    Script Date: 5/23/2025 10:14:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AVV_SP_Updatestudentrec]
@studcode varchar(50),
@studfname varchar(100) = null,
@studlname varchar(100) = null,
@coursecode varchar(50) = null,
@studnum varchar(50) = null,
@studrfid varchar(50) = null
AS

If exists (Select 1 from studentrec where studnum = @studnum)
begin
	update studentrec
	set 
		studfname = coalesce(@studfname, studfname),
		studlname = coalesce(@studlname, studlname),
		coursecode = coalesce(@coursecode, coursecode),
		studnum = coalesce(@studnum, studnum),
		studrfid = coalesce(@studrfid, studrfid)
	where studnum = @studnum;
	RETURN 1
end
else begin
	insert into studentrec (
		studcode, studfname, studlname, coursecode, studnum, studrfid)
	values(
		@studcode, @studfname, @studlname, @coursecode, @studnum, @studrfid)

	RETURN 2
end
GO
