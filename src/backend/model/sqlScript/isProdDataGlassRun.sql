-- glassRun query with additional fields indicating
-- a. source - whether the data originated from 天心排程外掛, or manually generated
-- b. existingIsProDataRecord
SELECT
	CASE
		WHEN b.id IS NOT NULL AND c.id IS NULL THEN b.id
		WHEN b.id IS NOT NULL AND b.id=c.id THEN b.id
		WHEN b.id IS NULL AND c.id IS NULL THEN NULL
		WHEN b.id IS NULL AND c.id IS NOT NULL THEN c.id
	END AS id
	,a.sampling
	,a.machno
	,a.glassProdLineID
	,a.schedate
	,a.prd_no
	,a.PRDT_SNM
	,a.PRDT_SPC
	,a.orderQty
	,a.created
	,a.modified
    -- if not matched within productionHistory.dbo.tbmkno, then it's determined that 天心外掛 is the source
	,CASE WHEN b.id IS NULL THEN 'tbmkno'
		ELSE 'generated'
	END AS source
    -- when c.id is not null, then an isProdData record exists
	,CASE WHEN c.id IS NULL THEN 0
		ELSE 1
	END AS existingIsProdDataRecord
FROM productionHistory.dbo.glassRun a
	LEFT JOIN productionHistory.dbo.tbmkno b ON a.id=b.id
	LEFT JOIN productionHistory.dbo.isProdData c
        -- 'existing' 'generated' record
		ON ((a.id IS NULL AND c.id IS NOT NULL AND a.machno=c.machno AND a.glassProdLineID=c.glassProdLineID AND a.schedate=c.schedate AND a.prd_no=c.prd_no)
        -- 'existing' 'tbmkno' record
		OR (a.id IS NOT NULL AND a.id=c.id));
