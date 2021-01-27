# coding: utf-8

import os.path
import sys
import cherrypy

from app import application, template

def main():

   # Get current directory
   try:
      current_dir = os.path.dirname(os.path.abspath(__file__))
   except:
      current_dir = os.path.dirname(os.path.abspath(sys.executable))
   cherrypy.Application.current_dir = current_dir

   # disable autoreload
   cherrypy.engine.autoreload.unsubscribe()

   # activate logger
   cherrypy.config.update({'log.access_file': "access.log", 'log.error_file': "server.log", 'log.screen': True, })
   # suppress traceback-info
   cherrypy.config.update({'request.show_tracebacks': False})
   config_file_name = os.path.join(current_dir, 'server.conf')
   if os.path.exists(config_file_name) == False:
     config_file_name = None # Datei gibt es nicht

   # 1. Eintrag: Standardverhalten, Berücksichtigung der Konfigurationsangaben im server.conf
   cherrypy.tree.mount(
      None, '/', config_file_name
   )

   # 2. Eintrag: Method-Dispatcher für die "Applikation" "app" vereinbaren
   cherrypy.tree.mount(
      application.Application(),
      '/app',
      {'/': {
         'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
         'tools.response_headers.on': True,
         'tools.response_headers.headers': [('Content-Type', 'text/plain')]}
      }
   )

   # 3. Eintrag: Method-Dispatcher für die "Template" "templates" vereinbaren
   cherrypy.tree.mount(
      template.Template(),
      '/templates',
      {'/': {
         'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
         'tools.response_headers.on': True,
         'tools.response_headers.headers': [('Content-Type', 'text/plain')]}
      }
   )

   # Start server
   cherrypy.engine.start()
   cherrypy.engine.block()

if __name__ == '__main__':
   main()