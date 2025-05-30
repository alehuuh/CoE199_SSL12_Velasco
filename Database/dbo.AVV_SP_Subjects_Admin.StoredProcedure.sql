USE [Attendance_Monitoring]
GO
/****** Object:  StoredProcedure [dbo].[AVV_SP_Subjects_Admin]    Script Date: 5/23/2025 10:14:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AVV_SP_Subjects_Admin]

AS
Select distinct T0.schedcode, T0.subjectcode, T0.description, T0.section, T0.classcode, T0.room, T0.sched_days, T0.sched_time_from, T0.sched_time_to, count(T1.studcode) as studentcount

from subject_sched T0 inner join student_subject T1 on T0.subjectcode = T1.subjectcode
GROUP BY T0.schedcode, T0.subjectcode, T0.description, T0.section, T0.sched_days, T0.sched_time_from, T0.sched_time_to, T0.section, T0.classcode, T0.room




GO
