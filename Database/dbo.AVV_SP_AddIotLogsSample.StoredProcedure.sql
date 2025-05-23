USE [Attendance_Monitoring]
GO
/****** Object:  StoredProcedure [dbo].[AVV_SP_AddIotLogsSample]    Script Date: 5/23/2025 10:14:02 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AVV_SP_AddIotLogsSample]
@rfid varchar(50),
@timestamp datetime2
AS



/* insert code to check if rfid belongs to class on the time of tapping */

select distinct T2.description, t3.sched_days, t3.sched_time_from, T3.sched_time_to into #studSched from studentrec T0
	inner join student_subject T1 on T0.studcode = T1.studcode 
	inner join subjects T2 on T1.subjectcode = T2.subjectcode 
	inner join subject_sched T3 on T2.subjectcode = T3.subjectcode where T0.studrfid = @rfid and T3.sched_days = DATENAME(dw, @timestamp)
	and (cast(@timestamp as time) >= t3.sched_time_from and cast(@timestamp as time) <= t3.sched_time_to)

select * from #studSched



GO
