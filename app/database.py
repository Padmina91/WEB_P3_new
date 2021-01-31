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
      if id == None or id == 'None' or id == '':
         data = self.employee_data
      else:
         for employee in self.employee_data:
            if str(employee['id']) == str(id):
               data = employee['Daten']
               break
      return data

   def read_training(self, id=None):
      data = None
      if id == None or id == 'None' or id == '':
         data = self.training_data
      else:
         for training in self.training_data:
            if str(training['id']) == str(id):
               data = training['Daten']
               break
      return data

   def get_employee_with_id(self, id):
      data = list()
      for employee in self.employee_data:
         if str(employee['id']) == str(id):
            data.append(id)
            data.append(self.read_employee(id))
      return data

   def get_training_with_id(self, id):
      data = list()
      for training in self.training_data:
         if str(training['id']) == str(id):
            data.append(id)
            data.append(self.read_training(id))
      return data

   def get_qualification_data(self, id_training, index):
      return_data = [id_training, '', '', '', index, ''] # [id_training, bezeichnung_training, von, bis, index_qualification, bezeichnung_qualification]
      for training in self.training_data:
         if str(training['id']) == str(id_training):
            return_data[1] = training['Daten'][0] # bezeichnung_training
            return_data[2] = training['Daten'][1] # von
            return_data[3] = training['Daten'][2] # bis
            return_data[5] = training['Daten'][6][int(index)] # bezeichnung_qualification
            break
      return return_data

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

   def delete_qualification(self, id, index):
      status = False
      index = int(index)
      for training in self.training_data:
         if str(training['id']) == str(id):
            if len(training['Daten'][6]) > index:
               del training['Daten'][6][index]
               self.save_training_data(id)
               status = True
            break
      return status

   def save_qualification(self, id, bezeichnung, index=None):
      status = False
      for training in self.training_data:
         if str(training['id']) == str(id):
            qualifications = training['Daten'][6]
            if index != None and int(index) < len(qualifications):
               qualifications[int(index)] = bezeichnung # bereits vorhandene Qualifikation updaten
            else:
               qualifications.append(bezeichnung) # neue Qualifikation hinzufügen
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
                  employee['Daten'][4][str(id_training)] = "angemeldet"
                  self.save_employee_data(id_employee)
                  status = True
                  break
            break
      return status

   def cancel_registration(self, id_employee, id_training):
      status = False
      for training in self.training_data:
         if str(training['id']) == str(id_training):
            for employee in self.employee_data:
               if str(employee['id']) == str(id_employee):
                  training_status = employee['Daten'][4].get(id_training, 0)
                  print("training_status: ")
                  print(training_status)
                  if training_status == "angemeldet":
                     employee['Daten'][4][str(id_training)] = "storniert"
                     self.save_employee_data(id_employee)
                     status = True
                     break
            break
      return status

   def cancel_participation(self, id_training, id_employee):
      status = False
      for training in self.training_data:
         if str(training['id']) == str(id_training):
            for employee in self.employee_data:
               if str(employee['id']) == str(id_employee):
                  training_status = employee['Daten'][4].get(id_training, 0)
                  if training_status == "angemeldet" or training_status == "nimmt teil":
                     employee['Daten'][4][str(id_training)] = "abgebrochen"
                     self.save_employee_data(id_employee)
                     status = True
                     break
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
         for employee in self.employee_data:
            for training_id in employee['Daten'][4].keys():
               if str(training_id) == str(id):
                  del employee['Daten'][4][training_id]
                  self.save_employee_data(employee['id'])
                  break
         status = True
      return status

   def save_employee(self, id_param, name, vorname, akadGrade, taetigkeit):
      id = id_param
      data = [name, vorname, akadGrade, taetigkeit]
      if id != "None" and id != None and id != "":
         employee_data = self.read_employee(id)
         if employee_data is not None:
            data.append(employee_data[4])
            self.update_employee_entry(id, data)
      else:
         data.append(dict())
         self.new_employee_entry(data)

   def save_training(self, id_param, bezeichnung, von, bis, beschreibung, maxTeiln, minTeiln, qualification0, zertifikat):
      id = -1
      if id_param != "":
         id = int(id_param)
      data = [bezeichnung, von, bis, beschreibung, maxTeiln, minTeiln, [qualification0], [zertifikat]]
      if data[7][0] == "":
         data[7] = list()
      if id != -1:
         training_data = self.read_training(id)
         if training_data is not None:
            data[6] = training_data[6] # Qualifikationen (1 bis n)
            data[6][0] = qualification0
            self.update_training_entry(id, data)
      else:
         self.new_training_entry(data)

   def calculate_participation_training(self, id):
      data = list() # Aufbau jeweils: [id_employee, name, vorname, akad. Grade, Tätigkeit, Teilnahmestatus]
      for training in self.training_data:
         if str(training['id']) == str(id):
            data.append(training['id'])
            data.append(training['Daten'])
            data.append(list())
            for employee in self.employee_data:
               status = employee['Daten'][4].get(id, 0)
               if status == "angemeldet" or status == "nimmt teil" or status == "nicht erfolgreich beendet" or status == "erfolgreich beendet":
                  data[2].append([employee['id'], employee['Daten'][0], employee['Daten'][1], employee['Daten'][2], employee['Daten'][3], status])
      return data

   def calculate_participation_employee(self, id_param):
      employee_data = self.read_employee(id_param)
      training_data = self.training_data
      already_registered_trainings = list()
      today = self.validator.today
      data = [id_param, employee_data]
      data.append(list())
      data.append(list())
      for k, v in employee_data[4].items():
         if v == "angemeldet":
            already_registered_trainings.append(int(k))
      for training in training_data:
         start_date = self.validator.get_date(training['Daten'][1])
         if start_date > today:
            if int(training['id']) not in already_registered_trainings:
               data[2].append([training['id'], training['Daten'][0], training['Daten'][1], training['Daten'][2], training['Daten'][3]])
            else:
               data[3].append([training['id'], training['Daten'][0], training['Daten'][1], training['Daten'][2], training['Daten'][3]])
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
      training_data = self.read_training(id)
      data = [training_data[0], training_data[1], training_data[2], training_data[7], training_data[6], list()]
      for employee in self.employee_data:
         if id in employee['Daten'][4]:
            data[5].append([employee['Daten'][0], employee['Daten'][1], employee['Daten'][2], employee['Daten'][3], employee['Daten'][4][id]])
      return data

   def calculate_employee_with_qual_and_certs(self, id):
      data = list() # Aufbau: [id, [Nachname, Vorname, akadGrad, Tätigkeit], [Qualifikationen], [Zertifikate], {id: WeiterbildungBezeichnung}]
      for employee in self.employee_data:
         if str(employee['id']) == str(id):
            data.append(id)
            data.append([employee['Daten'][0], employee['Daten'][1], employee['Daten'][2], employee['Daten'][3], employee['Daten'][4]])
            data.append(list())
            data.append(list())
            for k, v in employee['Daten'][4].items():
               if v == "erfolgreich beendet":
                  for training in self.training_data:
                     if str(training['id']) == str(k):
                        for qualification in training['Daten'][6]: # Qualifikationen 1 bis n
                           data[2].append(qualification)
                        if len(training['Daten'][7]) > 0:
                           data[3].append(training['Daten'][7][0]) # Zertifikat 0 oder 1
                        break
            break
      training_names = dict()
      for training in self.training_data:
         training_names[training['id']] = training['Daten'][0]
      data.append(training_names)
      return data

# ---------------------------------------------------------------------------------------------------------------------------------

   def get_qualification_default(self, id):
      return_data = [id] # [id_training, bezeichnung_training, von, bis, index_qualification, bezeichnung_qualification]
      for training in self.training_data:
         if str(training['id']) == str(id):
            return_data.append(training['Daten'][0]) # Bezeichnung Training
            return_data.append(training['Daten'][1]) # von
            return_data.append(training['Daten'][2]) # bis
            return_data.append(str(len(training['Daten'][6]))) # neuer Index
            return_data.append('') # Bezeichnung Qualification
            break
      return return_data

   def get_employee_default(self):
      return ['', ['', '', '', '']]

   def get_training_default(self):
      return ['', ['', '', '', '', '', '', [], []]]

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