//------------------------------------------------------------------------------
// Einfache Anforderungen per Fetch-API
//------------------------------------------------------------------------------
// rev. 2, 14.12.2018, Bm
// rev. 1, 21.11.2018, Bm
//------------------------------------------------------------------------------

'use strict'

if (APPUTIL == undefined) {
   var APPUTIL = {};
}

APPUTIL.Requester = class {
   constructor () {
   }

   GET (path_spl) {
      return this.request_px('GET', path_spl);
   }

   POST (path_spl, data_opl) {
      return this.request_px('POST', path_spl, data_opl);
   }

   PUT (path_spl, data_opl) {
      return this.request_px('PUT', path_spl, data_opl);
   }

   DELETE (path_spl) {
      return this.request_px('DELETE', path_spl);
   }

   request_px (method_spl, path_spl, data_opl = null) {
      var f_o;
      if (data_opl != null) {
         // Content-Type mit Header-Objekt explizit bei der Anfrage angeben!
         let headers_o = new Headers();
         let body;
         if (data_opl instanceof FormData) {
            body = data_opl
         } else {
            headers_o.append('Content-Type', 'application/json');
            body = JSON.stringify(data_opl);
         }
         f_o = fetch(path_spl, {
            method: method_spl,
            headers: headers_o,
            cache: 'no-cache',
            body: body
         });
      } else {
         f_o = fetch(path_spl, {
            method: method_spl
            ,cache: 'no-cache'
         });
      }
      return f_o.then(function (response_opl) {
         if (response_opl.headers.get('Content-Type') == 'application/json') {
            return response_opl.json();
         } else {
            if (response_opl.ok) {
               return response_opl.text();
            } else {
               return Promise.resolve({
                  status: response_opl.status
               });
            }
         }
      })
      .catch(function (error_opl) {
         console.log('[Requester] fetch-Problem: ', error_opl.message);
         return Promise.reject({
            status: 500
            ,error: error_opl
         });
      });
   }
}

// EOF