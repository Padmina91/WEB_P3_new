# coding: utf-8

import cherrypy

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

   def __init__(self):
      self.database = Database()
      self.view = View()

   @cherrypy.expose
   def GET(self, id=None):
      return_value = ''
      if id == None:
         return_value = self.getList()
      else:
         return_value = self.getDetail(id)
      return return_value

   def getList(self):
      data_a = self.database.read()
      # default-Werte entfernen
      ndata_a = data_a[1:]
      return self.view.createList_px(ndata_a)

   def getDetail(self, id_spl):
      data_o = self.database.read(id_spl)
      return self.view.createDetail_px(data_o)