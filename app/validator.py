# coding: utf-8

import datetime

class Validator:

   def __init__(self):
      self.today = datetime.datetime.now()

   def is_date_correct(self, date_from, date_until):
      start_date = self.get_date(date_from)
      end_date = self.get_date(date_until)
      return end_date > start_date

   def is_training_currently_running(self, date_from, date_until):
      start_date = self.get_date(date_from)
      end_date = self.get_date(date_until)
      return start_date < self.today and end_date > self.today

   def is_training_finished(self, date_until):
      end_date = self.get_date(date_until)
      return end_date < self.today

   def get_date(self, date):
      return datetime.datetime(int(date[:4]), int(date[5:7]), int(date[8:10]))

   def is_num_participants_correct(self, minTeiln, maxTeiln):
      return int(minTeiln) > 0 and int(maxTeiln) > int(minTeiln)