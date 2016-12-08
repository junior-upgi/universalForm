-- 由天心外掛擷取白瓶每次生產的細節資料
SELECT
	a.machno
	,a.glassProdLineID
	,a.schedate
	,a.prd_no
	,d.PRD_MARK
	,a.PRDT_SNM
    ,a.orderQty
	,a.PRDT_SPC
	,e.REM AS SPC_NAME
	,b.mk_no
	,CASE LEN(b.mk_no) -- 拆出業務訂單號
		WHEN 17 THEN SUBSTRING(b.mk_no,0,13)
		WHEN 18 THEN SUBSTRING(b.mk_no,0,14)
	END AS OS_NO
	,CASE LEN(b.mk_no) -- 拆出訂單項次
		WHEN 17 THEN SUBSTRING(b.mk_no,14,1)
		WHEN 18 THEN SUBSTRING(b.mk_no,15,1)
	END AS ITM
	,b.cus_no
	,c.SNM AS CUS_SNM
FROM productionHistory.dbo.glassRun a
    -- 與天心排程外掛資料表結合擷取細節資料
	INNER JOIN Z_DB_U105.dbo.tbmkno b ON a.machno=b.machno AND a.schedate=b.schedate AND a.prd_no=b.prd_no
	INNER JOIN DB_U105.dbo.CUST c ON b.cus_no=c.CUS_NO -- 客戶細節查詢
	INNER JOIN DB_U105.dbo.TF_POS d ON -- 受訂單資料查詢
		d.OS_ID='SO' AND
		CASE LEN(b.mk_no)
			WHEN 17 THEN SUBSTRING(b.mk_no,0,13)
			WHEN 18 THEN SUBSTRING(b.mk_no,0,14)
		END = d.OS_NO AND
		CASE LEN(b.mk_no)
			WHEN 17 THEN SUBSTRING(b.mk_no,14,1)
			WHEN 18 THEN SUBSTRING(b.mk_no,15,1)
		END = d.ITM
    -- 與玻璃(MOB_ID=01)特徵資料比對，抓取原始訂單白瓶的計劃加工
	INNER JOIN DB_U105.dbo.PRD_MARK e ON d.PRD_MARK=e.PRD_MARK AND e.MOB_ID='01';
