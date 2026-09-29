(function(root){'use strict';
const ready=fetch('/api/public/bootstrap',{cache:'no-store'}).then(async response=>{if(!response.ok)throw new Error('HTTP '+response.status);const data=await response.json();if(!data.ok||!Array.isArray(data.records)||!data.filters)throw new Error('Respons bootstrap tidak lengkap');root.PPDK_RECORDS=data.records;root.PPDK_DATA=data;return data;});
ready.catch(function(){});root.PPDKData=Object.freeze({ready:ready});
})(window);
