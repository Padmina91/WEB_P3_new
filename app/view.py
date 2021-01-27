# coding: utf-8

import json

class View:

   def __init__(self):
      pass

   def createList_px(self, data_opl):
      retVal_o = {
         'data': data_opl
      }
      return json.dumps(data_opl)

   def createDetail_px(self, data_opl):
      retVal_o = {
         'data': data_opl
      }
      return json.dumps(data_opl)