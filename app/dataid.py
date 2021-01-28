# coding: utf-8

from pathlib import Path
import os.path
import codecs
import json

class DataId:

   def __init__(self):
      self.max_id = 0
      self.read_max_id()

   def create_new_id(self):
      self.max_id += 1
      self.save_max_id()
      return str(self.max_id)

   def get_current_max_id(self):
      return str(self.max_id)

   def read_max_id(self):
      try:
         current_file = Path(os.path.abspath(__file__))
         webteams_dir = current_file.parent.parent
         data_dir = os.path.join(webteams_dir, 'data')
         fp = codecs.open(os.path.join(data_dir, 'maxid.json'), 'r', 'utf-8')
      except:
         self.max_id = 0
         self.save_max_id()
      else:
         with fp:
            self.max_id = json.load(fp)
      return

   def save_max_id(self):
      current_file = Path(os.path.abspath(__file__))
      webteams_dir = current_file.parent.parent
      data_dir = os.path.join(webteams_dir, 'data')
      with codecs.open(os.path.join(data_dir, 'maxid.json'), 'w', 'utf-8') as fp:
         json.dump(self.max_id, fp)