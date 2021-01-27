//------------------------------------------------------------------------------
// Template-Manager
// - Laden und Bereitstellen von Template-Quellen
// - setzt evs.js und tco.js voraus
//------------------------------------------------------------------------------
// rev. 2, 18.12.2020, Bm
// rev. 1, 21.11.2018, Bm
//------------------------------------------------------------------------------

'use strict'

if (APPUTIL == undefined) {
   var APPUTIL = {};
}

APPUTIL.TemplateManager = class {
   constructor () {
      if (!APPUTIL.TemplateManager.instance) {
         APPUTIL.TemplateManager.instance = this;
         this.templates_o = {};
         this.compiled_o  = {};
         this.teCompiler_o = new APPUTIL.TemplateCompiler();
      }
      return APPUTIL.TemplateManager.instance;
   }

   init_px () {
      // Templates als Ressource anfordern und speichern
      let path_s = "/templates/";
      let requester_o = new APPUTIL.Requester();
      requester_o.GET(path_s)
      .then (result_spl => {
         this.templates_o = JSON.parse(result_spl)['templates'];
         APPUTIL.event_service.publish_px("templates.loaded", null);
      })
      .catch (error_opl => {
         APPUTIL.event_service.publish_px("templates.failed", "");
      });
   }

   get (name_spl) {
      if (name_spl in this.templates_o) {
         return this.templates_o[name_spl];
      } else {
         return null;
      }
   }

   execute_px (name_spl, data_opl) {
      var compiled_o = null;
      if (name_spl in this.compiled_o) {
         compiled_o = this.compiled_o[name_spl];
      } else {
         // Übersetzen und ausführen
         if (name_spl in this.templates_o) {
            this.teCompiler_o.reset_px();
            compiled_o = this.teCompiler_o.compile_px(this.templates_o[name_spl]);
            this.compiled_o[name_spl] = compiled_o;
         }
      }
      if (compiled_o != null) {
         return compiled_o(data_opl);
      } else {
         return null;
      }
   }
}

APPUTIL.createTemplateManager_px = function () {
   APPUTIL.template_manager = new APPUTIL.TemplateManager();
   APPUTIL.template_manager.init_px();
}
// EOF