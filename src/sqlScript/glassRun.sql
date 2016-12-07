-- 由天心外掛擷取白瓶生產次數及相關內容
SELECT
	b.machno
	,CASE (machno) -- 轉換成通用玻璃產線稱號
		WHEN '1-1 1-1線' THEN 'L1-1'
		WHEN '01 1線' THEN 'L1'
		WHEN '02 2線' THEN 'L2'
		WHEN '03 3線' THEN 'L3'
		WHEN '04 5線' THEN 'L5'
		WHEN '05 6線' THEN 'L6'
		WHEN '06 7線' THEN 'L7'
		WHEN '07 8線' THEN 'L8'
	END AS glassProdLineID
	,b.schedate
	,b.prd_no
	,c.SNM AS PRDT_SNM
    ,c.SPC AS PRDT_SPC
	,b.orderQty
FROM (
    -- 以同產線、生產日期以及ERP產品編號區分生產次數
	SELECT a.machno,a.schedate,a.prd_no,SUM(CAST(a.allscheqty AS INT)) AS orderQty
	FROM Z_DB_U105.dbo.tbmkno a
	WHERE a.closed=1 -- 篩選已結案項目
	GROUP BY a.machno,a.schedate,a.prd_no) b
    -- 結合產品資料表以擷取較正確的白瓶編號
	INNER JOIN DB_U105.dbo.PRDT c ON b.prd_no=c.PRD_NO;
