USE [Attendance_Monitoring]
GO
/****** Object:  StoredProcedure [dbo].[AVV_SP_Subjects_Instructors_Admin]    Script Date: 5/23/2025 10:14:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[AVV_SP_Subjects_Instructors_Admin]
AS
BEGIN
    WITH CombinedSchedules AS (
        SELECT 
            T0.subjectcode, 
            T0.description, 
            T1.sched_time_from,
            T1.sched_time_to,
			T1.section,
			T1.classcode,
            STRING_AGG(
                CASE 
                    WHEN T1.sched_days = 'Monday' THEN 'M'
                    WHEN T1.sched_days = 'Tuesday' THEN 'T'
                    WHEN T1.sched_days = 'Wednesday' THEN 'W'
                    WHEN T1.sched_days = 'Thursday' THEN 'Th'  -- ✅ Corrected for Thursday
                    WHEN T1.sched_days = 'Friday' THEN 'F'
                    WHEN T1.sched_days = 'Saturday' THEN 'S'
                    WHEN T1.sched_days = 'Sunday' THEN 'Su'
                END, ''
            ) AS GroupedDays
        FROM subjects T0
        INNER JOIN subject_sched T1 ON T0.subjectcode = T1.subjectcode
        GROUP BY T0.subjectcode, T0.description, T1.section, T1.classcode, T1.sched_time_from, T1.sched_time_to
    )
    SELECT 
		classcode,
        subjectcode,
        description,
		section,
        STRING_AGG(
            CONCAT(
                GroupedDays, -- MWF
                ' ',
                RIGHT(CONVERT(VARCHAR, sched_time_from, 100), 7), -- 3:30AM
                '-',
                RIGHT(CONVERT(VARCHAR, sched_time_to, 100), 7) -- 6:30AM
            ), '; ' -- Separate different schedules with ;
        ) AS Schedule
    FROM CombinedSchedules
    GROUP BY classcode, subjectcode, description, section;
END
GO
