# coding: utf-8

import datetime

class DateUtils:

   def __init__(self):
      self.today = datetime.datetime.now()

   def get_date(self, date):
      return datetime.datetime(int(date[:4]), int(date[5:7]), int(date[8:10]))