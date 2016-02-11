var select_all_sales_data_query =  
                       "SELECT TOP 50 \"NAME_1\", \"NAME_2\", \"HKUNNR\", \"KUNNR\", \"VKBUR\", \"VKORG\", \"VTWEG\", \"SPART\", \"PROD\", \"SHADE\", \"PACK\", " +
" \"ATWTB\", \"MATNR\", \"MAKTX\", \"MON\", sum(\"VOL_CY1\") AS \"VOL_CY1\", sum(\"VOL_LY1\") AS \"VOL_LY1\", sum(\"VOL_GR\") AS \"VOL_GR\", " + 
"sum(\"GRS_CY1\") AS \"GRS_CY1\", sum(\"GRS_LY1\") AS \"GRS_LY1\", sum(\"GRS_GR\") AS \"GRS_GR\", sum(\"SAMT_CY1\") AS \"SAMT_CY1\", " + 
"sum(\"SAMT_LY1\") AS \"SAMT_LY1\", sum(\"SAMT_GR\") AS \"SAMT_GR\", sum(\"YTD_VOL_CY1\") AS \"YTD_VOL_CY1\", sum(\"YTD_VOL_LY1\") AS \"YTD_VOL_LY1\", " + 
"sum(\"YTD_VOL_GR\") AS \"YTD_VOL_GR\", sum(\"YTD_GRS_CY1\") AS \"YTD_GRS_CY1\", sum(\"YTD_GRS_LY1\") AS \"YTD_GRS_LY1\", " + 
"sum(\"YTD_GRS_GR\") AS \"YTD_GRS_GR\", sum(\"YTD_SAMT_CY1\") AS \"YTD_SAMT_CY1\", sum(\"YTD_SAMT_LY1\") AS \"YTD_SAMT_LY1\", sum(\"YTD_SAMT_GR\") AS \"YTD_SAMT_GR\" " + 
"FROM \"_SYS_BIC\".\"zzsd_hana/ZCV_SALES_REP\" ('PLACEHOLDER' = ('$$SPMON$$', '200401')) " + 
"GROUP BY \"NAME_1\", \"NAME_2\", \"HKUNNR\", \"KUNNR\", \"VKBUR\", \"VKORG\", \"VTWEG\", \"SPART\", \"PROD\", \"SHADE\", \"PACK\", \"ATWTB\", \"MATNR\", \"MAKTX\", \"MON\" ";
    function close(closables) {  
              var closable;  
              var i;  
              for (i = 0; i < closables.length; i++) {  
                        closable = closables[i];  
                        if(closable) {  
                                  closable.close();  
                        }  
              }  
    }  
    function getSalesData(){  
              var salesDataList = [];  
              var connection = $.db.getConnection();  
              var statement = null;  
              var resultSet = null;  
              try{  
                        statement = connection.prepareStatement(select_all_sales_data_query);  
                        resultSet = statement.executeQuery();  
                        var salesData;  
                 
                        while (resultSet.next()) {  
                                  salesData = {};  
                                  salesData.custno = resultSet.getString(4);  
                                  salesData.netAmount = resultSet.getDecimal(16);  
                                  salesData.grossAmount = resultSet.getDecimal(18);  
                                  salesDataList.push(salesData);  
                        }  
              } finally {  
                        close([resultSet, statement, connection]);  
              }  
              return salesDataList;  
    }  
    function doGet() {  
              try{  
                        $.response.contentType = "application/json";  
                        $.response.setBody(JSON.stringify(getSalesData()));  
              }  
              catch(err){  
                        $.response.contentType = "text/plain";  
                        $.response.setBody("Error while executing query: [" + err.message + "]");  
                        $.response.returnCode = 200;  
              }  
    }  
    doGet();  