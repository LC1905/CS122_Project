import csv
import training

def test():
    with open('creek.csv') as testfile:
        reader = csv.reader(testfile)
        for row in reader:
            print(row)
            process = training.process_sentence(row[0])
            print(process)