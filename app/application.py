# coding: utf-8

import cherrypy
import json
from .database import Database
from .view import View

# Übersicht Anforderungen / Methoden

"""

Anforderung       GET
-------------------------
/                 Liste
                  liefern

/{id}             Detail
                  mit {id}
                  liefern
"""

class Application:

   exposed = True # gilt für alle Methoden

   def __init__(self):
      self.database = Database()
      self.view = View()

   def GET(self, id=None):
      data = self.database.employee_data
      return_value = ''
      if id == None:
         return_value = json.dumps(data)
      else:
         return_value = json.dumps(data)
      return return_value

   def DELETE(self, id=None):
      if id != None:
         self.database.delete_employee_entry(id)
      return json.dumps(self.database.employee_data)