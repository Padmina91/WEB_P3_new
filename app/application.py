# coding: utf-8

import cherrypy
import simplejson
import json
from .database import Database
from .view import View

class Application:

   exposed = True # gilt für alle Methoden

   def __init__(self):
      self.database = Database()
      self.view = View()


   def GET(self, id=None, training=False, employee=False, form=False):
      return_value = ''
      if form != 'True': # Listen-Daten
         if training == 'True':
            if id == 'None' or id == None:
               print("Gebe alle Weiterbildungsdaten zurück...")
               return_value = self.database.training_data
            else:
               print("Gebe Weiterbildungsdaten von Weiterbildung " + id + " zurück...")
               return_value = self.database.read_training(id)
         elif employee == 'True':
            if id == 'None' or id == None:
               print("Gebe alle Mitarbeiterdaten zurück...")
               return_value = self.database.employee_data
            else:
               print("Gebe Mitarbeiterdaten von Mitarbeiter " + id + " zurück...")
               return_value = self.database.calculate_employee_with_qual_and_certs(id)
         else:
            return_value = self.database.calculate_home_data()
      else: # Formular-Daten
         if training == 'True':
            if id == 'None' or id == None:
               return_value = self.database.get_training_default()
            else:
               return_value = self.database.get_training_with_id(id)
         else:
            if id == 'None' or id == None:
               return_value = self.database.get_employee_default()
            else:
               return_value = self.database.get_employee_with_id(id)
      return json.dumps(return_value)


   def DELETE(self, id=None, training=False, employee=False):
      return_value = ''
      if id != 'None' and id != None:
         if employee == "True":
            self.database.delete_employee_entry(id)
            return_value = json.dumps(self.database.employee_data)
         elif training == "True":
            self.database.delete_training_entry(id)
            return_value = json.dumps(self.database.training_data)
      return return_value

   def POST(self, data=None):
      cl = cherrypy.request.headers['Content-Length']
      rawbody = cherrypy.request.body.read(int(cl))
      body = simplejson.loads(rawbody)
      print("body: ")
      print(body)

   def PUT(self, data=None):
      print(data)