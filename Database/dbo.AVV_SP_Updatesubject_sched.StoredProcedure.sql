USE [Attendance_Monitoring]
GO
/****** Object:  StoredProcedure [dbo].[AVV_SP_Updatesubject_sched]    Script Date: 5/23/2025 10:14:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AVV_SP_Updatesubject_sched]
@schedcode varchar(50),
@subjectcode varchar(50),
@description varchar(100),
@sched_days varchar(50),
@sched_time_from time(7),
@sched_time_to time(7),
@section varchar(100),
@classcode varchar(100),
@room varchar(50)
AS

If exists (Select 1 from subject_sched where schedcode = @schedcode)
begin
	update subject_sched
	set 
		subjectcode = coalesce(@subjectcode, subjectcode),
		description = coalesce(@description, description),
		sched_days = coalesce(@sched_days, sched_days),
		sched_time_from = coalesce(@sched_time_from, sched_time_from),
		sched_time_to = coalesce(@sched_time_to, sched_time_to),
		section = coalesce(@section, section),
		classcode = coalesce(@classcode, classcode),
		room = coalesce(@room, room)
	where schedcode = @schedcode;
	RETURN 1
end
else
begin 
	insert into subject_sched (
		schedcode, subjectcode, description, sched_days, sched_time_from, sched_time_to, section, classcode, room)
	values (
		@schedcode, @subjectcode, @description, @sched_days, @sched_time_from, @sched_time_to, @section, @classcode, @room)
	RETURN 2
end
GO
