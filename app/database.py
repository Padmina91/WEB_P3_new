# coding: utf-8

from pathlib import Path
import os
import codecs
import json
import operator

from .dataid import DataId
from .validator import Validator

class Database:

   def __init__(self):
      self.data_dir = self.get_data_dir()
      self.employee_dir = self.get_employee_dir()
      self.training_dir = self.get_training_dir()
      self.validator = Validator()
      self.employee_data = None
      self.training_data = None
      self.max_id = DataId()
      self.read_employee_data()
      self.read_training_data()

# ---------------------------------------------------------------------------------------------------------------------------------

   def new_employee_entry(self, employee_data):
      id = self.max_id.create_new_id()
      dict_employee = dict()
      dict_employee["id"] = id
      dict_employee["Daten"] = employee_data
      self.employee_data.append(dict_employee)
      self.save_employee_data(id)
      return str(id)

   def new_training_entry(self, training_data):
      id = self.max_id.create_new_id()
      dict_training = dict()
      dict_training["id"] = id
      dict_training["Daten"] = training_data
      self.training_data.append(dict_training)
      self.save_training_data(id)
      return str(id)

   def read_employee(self, id=None):
      data = None
      if id is None:
         data = self.employee_data
      else:
         for employee in self.employee_data:
            if str(employee['id']) == str(id):
               data = employee['Daten']
               break
      return data

   def read_training(self, id=None):
      data = None
      if id is None:
         data = self.training_data
      else:
         for training in self.training_data:
            if str(training['id']) == str(id):
               data = training['Daten']
               break
      return data

   def update_employee_entry(self, id, employee_data):
      status = False
      for employee in self.employee_data:
         if str(employee['id']) == str(id):
            employee['Daten'] = employee_data
            self.save_employee_data(id)
            status = True
            break
      return status

   def update_training_entry(self, id, training_data):
      status = False
      for training in self.training_data:
         if str(training['id']) == str(id):
            training['Daten'] = training_data
            self.save_training_data(id)
            status = True
            break
      return status

   def save_qualification(self, id, index, bezeichnung):
      status = False
      for training in self.training_data:
         if str(training['id']) == str(id):
            qualifications = training[6]
            if len(qualifications) >= int(index):
               if int(index) == len(qualifications):
                  qualifications.append(bezeichnung) # neue Qualifikation hinzufügen
               else:
                  qualifications[int(index)] = bezeichnung # bereits vorhandene Qualifikation updaten
               self.save_training_data(id)
               status = True
               break
      return status

   def register_for_training(self, id_employee, id_training):
      status = False
      for training in self.training_data:
         if str(training['id']) == str(id_training):
            for employee in self.employee_data:
               if str(employee['id']) == str(id_employee):
                  employee[4][id_training] = "angemeldet"
                  self.save_employee_data(id_employee)
                  status = True
                  break
         if status:
            break
      return status

   def cancel_registration(self, id_employee, id_training):
      status = False
      for training in self.training_data:
         if str(training['id']) == str(id_training):
            for employee in self.employee_data:
               if str(employee['id']) == str(id_employee):
                  training_status = employee[4].get(id_training, 0)
                  if training_status == "angemeldet":
                     employee[4][id_training] = "storniert"
                     self.save_employee_data(id_employee)
                     status = True
                     break
         if status:
            break
      return status

   def cancel_participation(self, id_training, id_employee):
      status = False
      for training in self.training_data:
         if str(training['id']) == str(id_training):
            for employee in self.employee_data:
               if str(employee['id']) == str(id_employee):
                  training_status = employee[4].get(id_training, 0)
                  if training_status == "angemeldet" or training_status == "nimmt teil":
                     employee[4][id_training] = "abgebrochen"
                     self.save_employee_data(id_employee)
                     status = True
                     break
         if status:
            break
      return status

   def update_participation_status(self, id_training, id_employee, new_participation_status):
      status = False
      for training in self.training_data:
         if str(training['id']) == str(id_training):
            for employee in self.employee_data:
               if str(employee['id']) == str(id_employee):
                  training_status = employee[4].get(id_training, 0)
                  if training_status != "storniert" and training_status != "abgebrochen" and training_status != new_participation_status and training_status != 0:
                     employee[4][id_training] = new_participation_status
                     self.save_employee_data(id_employee)
                     status = True
                     break
         if status:
            break
      return status

   def delete_employee_entry(self, id):
      status = False
      file_name = str(id) + ".json"
      path_with_file_name = os.path.join(self.employee_dir, file_name)
      print(path_with_file_name)
      if (os.path.exists(path_with_file_name)):
         os.remove(path_with_file_name)
         self.read_employee_data() # update self.employee_data after deletion
         status = True
      return status

   def delete_training_entry(self, id):
      status = False
      file_name = str(id) + ".json"
      path_with_file_name = os.path.join(self.training_dir, file_name)
      if (os.path.exists(path_with_file_name)):
         os.remove(path_with_file_name)
         self.read_training_data() # update self.training_data after deletion
         status = True
      return status

   def save_employee(self, id_param, name, vorname, akadGrade, taetigkeit):
      id = id_param
      data = [name, vorname, akadGrade, taetigkeit]
      if id != "None":
         employee_data = self.read_employee(id)
         if employee_data is not None:
            data.append(employee_data[4])
            self.update_employee_entry(id, data)
         else:
            data.append({})
            self.new_employee_entry(data)

   def save_training(self, id_param, bezeichnung, von, bis, beschreibung, maxTeiln, minTeiln, qualification0, zertifikat):
      id = id_param
      data = [bezeichnung, von, bis, beschreibung, maxTeiln, minTeiln, [qualification0], [zertifikat]]
      if data[7][0] == "":
         data[7] = list()
      if id != "None":
         training_data = self.read_training(id)
         if training_data is not None:
            data[6] = self.training_data[id][6] # Qualifikationen (1 bis n)
            data[6][0] = qualification0
            self.update_training_entry(id, data)
      else:
         self.new_training_entry(data)

   def calculate_participation_training(self, id):
      data = list() # Aufbau jeweils: [id_employee, name, vorname, akad. Grade, Tätigkeit, Teilnahmestatus]
      for training in self.training_data:
         if str(training['id']) == str(id):
            for employee in self.employee_data:
               status = employee['Daten'][4].get(id, 0)
               if status == "angemeldet" or status == "nimmt teil" or status == "nicht erfolgreich beendet" or status == "erfolgreich beendet":
                  data.append([employee['id'], employee['Daten'][0], employee['Daten'][1], employee['Daten'][2], employee['Daten'][3], status])
      return data

   def calculate_participation_employee(self, id_param):
      data = list() # [[Trainings, zu denen sich Mitarbeiter anmelden kann], [bereits gebuchte, zukünftige Trainings]], jeweils Aufbau: [id, bezeichnung, von, bis, beschreibung]
      data.append(list())
      data.append(list())
      employee_data = self.read_employee(id_param)
      training_data = self.training_data
      already_registered_trainings = list()
      today = self.validator.today
      future_trainings = list()
      for k, v in employee_data[4].items():
         if v == "angemeldet":
            already_registered_trainings.append(k)
      for training in training_data:
         start_date = self.validator.get_date(training['Daten'][1])
         if start_date > today:
            future_trainings.append(training['id'])
      for id in future_trainings:
         if id not in already_registered_trainings:
            data[0].append([id, training_data[id][0], training_data[id][1], training_data[id][2], training_data[id][3]])
         else:
            data[1].append([id, training_data[id][0], training_data[id][1], training_data[id][2], training_data[id][3]])
      return data

   def calculate_participation_trainings(self):
      data = list()
      data.append(list()) # laufende Trainings
      data.append(list()) # abgeschlossene Trainings
      today = self.validator.today
      training_data = self.training_data
      for training in training_data:
         start_date = self.validator.get_date(training['Daten'][1])
         end_date = self.validator.get_date(training['Daten'][2])
         if start_date < today and end_date > today:
            data[0].append([training['id'], training['Daten'][0], training['Daten'][1], training['Daten'][2], training['Daten'][3], training['Daten'][4], training['Daten'][5]])
         elif end_date < today:
            data[1].append([training['id'], training['Daten'][0], training['Daten'][1], training['Daten'][2], training['Daten'][3], training['Daten'][4], training['Daten'][5]])
      return data

   def calculate_evaluation_employees(self):
      data = list()
      employees_alphabetical = list()
      trainings_chronological = list()
      for employee in self.employee_data:
         employees_alphabetical.append(employee['Daten'])
      employees_alphabetical.sort(key=operator.itemgetter(0))
      for training in self.training_data:
         trainings_chronological.append([training['id'], training['Daten'][0], training['Daten'][1], training['Daten'][2]])
      trainings_chronological.sort(key=operator.itemgetter(2))
      for employee in employees_alphabetical:
         data.append([employee[0], employee[1], employee[2], employee[3], list()])
      for i in range(len(employees_alphabetical)):
         for training in trainings_chronological:
            if training[0] in employees_alphabetical[i][4]:
               data[i][4].append([training[1], training[2], training[3], employees_alphabetical[i][4][training[0]]])
      return data

   def calculate_evaluation_trainings(self):
      trainings_alphabetical = list()
      for training in self.training_data:
         trainings_alphabetical.append([training['id'], training['Daten'][0], training['Daten'][1], training['Daten'][2], training['Daten'][3], training['Daten'][4], training['Daten'][5], list()])
      trainings_alphabetical.sort(key=operator.itemgetter(1))
      for training in trainings_alphabetical:
         for employee in self.employee_data:
            if training[0] in employee['Daten'][4] and employee['Daten'][4][training[0]] == "erfolgreich beendet":
               training[7].append([employee['Daten'][0], employee['Daten'][1], employee['Daten'][2], employee['Daten'][3]])
         training[7].sort(key=operator.itemgetter(0))
      return trainings_alphabetical

   def calculate_evaluation_certificates(self):
      certificates_alphabetical = list()
      for training in self.training_data:
         if len(training['Daten'][7]) == 1:
            certificates_alphabetical.append([training['id'], training['Daten'][7][0], list()])
      certificates_alphabetical.sort(key=operator.itemgetter(1))
      for i in range(len(certificates_alphabetical)):
         for employee in self.employee_data:
            if certificates_alphabetical[i][0] in employee['Daten'][4] and employee['Daten'][4][certificates_alphabetical[i][0]] == "erfolgreich beendet":
               certificates_alphabetical[i][2].append([employee['Daten'][0], employee['Daten'][1], employee['Daten'][2], employee['Daten'][3]])
         certificates_alphabetical[i][2].sort(key=operator.itemgetter(0))
      return certificates_alphabetical

   def calculate_home_data(self):
      num_of_employees = len(self.employee_data)
      num_of_trainings_in_planning = 0
      num_of_trainings_finished = 0
      num_of_trainings_currently_running = 0
      for training in self.training_data:
         print("in der calculate_home_data. training:")
         print(training)
         start_date = self.validator.get_date(training['Daten'][1])
         end_date = self.validator.get_date(training['Daten'][2])
         today = self.validator.today
         if start_date > today:
            num_of_trainings_in_planning += 1
         elif end_date < today:
            num_of_trainings_finished += 1
         elif start_date < today and end_date > today:
            num_of_trainings_currently_running += 1
      data = [num_of_employees, num_of_trainings_in_planning, num_of_trainings_currently_running, num_of_trainings_finished]
      return data

   def calculate_training_data(self, id):
      training_data = self.read_training[id]
      data = [training_data[0], training_data[1], training_data[2], training_data[7], training_data[6], list()]
      for employee in self.employee_data:
         if id in employee['Daten'][4]:
            data[5].append([employee['Daten'][0], employee['Daten'][1], employee['Daten'][2], employee['Daten'][3], employee['Daten'][4][id]])
      return data

# ---------------------------------------------------------------------------------------------------------------------------------

   def get_employee_default(self):
      return ['', '', '', '']

   def get_training_default(self):
      return ['', '', '', '', '', '', [], []]

# ---------------------------------------------------------------------------------------------------------------------------------

   def read_employee_data(self):
      list_employees = list()
      pathlist = Path(self.employee_dir).glob('*.json')
      for file in pathlist:
         try:
            dict_employee = dict()
            id = str(file).split('\\')[-1].split(".")[0]
            dict_employee["id"] = id
            dict_employee["Daten"] = json.load(codecs.open(os.path.join(self.employee_dir, str(file)), 'r', 'utf-8'))
            list_employees.append(dict_employee)
         except:
            self.employee_data = []
            return
      self.employee_data = list_employees
      return

   def read_training_data(self):
      list_trainings = list()
      pathlist = Path(self.training_dir).glob('*.json')
      for file in pathlist:
         try:
            dict_training = dict()
            id = str(file).split('\\')[-1].split(".")[0]
            dict_training["id"] = id
            dict_training["Daten"] = json.load(codecs.open(os.path.join(self.training_dir, str(file)), 'r', 'utf-8'))
            list_trainings.append(dict_training)
         except:
            self.training_data = []
            return
      self.training_data = list_trainings
      return

# ---------------------------------------------------------------------------------------------------------------------------------

   def save_employee_data(self, id):
      employee_data = self.read_employee(id)
      if employee_data != None:
         file_name = str(id) + ".json"
         with codecs.open(os.path.join(self.employee_dir, file_name), 'w', 'utf-8') as fp:
            json.dump(employee_data, fp, indent=3)

   def save_training_data(self, id):
      training_data = self.read_training(id)
      if training_data != None:
         file_name = str(id) + ".json"
         with codecs.open(os.path.join(self.training_dir, file_name), 'w', 'utf-8') as fp:
            json.dump(training_data, fp, indent=3)

   def get_data_dir(self):
      current_file = Path(os.path.abspath(__file__))
      mq_dir = current_file.parent.parent
      data_dir = os.path.join(mq_dir, 'data')
      return data_dir

   def get_employee_dir(self):
      employee_dir = os.path.join(self.data_dir, 'employees')
      return employee_dir

   def get_training_dir(self):
      training_dir = os.path.join(self.data_dir, 'trainings')
      return training_dir