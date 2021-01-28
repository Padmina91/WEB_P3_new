# coding: utf-8

import cherrypy
import json
from .database import Database
from .view import View

class Application:

   exposed = True # gilt für alle Methoden

   def __init__(self):
      self.database = Database()
      self.view = View()

   def GET(self, id=None, training=False, employee=False):
      return_value = ''
      if training == 'True':
         if id == 'None':
            return_value = json.dumps(self.database.read_training())
         else:
            return_value = json.dumps(self.database.read_training(id))
      elif employee == 'True':
         if id == 'None':
            return_value = json.dumps(self.database.employee_data)
         else:
            return_value = json.dumps(self.database.read_employee(id))
      else:
         return_value = json.dumps(self.database.calculate_home_data())
      print(return_value)
      return return_value

   def DELETE(self, id=None, training=False, employee=False):
      return_value = ''
      if id != 'None':
         if employee == "True":
            self.database.delete_employee_entry(id)
            return_value = json.dumps(self.database.employee_data)
         elif training == "True":
            self.database.delete_training_entry(id)
            return_value = json.dumps(self.database.training_data)
      return return_value