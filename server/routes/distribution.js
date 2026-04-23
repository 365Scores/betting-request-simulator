import { Router } from "express";
import { getPool } from "../db.js";

const router = Router();

router.get("/", async (req, res) => {
  const { countryId, publisherId, appType } = req.query;

  // Platform filter after STRING_SPLIT
  let platformFilter;
  if (appType === "1")      platformFilter = `platform = 'iOS'`;
  else if (appType === "2") platformFilter = `platform = 'Android'`;
  else                      platformFilter = `platform IN ('iOS', 'Android')`;

  try {
    const pool = await getPool();
    const request = pool.request();

    let countryFilter   = "";
    let publisherFilter = "";

    if (countryId)   { request.input("countryId",   parseInt(countryId));   countryFilter   = "AND bmc.COUNTRY_ID   = @countryId";   }
    if (publisherId) { request.input("publisherId", parseInt(publisherId)); publisherFilter = "AND bmc.PUBLISHER_ID = @publisherId"; }

    const sql = `
      WITH Initial_table0 AS (
        SELECT
          c.COUNTRY_CODE  AS country_code,
          CASE
            WHEN lower(p.publisher) LIKE '%facebook%' THEN 'Facebook'
            WHEN bmc.PUBLISHER_ID   = -1             THEN 'Organic'
            ELSE p.publisher
          END AS publisher,
          bmc.AD_CAMPAIGN AS ad_campaign,
          CASE
            WHEN bmc.PLATFORM = -1 THEN 'Widgets + Web + iOS + Android'
            WHEN bmc.PLATFORM =  0 THEN 'None'
            WHEN bmc.PLATFORM =  1 THEN 'iOS'
            WHEN bmc.PLATFORM =  2 THEN 'Android'
            WHEN bmc.PLATFORM =  3 THEN 'iOS + Android'
            WHEN bmc.PLATFORM =  4 THEN 'Web'
            WHEN bmc.PLATFORM =  5 THEN 'Web + iOS'
            WHEN bmc.PLATFORM =  6 THEN 'Web + Android'
            WHEN bmc.PLATFORM =  8 THEN 'Widgets'
            WHEN bmc.PLATFORM =  9 THEN 'Widgets + iOS'
            WHEN bmc.PLATFORM = 10 THEN 'Widgets + Android'
            WHEN bmc.PLATFORM = 11 THEN 'Widgets + iOS + Android'
            WHEN bmc.PLATFORM = 12 THEN 'Widgets + Web'
            WHEN bmc.PLATFORM = 13 THEN 'Widgets + Web + iOS'
            WHEN bmc.PLATFORM = 14 THEN 'Widgets + Web + Android'
            WHEN bmc.PLATFORM = 15 THEN 'Widgets + Web + iOS + Android'
          END AS platform,
          CAST(bmc.SPONSORED AS INT) AS sponsored,
          dv.VALUE AS website,
          bmc.ORDER_RANK,
          bm.ORDER_RANK        AS order_rank_2,
          bmc.RANK_TIE_BREAKER,
          bm.RANK_TIE_BREAKER  AS rank_tie_breaker_2,
          CASE
            WHEN bmc.ORDER_RANK > 0 THEN bmc.ORDER_RANK
            WHEN bm.ORDER_RANK  > 0 THEN bm.ORDER_RANK
          END AS order_rank_final,
          CASE
            WHEN bmc.RANK_TIE_BREAKER = -1 THEN 100
            WHEN bmc.RANK_TIE_BREAKER  > 0 THEN bmc.RANK_TIE_BREAKER
            WHEN bm.RANK_TIE_BREAKER   > 0 THEN bm.RANK_TIE_BREAKER
          END AS rank_tie_breaker_final,
          bmc.COUNTRY_ID,
          bmc.PUBLISHER_ID,
          bmc.BOOKMAKER_ID,
          MAX(CAST(bmc.SPONSORED AS INT)) OVER (
            PARTITION BY c.COUNTRY_CODE, p.publisher, bmc.AD_CAMPAIGN
          ) AS max_sponsored
        FROM T_BET_BOOKMAKER_COUNTRIES bmc
        LEFT JOIN T_COUNTRIES c
          ON bmc.COUNTRY_ID = c.COUNTRY_ID
        LEFT JOIN (SELECT publisher_id, alias_name AS publisher FROM T_PUBLISHERS) p
          ON bmc.PUBLISHER_ID = p.publisher_id
        LEFT JOIN T_BET_BOOKMAKERS bm
          ON bmc.BOOKMAKER_ID = bm.BOOKMAKER_ID
        LEFT JOIN T_DICT_VALUES dv
          ON dv.TERM_ID = bm.NAME_ID AND dv.LANG_ID = 1
        LEFT JOIN T_BOOKMAKERS_COUNTRY_BAN ban
          ON bmc.COUNTRY_ID = ban.country_id AND bmc.BOOKMAKER_ID = ban.bookmaker_id
        WHERE ban.country_id IS NULL
          ${countryFilter}
          ${publisherFilter}
      ),

      Initial_table1 AS (
        SELECT *,
          LEN(platform) - LEN(REPLACE(platform, '+', '')) AS platform_priority
        FROM Initial_table0
        WHERE sponsored = max_sponsored
          AND publisher NOT IN (
            'Bolivia_Android (12989715023)',
            'AR_AND_GetBonus_C1 (16233230368)',
            'BE_AND_Inst_c1 (14742474141)',
            'BR_AND_Local_I1 (23849357435750784)',
            'Peru_Android (12989546149)',
            'Ecuador_Android (12989726591)',
            'BR_AND_365Owners_c8 (13136908947)',
            'BR_AND_AllScores_c6 (13059628045)',
            'BR_AND_BClicks_c10 (13551297012)',
            'BR_AND_BClicks_fb2 (23847571060470784)',
            'BR_AND_BClicks_fb6 (23847607172890784)',
            'BR_AND_Bclk_18-24_TT6&1707259034997809',
            'BR_AND_Bclk_25-34_TT7&1707258339454001',
            'BR_AND_Bclk_35-44_TT8&1707259434228770',
            'BR_AND_BFeatures_c11 (13551301326)',
            'BR_AND_BFeatures_fb5 (23847607162340784)',
            'BR_AND_Brazil_C14 (15718981820)',
            'BR_AND_Engagment_C22 (16091808178)',
            'BR_AND_Europe_C13 (15573268293)',
            'BR_AND_Features_C12 (15579236159)',
            'BR_AND_Get_18-24_TT9&1707259916801025',
            'BR_AND_Get_25-34_TT10&1707260692602930',
            'BR_AND_Get_35-44_TT11&1707261123450929',
            'BR_AND_Get_fb7 (23847793297560784)',
            'BR_AND_Get_ig1 (23847793858870784)',
            'BR_AND_GetBonus_c7 (13136881887)',
            'BR_AND_GetBonus_fb3 (23847571750820784)',
            'BR_AND_GetBonus_fb4 (23847607016330784)',
            'BR_AND_GetBonus_TT2&1704535411359762',
            'BR_AND_Inst_18-24_TT3&1707255995324434',
            'BR_AND_Inst_25-34_TT4&1707257111337985',
            'BR_AND_Inst_35-44_TT5&1707257449707570',
            'BR_AND_Installs_TT12&1726820022302769',
            'BR_AND_Local_F1',
            'BR_AND_Local_I1 (23849357435750784)',
            'BR_AND_Local-Football_C21 (16005459327)',
            'BR_AND_Minas-Gerais_C18 (15961830375)',
            'BR_AND_NoEvent_c9 (13309031751)',
            'BR_AND_NoEvents_TT1&1704092239402001',
            'BR_AND_Nordeste_C20 (15971506967)',
            'BR_AND_Rio_C17 (15971445011)',
            'BR_AND_Rio-Grande_C19 (15966649837)',
            'BR_AND_Sao-Paulo_C16 (15961762545)',
            'BR_AND_TROAS_C23 (16171572610)',
            'BR_AND_TROAS_DFP_C24 (16224695444)',
            'BR_AND_YouTube_C15 (15933540388)',
            'Brazil_Android_AllScores (13022647081)',
            'Brazil_Android_NoAds (12900411983)',
            'Brazil_Android_NoAds (23847177865900784)',
            'Brazil_Android_NoAds_c3 (13034798332)',
            'Brazil_Android_Players_c4 (13035171578)',
            'Brazil_Android_Usage_c5 (13033412331)',
            'Chile_Android (12987985887)',
            'CO_AND_GetBonus_c1 (14110605819)',
            'CO_AND_GetBonus_c2 (14328588193)',
            'CO_AND_Inst_all (23847955649790784)',
            'CO_AND_Installs_c1 (14110605819)',
            'ID_AND_Installs_c1 (14870445022)',
            'ID_AND_Installs_c3 (15068239584)',
            'Mexico_Android (13049812552)',
            'NL_AND_GetBonus_C2 (15300125415)',
            'NL_AND_Installs_C1 (15008097093)',
            'US_AND_AR_European-Soccer_c7 (16122081024)',
            'US_AND_EN_Best-Soccer-App_C1 (15629541112)',
            'US_AND_EN_European-Soccer_C6 (16098701249)',
            'US_AND_EN_Fast-Football-Alerts_C2 (15650514855)',
            'US_AND_EN_USMNT_C4 (15984668394)',
            'US_AND_ES_Best-Soccer-App_C3 (15718046332)',
            'US_AND_ES_Mexican-NT_C5 (16004937038)',
            'US_AND_GetBonus_c1 (14365068852)',
            'US_AND_GetBonus_c3 (14617349223)',
            'US_AND_Inst_fb1 (23848081708110784)',
            'US_AND_Inst_ig1 (23848082807900784)',
            'US_AND_Installs_c2 (14620338701)',
            'US_AND_NCAA_3-Sports_C9 (16501703481)',
            'US_AND_NCAA_BeFeat_C11 (16505841535)',
            'US_AND_NCAA_d3Ret_C10 (16505782288)',
            'US_AND_Soccer_3-Sports_C13 (16514317886)',
            'US_AND_Soccer_BeFeat_C15 (16506128083)',
            'US_AND_Soccer_d3Ret_C14 (16506080053)',
            'US_AND_Soccer_Wizard_C12 (16501856109)',
            'USA_NJ_AND (12948663084)',
            'NL_AND_Usage_C3 (15303585805)',
            'NL_AND_Wizard_C4 (15486957993)'
          )
          AND publisher NOT LIKE '%BR_AND_Local%'
      ),

      Initial_table2 AS (
        SELECT
          t1.country_code, t1.publisher, t1.publisher_id, t1.ad_campaign,
          TRIM(sv.[value]) AS platform,
          t1.website, t1.BOOKMAKER_ID, t1.order_rank_final, t1.rank_tie_breaker_final, t1.platform_priority,
          MIN(t1.platform_priority) OVER (
            PARTITION BY t1.country_code, t1.publisher, t1.ad_campaign, t1.website, TRIM(sv.[value])
          ) AS min_platform_priority
        FROM Initial_table1 t1
        CROSS APPLY STRING_SPLIT(t1.platform, '+') sv
      ),

      Initial_table3 AS (
        SELECT *,
          MAX(order_rank_final) OVER (
            PARTITION BY country_code, publisher, ad_campaign, platform, website
          ) AS max_order_rank_final
        FROM Initial_table2
        WHERE platform_priority = min_platform_priority
      ),

      Initial_table4 AS (
        SELECT *,
          rank_tie_breaker_final * 100.0
            / SUM(rank_tie_breaker_final) OVER (
                PARTITION BY country_code, publisher, ad_campaign, platform
              ) AS sov
        FROM Initial_table3
        WHERE order_rank_final = max_order_rank_final
      )

      SELECT
        platform,
        website        AS bookmaker,
        BOOKMAKER_ID   AS bookmakerId,
        ROUND(sov, 1)  AS sov
      FROM Initial_table4
      WHERE website IS NOT NULL
        AND sov > 0
        AND ${platformFilter}
      ORDER BY platform, sov DESC
    `;

    const result = await request.query(sql);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
