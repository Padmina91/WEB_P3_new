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


   def GET(self, id=None, training=False, employee=False, form=False, index_qualification=None):
      return_value = ''
      if form != 'True': # Listen-Daten
         if training == 'True':
            if id == 'None' or id == None:
               return_value = self.database.training_data
            else:
               return_value = self.database.calculate_training_data(id)
         elif employee == 'True':
            if id == 'None' or id == None:
               return_value = self.database.employee_data
            else:
               return_value = self.database.calculate_employee_with_qual_and_certs(id)
         else:
            return_value = self.database.calculate_home_data()
      else: # Formular-Daten
         if training == 'True':
            if id == 'None' or id == None:
               return_value = self.database.get_training_default()
            else:
               return_value = self.database.get_training_with_id(id)
         elif employee == 'True':
            if id == 'None' or id == None:
               return_value = self.database.get_employee_default()
            else:
               return_value = self.database.get_employee_with_id(id)
         else: # Qualifikation
            if index_qualification == None or index_qualification == "None" or index_qualification == "":
               return_value = self.database.get_qualification_default(id)
            else:
               return_value = self.database.get_qualification_data(id, index_qualification)
      return json.dumps(return_value)


   def DELETE(self, id_training=None, id_employee=None, index_qualification=None):
      return_value = ''
      if id_training != 'None' and id_training != None:
         if index_qualification == 'None' or index_qualification == None:
            self.database.delete_training_entry(id_training)
            return_value = self.database.training_data
         else:
            self.database.delete_qualification(id_training, index_qualification)
            return_value = self.database.get_training_with_id(id_training)
      elif id_employee != 'None' and id_employee != None:
            self.database.delete_employee_entry(id_employee)
            return_value = self.database.employee_data
      return json.dumps(return_value)


   def POST(self, id_param=None, index=None, name=None, vorname=None, akadGrade=None, taetigkeit=None, bezeichnung=None, von=None, bis=None, beschreibung=None, maxTeiln=None, minTeiln=None, qualification0=None, zertifikat=None):
      if vorname != None and index == None: # es handelt sich um Mitarbeiter-Daten
         self.database.save_employee(id_param, name, vorname, akadGrade, taetigkeit)
      elif von != None: # es handelt sich um Weiterbildungs-Daten
         self.database.save_training(id_param, bezeichnung, von, bis, beschreibung, maxTeiln, minTeiln, qualification0, zertifikat)
      else: # es handelt sich um Qualifikations-Daten
         self.database.save_qualification(id_param, bezeichnung, index)

   def PUT(self, id_param=None, index=None, name=None, vorname=None, akadGrade=None, taetigkeit=None, bezeichnung=None, von=None, bis=None, beschreibung=None, maxTeiln=None, minTeiln=None, qualification0=None, zertifikat=None):
      if vorname != None and index == None: # es handelt sich um Mitarbeiter-Daten
         self.database.save_employee(id_param, name, vorname, akadGrade, taetigkeit)
      elif von != None: # es handelt sich um Weiterbildungs-Daten
         self.database.save_training(id_param, bezeichnung, von, bis, beschreibung, maxTeiln, minTeiln, qualification0, zertifikat)
      else:
         self.database.save_qualification(id_param, bezeichnung, index)