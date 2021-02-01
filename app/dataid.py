# coding: utf-8

import uuid as id

class DataId:

   def __init__(self):
      pass

   def create_new_id(self):
      uuid = id.uuid4()
      return str(uuid)