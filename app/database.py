# coding: utf-8

class Database:

   def __init__(self):
      self.data_a = [
         {
            "id": "0",
            "col1": "default col1",
            "col2": "default col2"
         },
         {
            "id": "1",
            "col1": "Wert 1/1",
            "col2": "Wert 1/2"
         },
         {
            "id": "2",
            "col1": "Wert 2/1",
            "col2": "Wert 2/2"
         },
         {
            "id": "3",
            "col1": "Wert 3/1",
            "col2": "Wert 3/2"
         },
         {
            "id": "4",
            "col1": "Wert 4/1",
            "col2": "Wert 4/2"
         }
      ]

   def read(self, id_spl = None):
      data_o = None
      if id_spl == None:
         data_o = self.data_a
      else:
         id_i = int(id_spl)
         if id_i > 0 and  id_i < len(self.data_a):
            data_o = self.data_a[id_i]
         else:
            data_o = self.data_a[0]
      return data_o